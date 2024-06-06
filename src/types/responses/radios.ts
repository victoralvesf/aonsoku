import { SubsonicResponse } from "./subsonicResponse"

export interface RadioStationsResponse extends SubsonicResponse<{ internetRadioStations: RadioStation }> {}

export interface RadioStation {
  internetRadioStation: Radio[]
}

export interface CreateRadio {
  name: string
  streamUrl: string
  homePageUrl: string
}

export interface Radio extends CreateRadio {
  id: string
}