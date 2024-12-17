import type { Request, Response, NextFunction } from "express";
import Empresa,{IEmpresa} from "../models/Empresa";

declare global {
  namespace Express {
    interface Request {
      empresa: IEmpresa
    }
  }
}

export async function  empresaExist(req:Request,res: Response, next: NextFunction) { 
  try {
    const { empresaId } = req.params
    const empresa = await Empresa.findById(empresaId)
    if(!empresa) {
      const error = new Error('Empresa no Encontrada')
      return res.status(404).json({error: error.message})
    }
    req.empresa = empresa
    next()
  } catch (error) {
    res.status(500).json({error: ' Hubo un error'})
  }
}
