import type { Request, Response } from "express";
import Empresa from "../models/Empresa";
import User from "../models/User";
import e from "cors";

export class EmpresaController {

  static createIntegrador = async (req: Request, res: Response) => {
    const empresa = new Empresa(req.body)
    empresa.manager = req.user.id
    empresa.createdBy = req.user.id
    try {
      await empresa.save()
      res.send('Empresa Creada Correctamente')
    } catch (error) {
      console.log(error)
    }
  }

  static createCorredor = async (req: Request, res: Response) => {
    const corredor = new Empresa(req.body)
    const integrador = await Empresa.findById(req.params.empresaId)
    corredor.manager = req.user.id
    corredor.createdBy = req.user.id
    integrador.workSpace.push(corredor.id)
    try {
      await Promise.allSettled([corredor.save(), integrador.save()])
      res.send('Corredor Creado')
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  }

  static getAllIntegradores = async (req: Request, res: Response) => {
    try {
      const integradores = await Empresa.find({
        $or: [
          { perfil: { $in: 'Integrador' } },
        ]
      })
      res.json(integradores);
    } catch (error) {
      console.log(error)
    }
  }

  static getEmpresaById = async (req: Request, res: Response) => {
    const { empresaId } = req.params
    try {
      const empresa = (await Empresa.findById(empresaId))
      if (!empresa) {
        const error = new Error('Empresa no Encontrada')
        return res.status(404).json({ error: error.message })
      }
      if (empresa.createdBy.toString() !== req.user.id.toString() ) {
        const error = new Error('Acción no Valida')
        return res.status(404).json({ error: error.message })
      }
      res.json(empresa)
    } catch (error) {
      console.log(error)
    }
  }

  static getEmpresaByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params
    try {
      const empresa = await Empresa.find({
        $or: [
          { manager: { $in: userId } },
          { team: { $in: userId } },
        ]
      })
      res.json(empresa)
    } catch (error) {
      console.log(error)
    }
  }
  
  static getIntegradorById = async (req: Request, res: Response) => {
    const { empresaId } = req.params
    try {
      const empresa = (await Empresa.findById(empresaId))
      console.log(empresa)
      if (!empresa) {
        const error = new Error('Empresa no Encontrada')
        return res.status(404).json({ error: error.message })
      }
      const corredorIds = empresa.workSpace
      const corredores = await Empresa.find({ _id: { $in: corredorIds } })
      console.log(corredores)
      res.json(corredores)
    } catch (error) {
      console.log(error)
    }
  }
  static getCorredorById = async (req: Request, res: Response) => {
    const { empresaId } = req.params
    try {
      const corredor = await Empresa.findById(empresaId).populate('tasks')
      // console.log(corredor)
      if (!corredor) {
        const error = new Error('Corredor no Encontrado')
        return res.status(404).json({ error: error.message })
      }
      // if (corredor.toString() !== req.user.id.toString() && !corredor.team.includes(req.user.id)) {
      //   const error = new Error('Acción no válida')
      //   return res.status(404).json({ error: error.message })
      // }
      res.json(corredor)
    } catch (error) {
      console.log(error)
    }
  }

  static updateEmpresa = async (req: Request, res: Response) => {
    try {
      const empresa = req.empresa
      empresa.empresaName = req.body.empresaName
      await empresa.save()
      res.send('Empresa Actualizada')
    } catch (error) {
      console.log(error)
    }
  }
  static updateManager = async (req: Request, res: Response) => {
    const newManager = await User.findById(req.body.id)
    newManager.account = req.body.account
    const empresa = req.empresa
    empresa.manager = req.body.id
    newManager.empresa = empresa.id
    try {
      await Promise.allSettled([newManager.save(), empresa.save()])
      res.send('Empresa Actualizada')
    } catch (error) {
      console.log(error)
    }
  }
  static getManagerByEmpresaId = async (req: Request, res: Response) => {
    const manager = req.empresa.manager
    const user = await User.findOne(manager)

    if (!user) {
      const error = new Error('Usuario No Encontrado')
      return res.status(404).json({ error: error.message })
    }
    res.json(user)
  }
}
