import { Types } from 'mongoose'

export interface IArtists {
  searchText: string
  artists: string[]
}

export interface IArtistsQuery extends IArtists {
  _id?: Types.ObjectId
  __v?: number
}
export interface IArtistFetchSearchesResponse {
  artists: string[]
}
