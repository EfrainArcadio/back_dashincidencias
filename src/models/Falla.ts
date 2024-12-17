import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'

const fallaCategory = {
  OTRA: 'otra',
  HARDWARE: 'hardware',
  SOFTWARE: 'software',
  RED: 'red',
} as const

export type FallaCategory = typeof fallaCategory

export interface IFalla extends Document {
  category: FallaCategory
  name: string
}

export const FallaSchema : Schema = new Schema ({
  category: {
    type: String,
    enum: Object.values(fallaCategory),
    default: fallaCategory.OTRA
  },
  name: {
    type: String,
    required: true
  }
    
})

const Falla = mongoose.model<IFalla>('Falla',FallaSchema)
export default Falla