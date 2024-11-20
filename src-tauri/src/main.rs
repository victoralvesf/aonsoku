// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_decorum::WebviewWindowExt;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate cocoa;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

mod commands;
mod progress;
mod tlpos;
mod utils;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Create a custom titlebar for main window
            // On Windows this hides decoration and creates custom window controls
            // On macOS it needs hiddenTitle: true and titleBarStyle: overlay
            let main_window = app.get_webview_window("main").unwrap();
            main_window.create_overlay_titlebar().unwrap();

            // Some macOS-specific helpers
            #[cfg(target_os = "macos")]
            {
                let window = app.get_window("main").unwrap();
                let window_ = window.clone();

                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::ThemeChanged(_theme) = event {
                        tlpos::setup_traffic_light_positioner(window_.clone())
                    }
                });
            }

            Ok(())
        })
        .plugin(tlpos::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![commands::download_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
