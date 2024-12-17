import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import empresaRoutes from './routes/empresaRoutes'
import fallaRoutes from './routes/fallaRoutes'
import unidadRoutes from './routes/UnidadRoutes'

dotenv.config()
connectDB()

const app = express()
app.use(cors(corsConfig))

// Logging
app.use(morgan('dev'))

// Leer datos de formularios
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/empresa', empresaRoutes)
app.use('/api/falla',fallaRoutes )
app.use('/api/unidad',unidadRoutes )

export default app