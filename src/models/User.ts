import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose" 
import { IEmpresa } from "./Empresa"

const typeAccount = {
    ADMIN: 'Administrador',
    GENERAL: 'General',
    INTEGRADOR: 'Integrador',
    CORREDOR: 'Corredor',
    TECNICO: 'Tecnico',
    SUPERVISOR: 'Supervisor'
} as const

export type TypeAccount = typeof typeAccount[keyof typeof typeAccount]

export interface IUser extends Document {
    email: string
    password: string
    name: string
    firstName: string
    lastName: string
    phone: string
    account: TypeAccount
    empresa: PopulatedDoc<IEmpresa & Document>
    confirmed: boolean
    
}

const userSchema: Schema = new Schema({
    email : {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    account: {
        type: String,
        enum: Object.values(typeAccount),
        default: typeAccount.GENERAL
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    empresa: {
        type: String,
        default: ''
    }
})

const User = mongoose.model<IUser>('User', userSchema)

export default User