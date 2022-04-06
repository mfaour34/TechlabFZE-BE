/* eslint-disable no-unused-vars */
import { IArtistFetchSearchesResponse, IArtists } from '../entities/IArtists'

export interface IArtistRepository {
  getArtists: (searchText: string, token: string) => Promise<IArtists | undefined>
  create: (attrs: IArtists) => Promise<IArtists>
  getUnique: (searchText: string) => Promise<IArtists>
  getSearches: () => Promise<IArtistFetchSearchesResponse>
}
