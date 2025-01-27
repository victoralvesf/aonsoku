use std::{ptr, time::{Duration, SystemTime}};

pub use discord_sdk as discord;

use crate::playerstatus::PlayerStatus;

pub struct Client {
    pub discord: discord::Discord,
}


pub const APP_ID: discord::AppId = 1332231131336282125; // App ID Listed As Aonsoku, You May Change It If You Wish

pub static mut CURRENT_CLIENT: Option<Client> = None;
pub static mut CURRENT_STATUS: PlayerStatus = PlayerStatus {
    track_name: String::new(),
    album_name: String::new(),
    artist: String::new(),
    start_time: SystemTime::UNIX_EPOCH,
    end_time: SystemTime::UNIX_EPOCH
};

pub async fn make_client() {

    let (wheel, handler) = discord::wheel::Wheel::new(Box::new(|_err| {
        // Something went wrong, ignore it (most likely the user doesn't have discord)
    }));

    let mut user = wheel.user();

    let discord = match discord::Discord::new(discord::DiscordApp::PlainId(APP_ID), discord::Subscriptions::ACTIVITY, Box::new(handler)) {
        Ok(dc) => dc,
        Err(_err) => {
            return; // Something went wrong, ignore it (most likely the user doesn't have discord)
        }
    };

    unsafe {
        CURRENT_CLIENT = Some(
            Client {
                discord,
            }
        );
    }

    loop {
        tokio::time::sleep(Duration::from_millis(1000)).await;
        update_activity_status().await;
    }


}

pub async fn update_activity_status() {

    unsafe {

        let artist = CURRENT_STATUS.artist.to_owned();
        let album_name = CURRENT_STATUS.album_name.to_owned();

        let current_activity = discord::activity::ActivityBuilder::default()
            .details(CURRENT_STATUS.track_name.to_owned())
            .state(format!("{artist} • {album_name}"))
            .assets(
                discord::activity::Assets::default()
                    .large("https://github.com/victoralvesf/aonsoku/blob/main/public/icon_shadow.png?raw=true".to_owned(), Some("Aonsoku".to_owned()))
            )
            .kind(discord_sdk::activity::ActivityKind::Listening)
            .start_timestamp(CURRENT_STATUS.start_time)
            .end_timestamp(CURRENT_STATUS.end_time);
    
    
        let client = match &CURRENT_CLIENT {
            Some(c) => c,
            None => return,
        };
    
        let _ = client.discord.update_activity(current_activity).await; // Discard the result to _
    }

}