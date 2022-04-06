import './sideEffectImports'
import { startHttpServer } from '@shared/api/http'
// import { AccessTokensProvider } from '@shared/types/AccessTokensProvider'

startApp().catch(error => {
  console.log(error)
  process.abort()
})

async function startApp() {
  //await db.connect()

  await startHttpServer(undefined)
}
