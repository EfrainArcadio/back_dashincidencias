import type { Request, Response } from "express";
import Falla from "../models/Falla";

export class FallaController { 
  static createFalla = async(req: Request, res: Response) => {
    const falla = new Falla(req.body)
    try {
      await falla.save()
      res.send('Falla Creada Correctamente')
    } catch (error) {
      console.log(error)      
    }
  }
  static getAllFallas = async (req: Request, res: Response) => {
    try {
      const fallas = await Falla.find()
      res.json(fallas)
    } catch (error) {
      console.log(error)
    }
  }
  static getFallaByID = async (req: Request, res: Response) => {
    const {idFalla}  = req.params
    try {
      const falla = await Falla.findById(idFalla)
      res.json(falla)
    } catch (error) {
      console.log(error)
    }
  }

  static updateFalla = async(req: Request, res: Response) => {
    const {idFalla} =  req.params
    const falla = await Falla.findById(idFalla)

    // console.log(falla)
    falla.name = req.body.name
    // console.log(falla)
    try {
      await falla.save()
      res.send('Falla Actualizada')
    } catch (error) {
      console.log(error)
    }
  } 
}