import './sideEffectImports'
import { startHttpServer } from '@shared/api/http'
import { connect } from '@shared/infrastructure/redis/redisConnect'
import { mongoConnect } from '@shared/infrastructure/mongo/mongoConnect'
// import { AccessTokensProvider } from '@shared/types/AccessTokensProvider'

startApp().catch(error => {
  console.log(error)
  process.abort()
})

async function startApp() {
  await connect()
  mongoConnect()

  await startHttpServer(undefined)
}
