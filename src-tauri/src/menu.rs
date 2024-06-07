use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

pub fn create_menu() -> Menu {
    let app_name = "Subsonic Player";

    let server = Submenu::new(
        "Server",
        Menu::new()
            .add_item(CustomMenuItem::new("user", "Disconnected").disabled())
            .add_item(CustomMenuItem::new("url", "").disabled())
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("logout", "Logout")),
    );

    let mut default_menu = Menu::os_default(app_name);
    default_menu = default_menu.add_submenu(server);

    return default_menu;
}
