import { Application } from 'express'
import { ArtistController } from './artistController'

export const applyArtistRoutes = (app: Application): void => {
  const artistController = new ArtistController()
  app.get('/artists', artistController.getArtists)
  app.get('/artists/searches', artistController.getUniqueArtists)
  app.get('/artists/uniquesearches', artistController.getUniqueSearches)
  app.post('/artists/create', artistController.create)
}
