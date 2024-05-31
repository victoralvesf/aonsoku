// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod menu;
use menu::create_menu;

fn main() {
    let os = std::env::consts::OS;
    let tauri_context = tauri::generate_context!();

    if os != "macos" {
        tauri::Builder::default()
            .plugin(tauri_plugin_store::Builder::default().build())
            .invoke_handler(tauri::generate_handler![])
            .run(tauri_context)
            .expect("error while running tauri application");
    } else {
        let menu = create_menu();
        tauri::Builder::default()
            .menu(menu)
            .plugin(tauri_plugin_store::Builder::default().build())
            .invoke_handler(tauri::generate_handler![])
            .run(tauri_context)
            .expect("error while running tauri application");
    }
}
