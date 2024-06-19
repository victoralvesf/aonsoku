import { SubsonicResponse } from './subsonicResponse'

export interface CreateRadio {
  name: string
  streamUrl: string
  homePageUrl: string
}

export interface Radio extends CreateRadio {
  id: string
}
export interface RadioStation {
  internetRadioStation: Radio[]
}

export interface RadioStationsResponse
  extends SubsonicResponse<{ internetRadioStations: RadioStation }> {}
