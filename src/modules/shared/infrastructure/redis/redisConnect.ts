import IORedis, { Redis } from 'ioredis'

let redisClient: Redis | undefined

export function getClient(): Redis {
  if (!redisClient) {
    throw new Error('Redis is not connected')
  }
  return redisClient
}

export async function connect(): Promise<void> {
  redisClient = new IORedis('redis://redis:6379')

  return await new Promise((resolve, reject) => {
    redisClient?.on('ready', () => {
      console.log('redis ready')
      resolve()
    })

    redisClient?.on('error', (error: Error) => {
      console.log(`Redis connection failure: ${error.message}`)
      reject(error)
    })
  })
}
