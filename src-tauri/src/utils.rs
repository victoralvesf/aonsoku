use regex::Regex;
use reqwest::header::{HeaderMap, CONTENT_DISPOSITION, CONTENT_TYPE};

pub fn get_filename(headers: &HeaderMap, file_id: &str) -> Option<String> {
    if let Some(filename) = get_filename_from_headers(headers) {
        return Some(filename);
    }

    if let Some(content_type) = headers.get(CONTENT_TYPE) {
        if let Ok(content_type) = content_type.to_str() {
            let extension = get_extension_from_content_type(content_type);
            let filename = format!("{name}.{ext}", name = file_id, ext = extension);
            return Some(filename);
        }
    }

    None
}

pub fn get_filename_from_headers(headers: &HeaderMap) -> Option<String> {
    if let Some(content_disposition) = headers.get(CONTENT_DISPOSITION) {
        if let Ok(content_disposition) = content_disposition.to_str() {
            let re = Regex::new(r#"filename="?([^"]+)"?"#).unwrap();
            if let Some(caps) = re.captures(content_disposition) {
                let filename = &caps[1];
                let sanitized_filename = sanitize_filename(filename);
                return Some(sanitized_filename);
            }
        }
    }
    None
}

pub fn sanitize_filename(filename: &str) -> String {
    filename
        .chars()
        .map(|c| {
            if c.is_alphanumeric()
                || c == '.'
                || c == '_'
                || c == '-'
                || c == ' '
                || c == '('
                || c == ')'
            {
                c
            } else {
                '_'
            }
        })
        .collect()
}

pub fn get_extension_from_content_type(content_type: &str) -> String {
    match content_type {
        "text/plain" => "txt",
        "application/json" => "json",
        "application/pdf" => "pdf",
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "application/zip" => "zip",
        "audio/flac" => "flac",
        "audio/mpeg" => "mp3",
        "audio/wav" => "wav",
        "audio/vnd.wav" => "wav",
        "audio/x-aiff" => "aiff",
        "audio/aiff" => "aiff",
        "audio/mp4" => "m4a",
        _ => "bin",
    }
    .to_string()
}
