import { Client } from 'discord-rpc'
import { productName } from '../../../package.json'
import { execSync } from 'child_process'

const ActivityType = {
  Playing: 0,
  Streaming: 1,
  Listening: 2,
  Watching: 3,
  Custom: 4,
  Competing: 5,
}

type IActivity = {
  timestamps?: {
    start?: number
    end?: number
  }
  details?: string
  state?: string
  assets?: {
    large_image?: string
    large_text?: string
    small_image?: string
    small_text?: string
  }
  instance?: boolean
  type?: number
}

export type PayloadType = {
  pid: number
  activity: IActivity | null
}

export const DEFAULT_LARGE_IMAGE = 'icon'
export const DEFAULT_SMALL_IMAGE = 'song_icon'

let discord: Client | null = null
let lastActivity: IActivity | null = null
let spoofPid: number | null = null
let refreshInterval: NodeJS.Timeout | null = null

function getSpoofPid(): number {
  if (spoofPid) return spoofPid
  try {
    const stdout = execSync('pgrep -f vesktop || pgrep -f Vesktop || pgrep -f discord || pgrep -f Discord').toString()
    const pids = stdout.split('\n').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
    if (pids.length > 0) {
      spoofPid = pids[0]
      return spoofPid
    }
  } catch (e) {}
  return process.pid
}

function init() {
  if (discord) return

  console.log('Initializing Discord RPC...')
  discord = new Client({ transport: 'ipc' })

  discord.on('ready', async () => {
    console.log('Discord RPC ready. User:', discord?.user?.username)
    if (lastActivity) {
      updateStatus()
    }
    
    if (refreshInterval) clearInterval(refreshInterval)
    refreshInterval = setInterval(() => {
      if (lastActivity) updateStatus()
    }, 15000)
  })

  discord.on('disconnected', () => {
    console.log('Discord RPC disconnected.')
    if (refreshInterval) clearInterval(refreshInterval)
    refreshInterval = null
    discord = null
    setTimeout(() => init(), 1000).unref()
  })
  loginRPC()
}

function loginRPC() {
  if (!discord) return
  
  const DISCORD_CLIENT_ID = import.meta.env.MAIN_VITE_DISCORD_CLIENT_ID

  if (!DISCORD_CLIENT_ID) {
    console.warn('Discord Client ID not found in environment variables.')
    return
  }

  console.log('Logging in to Discord RPC with Client ID:', DISCORD_CLIENT_ID)
  discord.login({ clientId: DISCORD_CLIENT_ID }).catch((err) => {
    console.error('Discord RPC login failed:', err.message)
    setTimeout(() => loginRPC(), 5000).unref()
  })
}

function updateStatus() {
  if (!discord || !discord.user || !lastActivity) return

  const activity: any = {
    details: lastActivity.details,
    state: lastActivity.state,
    instance: true,
    type: 2, // Listening
  }

  // Convert milliseconds to seconds for Discord
  if (lastActivity.timestamps) {
    activity.timestamps = {}
    if (lastActivity.timestamps.start) {
      activity.timestamps.start = lastActivity.timestamps.start > 1000000000000 
        ? Math.floor(lastActivity.timestamps.start / 1000) 
        : lastActivity.timestamps.start
    }
    if (lastActivity.timestamps.end) {
      activity.timestamps.end = lastActivity.timestamps.end > 1000000000000 
        ? Math.floor(lastActivity.timestamps.end / 1000) 
        : lastActivity.timestamps.end
    }
  }

  // Assets (Images) - Using snake_case for raw wire protocol
  activity.assets = {
    large_image: lastActivity.assets?.large_image || DEFAULT_LARGE_IMAGE,
    large_text: lastActivity.assets?.large_text || productName,
    small_image: DEFAULT_SMALL_IMAGE,
    small_text: lastActivity.assets?.small_text || 'Playing'
  }

  const payload = {
    pid: getSpoofPid(),
    activity,
  }

  console.log('Discord RPC Payload:', JSON.stringify(payload, null, 2))
  
  // @ts-expect-error raw request
  discord.request('SET_ACTIVITY', payload).catch((err) => {
    console.error('Error in SET_ACTIVITY:', err)
  })
}

function set(data: IActivity | null) {
  lastActivity = data

  if (!discord || !discord.user) {
    if (!discord) init()
    return
  }

  updateStatus()
}

export const RPC = {
  init,
  set,
}
