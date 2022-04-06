import { IArtists } from '@artists/application/entities/IArtists'
import { Schema, model } from 'mongoose'

const artistSchema = new Schema<IArtists>({
  searchText: { type: String, required: true },
  artists: { type: [String], required: true },
})

export const Artists = model<IArtists>('Artists', artistSchema)
