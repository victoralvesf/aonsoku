import { httpClient } from "@/api/httpClient";
import { SubsonicResponse } from "@/types/responses/subsonicResponse";

async function pingView() {
  try {
    const response = await httpClient<SubsonicResponse>('/ping.view', {
      method: 'GET'
    })

    if (response?.data.status === 'ok') {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
    return false
  } 
}

export const ping = {
  pingView
}
