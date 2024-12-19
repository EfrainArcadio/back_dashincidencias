import mongoose, {Schema, Document, Types, PopulatedDoc} from 'mongoose'
import { IEmpresa } from './Empresa'

export interface IUnidad extends Document {
  economico: string
  empresa: PopulatedDoc< IEmpresa & Document>
  active: boolean
}

const UnidadSchema: Schema = new Schema({
  economico: {
    type: String,
    required: true,
    trim: true
  },
  empresa: {
    type: Types.ObjectId,
    ref: 'Empresa'
  },
  active: {
    type: Boolean,
    default: true
  }

},{timestamps: true})


const Unidad = mongoose.model<IUnidad>('Unidade',UnidadSchema)
export default Unidad