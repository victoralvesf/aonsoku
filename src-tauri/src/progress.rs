use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Progress {
    pub download_id: String,
    pub filesize: u64,
    pub transfered: u64,
    pub transfer_rate: f64,
    pub percentage: f64,
}

impl Progress {
    pub fn emit_finished(&self, handle: &AppHandle) {
        handle.emit("DOWNLOAD_FINISHED", &self).unwrap();
    }
}
