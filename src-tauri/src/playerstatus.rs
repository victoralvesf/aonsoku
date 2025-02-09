use std::time::SystemTime;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PlayerStatus {
    pub track_name: String,
    pub album_name: String,
    pub artist: String,
    pub end_time: SystemTime,
    pub start_time: SystemTime,
    pub is_paused: bool
}