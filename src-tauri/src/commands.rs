use futures_util::StreamExt;
use reqwest::{header::ACCEPT, Client, Url};

use dirs::download_dir;
use std::{fs::File, io::Write, path::PathBuf, time::{Duration, SystemTime}};

use crate::{discord::rpc::{self, discord}, progress::Progress, utils::get_filename};

#[tauri::command]
pub async fn download_file(
    url: String,
    file_id: String,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let client = Client::new();
    let parsed_url = Url::parse(&url).map_err(|e| e.to_string())?;
    let response = client
        .get(parsed_url)
        .header(ACCEPT, "application/octet-stream")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let total_size = response.content_length().unwrap_or(0);

    let file_name = get_filename(response.headers(), &file_id).unwrap();

    let download_path = download_dir().unwrap();
    let save_path: PathBuf = [download_path, file_name.into()].iter().collect();

    let mut file = File::create(save_path).map_err(|e| e.to_string())?;
    let mut stream = response.bytes_stream();

    let progress = Progress {
        download_id: file_id,
        filesize: total_size,
        transfered: 0,
        transfer_rate: 0.0,
        percentage: 0.0,
    };

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| e.to_string())?;
        file.write_all(&chunk).map_err(|e| e.to_string())?;
    }

    progress.emit_finished(&app_handle);
    Ok(())
}


#[tauri::command]
pub async fn update_player_status(
    track_name: String,
    album_name: String,
    artist: String,
    start_time: u64,
    end_time: u64,
    is_paused: bool
) -> Result<(), String> {

    use rpc::CURRENT_STATUS;

    unsafe {
        CURRENT_STATUS.track_name = track_name;
        CURRENT_STATUS.artist = artist;
        CURRENT_STATUS.album_name = album_name;
        CURRENT_STATUS.start_time = SystemTime::from(SystemTime::UNIX_EPOCH + Duration::from_millis(start_time));
        CURRENT_STATUS.end_time = SystemTime::from(SystemTime::UNIX_EPOCH + Duration::from_millis(end_time));
    }

    Ok(())
}
