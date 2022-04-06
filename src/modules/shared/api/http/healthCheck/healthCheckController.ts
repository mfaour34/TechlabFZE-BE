import { Request, Response } from 'express'

export const healthz = (_: Request, res: Response): void => {
  res.status(200).json({ msg: 'ready' })
}

//when db is connected, query db and check if all is good
// export const readiness = (_: Request, res: Response): void => {
//   if (shutdownState.isShutdown) {
//     res.status(503).send('shutting down')
//     return
//   }

//   checkConnections()
//     .then(() => res.status(200).send('ready'))
//     .catch(() => res.status(503).send('not ready'))
// }
