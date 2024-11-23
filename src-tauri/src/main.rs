// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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

mod commands;
mod progress;
mod utils;

#[cfg(target_os = "macos")]
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            use mac::window::setup_traffic_light_positioner;

            let window = app.get_window("main").unwrap();
            let window_ = window.clone();

            window.on_window_event(move |event| {
                if let tauri::WindowEvent::ThemeChanged(_theme) = event {
                    setup_traffic_light_positioner(window_.clone())
                }
            });

            Ok(())
        })
        .plugin(mac::window::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![commands::download_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(target_os = "windows")]
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_webview_window("main").unwrap();
            let _ = main_window.set_decorations(false);

            Ok(())
        })
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![commands::download_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(target_os = "linux")]
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![commands::download_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
