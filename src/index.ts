import './sideEffectImports'
import { startHttpServer } from '@shared/api/http'
import { connect } from '@shared/infrastructure/redis/redisConnect'
// import { AccessTokensProvider } from '@shared/types/AccessTokensProvider'

startApp().catch(error => {
  console.log(error)
  process.abort()
})

async function startApp() {
  await connect()
  //await db.connect()

  await startHttpServer(undefined)
}
