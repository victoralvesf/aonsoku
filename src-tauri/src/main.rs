// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Deserialize;
use tauri::Manager;

mod menu;
use menu::create_menu;

#[derive(Deserialize)]
struct LoginPayload {
    user: String,
    server: String,
}

fn main() {
    tauri::Builder::default()
        .menu(create_menu())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            let app_handle = app.handle();
            let main_window = app.get_window("main").unwrap();
            let menu_handle = main_window.menu_handle();

            let menu_handle_clone = menu_handle.clone();

            tauri::async_runtime::spawn(async move {
                app_handle.listen_global("user-logged-in", move |event| {
                    if let Some(payload_str) = event.payload() {
                        if let Ok(payload) = serde_json::from_str::<LoginPayload>(payload_str) {
                            let _ = menu_handle.get_item("user").set_title(payload.user);
                            let _ = menu_handle.get_item("url").set_title(payload.server);
                            let _ = menu_handle.get_item("logout").set_enabled(true);
                        }
                    }
                });

                app_handle.listen_global("user-logged-out", move |_event| {
                    let _ = menu_handle_clone.get_item("user").set_title("No user");
                    let _ = menu_handle_clone.get_item("url").set_title("No server");
                    let _ = menu_handle_clone.get_item("logout").set_enabled(false);
                });
            });

            Ok(())
        })
        .on_menu_event(|event| match event.menu_item_id() {
            "logout" => {
                let window = event.window();
                window.emit("user-asked-for-logout", {}).unwrap();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
