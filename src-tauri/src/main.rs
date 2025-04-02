// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use proxy::proxy::spawn_proxy_server;
#[cfg(not(target_os = "windows"))]
use tauri::Manager;

#[cfg(target_os = "macos")]
extern crate cocoa;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

#[cfg(target_os = "macos")]
mod mac;

mod commands;
mod progress;
mod proxy;
mod utils;

#[tokio::main]
async fn main() {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init());

    #[cfg(target_os = "macos")]
    {
        builder = builder.plugin(mac::window::init());
    }

    tokio::task::spawn(async move {
        if let Err(e) = spawn_proxy_server().await {
            eprintln!("Proxy server error: {}", e);
        }
    });

    builder
        .setup(|_app| {
            #[cfg(not(target_os = "windows"))]
            let window = _app.get_window("main").unwrap();

            // Only show window after a few seconds, to avoid flashy colors
            #[cfg(not(target_os = "windows"))]
            {
                tokio::spawn(async move {
                    tokio::time::sleep(std::time::Duration::from_secs(2)).await;
                    let _ = window.show();
                });
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::download_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
