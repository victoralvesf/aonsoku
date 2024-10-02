import { httpClient } from '@/api/httpClient'
import {
  CreateRadio,
  Radio,
  RadioStationsResponse,
} from '@/types/responses/radios'
import { SubsonicResponse } from '@/types/responses/subsonicResponse'

async function getAll() {
  const response = await httpClient<RadioStationsResponse>(
    '/getInternetRadioStations',
    {
      method: 'GET',
    },
  )

  return response?.data.internetRadioStations.internetRadioStation || []
}

async function create({ name, streamUrl, homePageUrl }: CreateRadio) {
  await httpClient<SubsonicResponse>('/createInternetRadioStation', {
    method: 'POST',
    query: {
      streamUrl,
      name,
      homepageUrl: homePageUrl,
    },
  })
}

async function update({ id, streamUrl, name, homePageUrl = '' }: Radio) {
  await httpClient<SubsonicResponse>('/updateInternetRadioStation', {
    method: 'GET',
    query: {
      id,
      streamUrl,
      name,
      homepageUrl: homePageUrl,
    },
  })
}

async function remove(id: string) {
  await httpClient<SubsonicResponse>('/deleteInternetRadioStation', {
    method: 'GET',
    query: {
      id,
    },
  })
}

export const radios = {
  getAll,
  create,
  update,
  remove,
}
