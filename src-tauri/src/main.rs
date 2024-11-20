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

#[cfg(target_os = "macos")]
mod mac;

mod commands;
mod progress;
mod utils;

fn main() {
    let mut app_builder = tauri::Builder::default();

    #[cfg(target_os = "macos")]
    {
        app_builder = app_builder.plugin(mac::window::init());
    }

    app_builder
        .invoke_handler(tauri::generate_handler![commands::download_file])
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            let main_window = app.get_webview_window("main").unwrap();
            main_window.create_overlay_titlebar().unwrap();

            #[cfg(target_os = "macos")]
            {
                use mac::window::setup_traffic_light_positioner;

                let window = app.get_window("main").unwrap();
                let window_ = window.clone();

                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::ThemeChanged(_theme) = event {
                        setup_traffic_light_positioner(window_.clone())
                    }
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
