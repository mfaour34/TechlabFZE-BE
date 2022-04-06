import { once } from 'events'
import * as http from 'http'
import express, { Response, Request, NextFunction, Application } from 'express'
import helmet from 'helmet'
import { env } from 'process'
import morgan from 'morgan'
import { AccessTokensProvider } from '@shared/types/AccessTokensProvider'
import { applyHealthCheckRoutes } from './healthCheck/healthCheckRoutes'
import { applyArtistRoutes } from '@artists/api/artistRoutes'
import { isCached } from '@shared/utils/isCached'

const HTTP_PORT = parseInt(env.HTTP_PORT as string)

let server: http.Server

export const startHttpServer = async (accessTokensProvider: AccessTokensProvider | undefined): Promise<http.Server> => {
  let app
  if (accessTokensProvider) {
    app = createApp(accessTokensProvider)
  } else {
    app = createApp(undefined)
  }

  applySystemRoutes(app)

  server = app.listen(HTTP_PORT)

  await once(server, 'listening')
  const appEnv: unknown = app.get('env')
  console.log(`REST server is running at http://localhost:${HTTP_PORT} in ${String(appEnv)} mode`)

  return server
}

function applySystemRoutes(app: Application) {
  applyHealthCheckRoutes(app)
  applyArtistRoutes(app)
}

// eslint-disable-next-line no-unused-vars
export function createApp(_accessTokensProvider: AccessTokensProvider | undefined): express.Express {
  const app = express()
  app.disable('x-powered-by')

  app.use(morgan('short'))
  app.use(helmet())

  app.use(express.json({ limit: '10mb' }))

  app.use(errorHandler)
  app.use(isCached)

  return app
}

// eslint-disable-next-line no-unused-vars
const errorHandler: express.ErrorRequestHandler = (error, _req: Request, res: Response, _next: NextFunction) => {
  // here we keep mapping of application errors (4XX group in fact)
  // to REST HTTP errors;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (error?.code === 'validation') {
    res.status(422).json({
      // js type Error defines `message` as non-enumerable property,
      // need to map it explicitly
      error: {
        ...error,
        code: 'validation',
        message: (error as Error).message,
      } as Error,
    })
  } else {
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
}
