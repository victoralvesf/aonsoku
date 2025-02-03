// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use std::{ptr::null, thread};

#[cfg(not(target_os = "linux"))]
use tauri::Manager;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate cocoa;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

#[cfg(target_os = "macos")]
mod mac;

mod discord;
mod playerstatus;

mod commands;
mod progress;
mod utils;

#[tokio::main]
async fn main() {
    let builder = tauri::Builder::default();

    #[cfg(target_os = "macos")]
    let builder = builder.plugin(mac::window::init());

    // Spawn the discord RPC handler on another thread
    use discord::rpc::make_client;

    #[cfg(any(target_os = "windows", target_os = "linux"))]
    tokio::task::spawn(make_client());

    builder
        .setup(|_app| {
            #[cfg(target_os = "macos")]
            {
                use mac::window::setup_traffic_light_positioner;

                let window = _app.get_window("main").unwrap();
                let window_ = window.clone();

                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::ThemeChanged(_theme) = event {
                        setup_traffic_light_positioner(window_.clone())
                    }
                });
            }

            #[cfg(target_os = "windows")]
            {
                let main_window = _app.get_webview_window("main").unwrap();
                let _ = main_window.set_decorations(false);
            }

            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![commands::download_file])
        .invoke_handler(tauri::generate_handler![commands::update_player_status])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
