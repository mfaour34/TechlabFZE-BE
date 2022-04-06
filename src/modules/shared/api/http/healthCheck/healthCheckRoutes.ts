import { Application } from 'express'
import { healthz } from './healthCheckController'

export const applyHealthCheckRoutes = (app: Application): void => {
  app.get('/healthz', healthz)
  // app.get('/readiness', readiness)
}
