/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { getClient } from '@shared/infrastructure/redis/redisConnect'
import { NextFunction, Response } from 'express'
import * as request from 'request'

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isCached = async (req: any, res: Response, next: NextFunction) => {
  const redisClient = getClient()
  const cached = await redisClient.get('access_token')

  if (cached) {
    req.token = cached
    next()
  } else {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: 'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      form: {
        grant_type: 'client_credentials',
      },
      json: true,
    }

    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // use the access token to access the Spotify Web API
        const token = body.access_token
        await redisClient.setex('access_token', 3600, token)
        req.token = token
        next()
      } else {
        res.status(500).json({ error: { msg: 'internal server error' } })
      }
    })
  }
}
