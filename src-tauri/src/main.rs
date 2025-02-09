// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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
mod system_tray;
mod utils;

fn main() {
    let mut builder = tauri::Builder::default();

    #[cfg(target_os = "macos")]
    let builder = builder.plugin(mac::window::init());

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(_) = app.get_webview_window("main") {
                system_tray::toggle_window(app);
            }
        }));
    }

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

            #[cfg(desktop)]
            system_tray::setup_system_tray(_app);

            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![commands::download_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
