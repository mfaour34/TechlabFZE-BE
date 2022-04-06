import { Request, Response } from 'express'
import { ArtistRepository } from '@artists/infrastructure/repositories/ArtistRepository'

export class ArtistController {
  public async getArtists(req: any, res: Response) {
    const artistRepo = new ArtistRepository()
    try {
      const request = await artistRepo.getArtists(String(req.query.query), req.token)
      console.log(request)
      res.status(200).json(request)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: { msg: 'internal server error' } })
    }
  }

  public async getUniqueArtists(_req: Request, res: Response) {
    const artistRepo = new ArtistRepository()
    try {
      const request = await artistRepo.getSearches()
      res.status(200).json(request)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: { msg: 'internal server error' } })
    }
  }
  public async getUniqueSearches(req: Request, res: Response) {
    const artistRepo = new ArtistRepository()
    try {
      const request = await artistRepo.getUnique(String(req.query.query))
      res.status(200).json(request)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: { msg: 'internal server error' } })
    }
  }

  public async create(req: Request, res: Response) {
    const artistRepo = new ArtistRepository()
    try {
      const request = await artistRepo.create(req.body)
      res.status(200).json(request)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: { msg: 'internal server error' } })
    }
  }
}
