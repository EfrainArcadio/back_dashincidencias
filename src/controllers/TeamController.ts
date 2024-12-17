import type { Request, Response } from 'express'
import User from '../models/User'
import Empresa from '../models/Empresa'


export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        const user = await User.findOne({email}).select('id email name account')
        if(!user) {
            const error = new Error('Usuario No Encontrado')
            return res.status(404).json({error: error.message})
        }
        res.json(user)
    }

    static getProjecTeam = async (req: Request, res: Response) => {
        const project = await Empresa.findById(req.empresa.id).populate({
            path: 'team',
            select: 'id email name firstName account'
        })
        res.json(project.team)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body
        const nivel = req.user.account
        // console.log(nivel)
        // Find user
        const user = await User.findById(id).select('id')
        console.log(user)
        if(!user) {
            const error = new Error('Usuario No Encontrado')
            return res.status(404).json({error: error.message})
        }
        
        if(req.empresa.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('El usuario ya existe en el corredor')
            return res.status(409).json({error: error.message})
        }
        // console.log(user.account)
        if(nivel === 'Integrador') {
            user.account = 'Tecnico'
        } else if (nivel === 'Corredor') {
            user.account = 'Supervisor'
        }
        user.empresa = req.empresa.id
        // console.log(user.account)
        
        req.empresa.team.push(user.id)
        await Promise.allSettled([req.empresa.save(),user.save()])

        res.send('Usuario agregado correctamente')
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params

        if(!req.empresa.team.some(team => team.toString() ===  userId)) {
            const error = new Error('El usuario no existe en el proyecto')
            return res.status(409).json({error: error.message})
        }

        req.empresa.team = req.empresa.team.filter( teamMember => teamMember.toString() !==  userId)
        await req.empresa.save()
        res.send('Usuario eliminado correctamente')
    }
}
