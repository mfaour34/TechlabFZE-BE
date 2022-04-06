import { IArtistFetchSearchesResponse, IArtists, IArtistsQuery } from '@artists/application/entities/IArtists'
import { IArtistRepository } from '@artists/application/repositories/IArtistRepository'
import request from 'request'
import { Artists } from '../schemas/Artists'

export class ArtistRepository implements IArtistRepository {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly ArtistSchema = Artists) {}

  public async getArtists(searchText: string, token: string): Promise<IArtists | undefined> {
    try {
      const options = {
        url: `https://api.spotify.com/v1/search?q=${encodeURI(searchText)}&type=artist`,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        json: true,
      }
      const attrs = await this.getRequest(options, searchText)
      return attrs
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  public async getUnique(searchText: string): Promise<IArtists> {
    try {
      const searches = await this.ArtistSchema.aggregate([
        {
          $match: {
            searchText: searchText,
          },
        },
        {
          $group: {
            _id: 0,
            artists: { $push: '$artists' },
          },
        },
        {
          $project: {
            data: {
              $reduce: {
                input: '$artists',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
          },
        },
      ])
      return {
        searchText: searches[0].data ? searchText : '',
        artists: searches[0]?.data || [],
      }
    } catch (error) {
      console.log(error)
      return {
        searchText: '',
        artists: [],
      }
    }
  }

  public async create(attrs: IArtists): Promise<IArtistsQuery> {
    try {
      console.log(attrs)
      const artist = await this.ArtistSchema.create(attrs)
      return artist
    } catch (error) {
      console.log(error)
      return {
        artists: [],
        searchText: '',
      }
    }
  }

  public async getSearches(): Promise<IArtistFetchSearchesResponse> {
    try {
      const searches = await this.ArtistSchema.aggregate([
        {
          $group: {
            _id: 0,
            artists: { $push: '$artists' },
          },
        },
        {
          $project: {
            data: {
              $reduce: {
                input: '$artists',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
          },
        },
      ])
      return {
        artists: searches[0].data,
      }
    } catch (error) {
      console.log(error)
      return {
        artists: [],
      }
    }
  }
  private async getRequest(options: any, searchText: string): Promise<IArtists> {
    return new Promise((resolve, reject) => {
      const attrs: IArtists = { artists: [], searchText }
      request.get(
        options,
        async (error: unknown, _response: unknown, body: { artists: { items: { name: string }[] } }) => {
          if (error) {
            reject(error)
          }
          body.artists?.items?.forEach((item: { name: string }) => {
            attrs.artists.push(item.name)
          })

          await this.create(attrs)
          resolve(attrs)
        },
      )
    })
  }
}
