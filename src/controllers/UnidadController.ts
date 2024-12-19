import type { Request, Response } from "express";
import Unidad from "../models/Unidad";
import Empresa from "../models/Empresa";

export class UnidadController { 
  static createUnidad = async(req: Request, res: Response) => {
    const empresaId = req.params.empresaId
    const empresa = await Empresa.findById(empresaId) 
    const unidad  = new Unidad(req.body)
    unidad.empresa = req.params.empresaId
    empresa.workSpace.push( unidad.id )
    try {
      await Promise.allSettled([unidad.save(),empresa.save()]) 
      res.send('Unidad Creada Correctamente')
    } catch (error) {
      console.log(error)      
    }
  }
  static getUnidadById = async (req: Request,res: Response) => {
    const { idUnidad } = req.params
    try {
      const unidad = await Unidad.findById(idUnidad)
      if(!unidad) {
        const error = new Error('Unidad no encontrada')
        return res.status(404).json({ error: error.message})
      }
      res.json(unidad)
    } catch (error) {
      console.log(error)
    }
  }
  static getUnidadesByIdCorredor = async (req: Request, res: Response) => {
    const { empresaId } =  req.params
    try {
      const unidades = await Unidad.find({
        $or: [
          {empresa: {$in: empresaId}}
        ]
      })
      res.json(unidades)
    } catch (error) {
      console.log(error)
    }
  }
  static deleteUnidad = async (req: Request, res: Response) => {
    const { idUnidad } = req.params
    const unidad = await Unidad.findById(idUnidad)
    unidad.active = false
    await unidad.save()
    res.send('Unidad Eliminada')
  } 
}