import mongoose, {Schema, Document, Types, PopulatedDoc} from 'mongoose'
import { IEmpresa } from './Empresa'

export interface IUnidad extends Document {
  economico: string
  empresa: PopulatedDoc< IEmpresa & Document>
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
  }
},{timestamps: true})


const Unidad = mongoose.model<IUnidad>('Unidade',UnidadSchema)
export default Unidad