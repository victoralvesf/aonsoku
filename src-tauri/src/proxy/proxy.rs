use bytes::Bytes;
use http_body_util::Full;
use hyper::body::Incoming;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};
use hyper_tls::HttpsConnector;
use hyper_util::client::legacy::{connect::HttpConnector, Client};
use hyper_util::rt::{TokioExecutor, TokioIo};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use url::Url;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error + Send + Sync>>;

// Create type alias for the client
type HttpClient = Client<HttpsConnector<HttpConnector>, Full<Bytes>>;

// Function to handle the proxy request
async fn proxy_request(client: &HttpClient, url: &str) -> Result<Response<Incoming>> {
    let mut current_url = url.to_string();
    let mut redirect_count = 0;
    const MAX_REDIRECTS: u8 = 10;

    loop {
        let mut request = Request::builder().uri(current_url.clone()).method("GET");

        // Add common headers
        request = request.header("accept", "*/*");
        request = request.header("accept-encoding", "identity"); // Avoid compression for audio

        let response = client
            .request(request.body(Full::new(Bytes::new()))?)
            .await?;
        let status = response.status();

        if status.is_redirection() {
            redirect_count += 1;
            if redirect_count > MAX_REDIRECTS {
                return Err("Too many redirects".into());
            }

            if let Some(location) = response.headers().get("location") {
                current_url = if location.to_str()?.starts_with("http") {
                    location.to_str()?.to_string()
                } else {
                    let base_url = Url::parse(&current_url)?;
                    base_url.join(location.to_str()?)?.to_string()
                };
                continue;
            }
        }

        // Create new response with filtered headers
        let mut builder = Response::builder().status(status);
        let headers = builder.headers_mut().unwrap();

        // Copy relevant headers
        for (key, value) in response.headers() {
            match key.as_str() {
                "content-type" | "content-length" | "accept-ranges" | "cache-control" => {
                    headers.insert(key, value.clone());
                }
                _ => {}
            }
        }

        // If content-type is not set, default to octet-stream
        if !headers.contains_key("content-type") {
            headers.insert("content-type", "application/octet-stream".parse().unwrap());
        }

        // If cache-control is not set, default to no-cache
        if !headers.contains_key("cache-control") {
            headers.insert("cache-control", "no-cache".parse().unwrap());
        }

        return Ok(builder.body(response.into_body())?);
    }
}

// Handler for incoming requests
async fn handle_request(client: &HttpClient, req: Request<Incoming>) -> Result<Response<Incoming>> {
    // Parse the URL from query parameters
    let uri = req.uri();
    let query = uri.query().unwrap_or("");
    let params: Vec<(String, String)> = url::form_urlencoded::parse(query.as_bytes())
        .into_owned()
        .collect();

    let url = params
        .iter()
        .find(|(k, _)| k == "url")
        .map(|(_, v)| v.as_str())
        .unwrap();

    return proxy_request(client, url).await;
}

pub async fn spawn_proxy_server() -> Result<()> {
    // Create HTTPS-capable client
    let https = HttpsConnector::new();
    let client: HttpClient = Client::builder(TokioExecutor::new()).build(https);

    // Configure the server
    let addr = SocketAddr::from(([127, 0, 0, 1], 12720));
    let listener = TcpListener::bind(addr).await?;

    println!("Proxy server running on http://{}", addr);

    loop {
        let (stream, _) = listener.accept().await?;
        let io = TokioIo::new(stream);
        let client = client.clone();

        tokio::task::spawn(async move {
            if let Err(err) = http1::Builder::new()
                .serve_connection(io, service_fn(|req| handle_request(&client, req)))
                .await
            {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}
