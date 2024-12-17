import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'
import { IUser } from './User'
import { ITask } from './Task'
import { IUnidad } from './Unidad'

const perfilEmpresa = {
  CORREDOR: 'Corredor',
  INTEGRADOR: 'Integrador',
} as const

export type PerfilEmpresa = typeof perfilEmpresa
export interface IEmpresa extends Document {
  empresaName: string
  perfil: PerfilEmpresa
  manager: PopulatedDoc<IUser & Document>
  createdBy: PopulatedDoc<IUser & Document>
  workSpace: PopulatedDoc<IUnidad | IEmpresa & Document>[]
  team: PopulatedDoc<IUser & Document>[]
  tasks: PopulatedDoc<ITask & Document>[]
}

const empresaSchema: Schema = new Schema({
  empresaName: {
    type: String,
    required: true,
    trim: true
  },
  workSpace: [
      {
        type: Types.ObjectId,
        ref: 'Empresa'
      },
      {
        type: Types.ObjectId,
        ref: 'Autobus'
      }
  ],
  perfil: {
    type: String,
    enum: Object.values(perfilEmpresa)
  },
  manager: {
      type: Types.ObjectId,
      ref: 'User'
  },
  createdBy: {
      type: Types.ObjectId,
      ref: 'User'
  },
  team: [
      {
          type: Types.ObjectId,
          ref: 'User'
      },
  ],
  tasks: [
      {
          type: Types.ObjectId,
          ref: 'Task'
      }
  ],
}, {timestamps: true})

empresaSchema.pre('deleteOne',{document: true}, async function () {
    const empresaId = this._id
    if(!empresaId) return
  })

const Empresa = mongoose.model<IEmpresa>('Empresa',empresaSchema)
export default Empresa