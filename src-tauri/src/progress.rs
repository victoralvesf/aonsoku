use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Progress {
    pub download_id: String,
    pub filesize: u64,
    pub transfered: u64,
    pub transfer_rate: f64,
    pub percentage: f64,
}

impl Progress {
    pub fn emit_progress(&self, handle: &AppHandle) {
        handle.emit_all("DOWNLOAD_PROGRESS", &self).ok();
    }

    pub fn emit_finished(&self, handle: &AppHandle) {
        handle.emit_all("DOWNLOAD_FINISHED", &self).ok();
    }
}
