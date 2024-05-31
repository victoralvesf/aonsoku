use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu};

pub fn create_menu() -> Menu {
    let app_name = "Subsonic Player";

    let preferences = CustomMenuItem::new("preferences", "Preferences");

    let default_menu = Menu::new()
        .add_native_item(MenuItem::About(
            app_name.to_string(),
            AboutMetadata::default(),
        ))
        .add_native_item(MenuItem::Separator)
        .add_item(preferences)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Services)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Hide)
        .add_native_item(MenuItem::HideOthers)
        .add_native_item(MenuItem::ShowAll)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Quit);

    let subsonic_player = Submenu::new(app_name, default_menu);

    let menu = Menu::new().add_submenu(subsonic_player);

    return menu;
}
