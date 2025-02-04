use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    App, Manager,
};

const QUIT_ID: &str = "quit";
const QUIT_LABEL: &str = "Quit";

pub fn setup_system_tray(app: &mut App) {
    let quit_i = match MenuItem::with_id(app, QUIT_ID, QUIT_LABEL, true, None::<&str>) {
        Ok(item) => item,
        Err(_) => return,
    };

    let menu = match Menu::with_items(app, &[&quit_i]) {
        Ok(m) => m,
        Err(_) => return,
    };

    let icon = match app.default_window_icon() {
        Some(i) => i.clone(),
        None => return,
    };

    let _ = TrayIconBuilder::<tauri::Wry>::new()
        .icon(icon)
        .menu(&menu)
        .menu_on_left_click(false)
        .on_menu_event(|app, event| {
            if event.id == QUIT_ID {
                app.exit(0);
            }
        })
        .on_tray_icon_event(|tray, event| {
            if matches!(
                event,
                TrayIconEvent::Click {
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Up,
                    ..
                }
            ) {
                if let Some(window) = tray.app_handle().get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .build(app);
}
