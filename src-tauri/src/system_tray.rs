use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    App, AppHandle, Manager, Runtime,
};

struct TrayState<R: Runtime>(tauri::tray::TrayIcon<R>);

impl<R: Runtime> std::ops::Deref for TrayState<R> {
    type Target = tauri::tray::TrayIcon<R>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

const QUIT_ID: &str = "quit";
const QUIT_LABEL: &str = "Quit";
const SHOW_WINDOW_ID: &str = "show_window";

fn handle_error<T>(result: Result<T, Box<dyn std::error::Error>>) -> Option<T> {
    result.map_err(|e| eprintln!("Error occurred: {}", e)).ok()
}

// This function creates the system tray menu
fn create_menu<R: Runtime>(app: &AppHandle<R>) -> Option<Menu<R>> {
    let main_window = app.get_webview_window("main")?;
    let initial_visible = main_window.is_visible().unwrap_or(false);
    let show_label = if initial_visible { "Hide" } else { "Show" };
    let show_window_i = handle_error(
        MenuItem::with_id(app, SHOW_WINDOW_ID, show_label, true, None::<&str>)
            .map_err(|e| e.into()),
    )?;

    let quit_i = handle_error(
        MenuItem::with_id(app, QUIT_ID, QUIT_LABEL, true, None::<&str>).map_err(|e| e.into()),
    )?;

    handle_error(Menu::with_items(app, &[&show_window_i, &quit_i]).map_err(|e| e.into()))
}

// This function sets up the system tray
pub fn setup_system_tray(app: &mut App) -> Option<()> {
    let menu = create_menu(&app.app_handle())?;

    let icon = app.default_window_icon()?.clone();
    let app_title = app.package_info().name.clone();

    let tray = handle_error(
        TrayIconBuilder::<tauri::Wry>::new()
            .icon(icon)
            .menu(&menu)
            .tooltip(app_title)
            .menu_on_left_click(false)
            .on_menu_event(|app, event| handle_menu_event(app, event))
            .on_tray_icon_event(|tray, event| handle_tray_event(tray, event))
            .build(app)
            .map_err(|e| e.into()),
    )?;

    app.manage(TrayState(tray));
    Some(())
}

// This function is called when a menu item is clicked
fn handle_menu_event<R: Runtime>(app: &AppHandle<R>, event: tauri::menu::MenuEvent) {
    match event.id.as_ref() {
        QUIT_ID => app.exit(0),
        SHOW_WINDOW_ID => {
            let _ = toggle_window(&app);
        }
        _ => {}
    }
}

// This function is called when the tray icon is clicked
fn handle_tray_event<R: Runtime>(tray: &tauri::tray::TrayIcon<R>, event: TrayIconEvent) {
    if matches!(
        event,
        TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        }
    ) {
        let app_handle = tray.app_handle();
        let main_window = app_handle.get_webview_window("main").unwrap();

        // Focus the window if it's visible, otherwise show it
        if let Some(is_window_visible) = main_window.is_visible().ok() {
            let _ = if is_window_visible {
                let _ = main_window.set_focus();
            } else {
                toggle_window(app_handle);
            };
        }
    }
}

// This function toggles the visibility of the main window
pub fn toggle_window<R: Runtime>(app: &AppHandle<R>) -> Option<()> {
    let window = app.get_webview_window("main")?;
    let is_window_visible = window.is_visible().ok()?;

    let result = if is_window_visible {
        window.hide()
    } else {
        window
            .show()
            .and_then(|_| window.unminimize())
            .and_then(|_| window.set_focus())
    };

    handle_error(result.map_err(|e| e.into()))?;

    let tray_state = app.state::<TrayState<R>>();
    let tray = &tray_state.0;

    let menu = create_menu(app)?;
    handle_error(tray.set_menu(Some(menu)).map_err(|e| e.into()))?;
    Some(())
}
