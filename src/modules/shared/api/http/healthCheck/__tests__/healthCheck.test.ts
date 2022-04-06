import { env } from '@join-com/process-env'
import request from 'supertest'
import { shutdownGrpcServer, startGrpcServer } from '@shared/api/grpc'
import { createApp } from '@shared/api/http/app'
import { closeHealthClients } from '@shared/infrastructure/grpcClients/health'

const GRPC_PORT = env('GRPC_PORT', true).asInt()

describe('healthCheck', () => {
  const app = createApp()

  beforeAll(async () => {
    await startGrpcServer(GRPC_PORT)
  })

  afterAll(async () => {
    await shutdownGrpcServer()
    closeHealthClients()
  })

  it("responds with 'healthy' to /healthz", async () => {
    const response = await request(app).get('/healthz').expect(200)
    expect(response.text).toBe('healthy')
  })

  it("responds with 'ready' to /readiness", async () => {
    const response = await request(app).get('/readiness').expect(200)
    expect(response.text).toBe('ready')
  })
})
