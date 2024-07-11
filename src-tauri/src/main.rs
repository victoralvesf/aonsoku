// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use futures_util::StreamExt;
use regex::Regex;
use reqwest::{
    header::{HeaderMap, ACCEPT, CONTENT_DISPOSITION, USER_AGENT},
    Client, Url,
};
use serde::{Deserialize, Serialize};
use std::{fs::File, io::Write, path::PathBuf, time::Instant};
use tauri::Manager;
use tauri::{api::path::download_dir, AppHandle};

const UPDATE_SPEED: u128 = 50;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Progress {
    pub download_id: String,
    pub filesize: u64,
    pub transfered: u64,
    pub transfer_rate: f64,
    pub percentage: f64,
}

impl Progress {
    pub fn emit_progress(&self, handle: &AppHandle) {
        handle.emit_all("DOWNLOAD_PROGRESS", &self).ok();
    }

    pub fn emit_finished(&self, handle: &AppHandle) {
        handle.emit_all("DOWNLOAD_FINISHED", &self).ok();
    }
}

fn sanitize_filename(filename: &str) -> String {
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

fn get_filename_from_headers(headers: &HeaderMap) -> Option<String> {
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

#[tauri::command]
async fn download_file(
    url: String,
    file_id: String,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let client = Client::new();
    let parsed_url = Url::parse(&url).map_err(|e| e.to_string())?;
    let response = client
        .get(parsed_url)
        .header(
            USER_AGENT,
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
        )
        .header(ACCEPT, "application/octet-stream")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let total_size = response.content_length().unwrap_or(0);

    let file_name = get_filename_from_headers(response.headers())
        .unwrap_or_else(|| format!("{name}.zip", name = file_id));

    let download_path = download_dir().ok_or("Failed to get download directory")?;
    let save_path: PathBuf = [download_path, file_name.into()].iter().collect();

    let mut file = File::create(save_path).map_err(|e| e.to_string())?;
    let mut stream = response.bytes_stream();

    let mut downloaded_bytes: u64 = 0;
    let start_time = Instant::now();
    let mut last_update = Instant::now();

    let mut progress = Progress {
        download_id: file_id,
        filesize: total_size,
        transfered: 0,
        transfer_rate: 0.0,
        percentage: 0.0,
    };

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| e.to_string())?;
        file.write_all(&chunk).map_err(|e| e.to_string())?;

        downloaded_bytes += chunk.len() as u64;

        progress.transfered = downloaded_bytes;
        if total_size > 0 {
            progress.percentage = progress.transfered as f64 * 100.0 / total_size as f64;
        }
        progress.transfer_rate = (downloaded_bytes as f64) / start_time.elapsed().as_secs_f64();

        if last_update.elapsed().as_millis() >= UPDATE_SPEED {
            progress.emit_progress(&app_handle);
            last_update = std::time::Instant::now();
        }
    }

    progress.emit_finished(&app_handle);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![download_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
