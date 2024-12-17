import type { Request, Response, NextFunction } from 'express'
import Task, {ITask} from '../models/Task'

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExists( req: Request, res: Response, next: NextFunction ) {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if(!task) {
            const error = new Error('Tarea no encontrada')
            return res.status(404).json({error: error.message})
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}

export function taskBelongsToCorredor(req: Request, res: Response, next: NextFunction ) {
    console.log(req.task)
    if(req.task.corredor.toString() !== req.empresa.id.toString()) {
        const error = new Error('Acción no válida')
        return res.status(400).json({error: error.message}) 
    }
    next()
}

export function hasAuthorization(req: Request, res: Response, next: NextFunction ) {
    if( req.user.account.toString() !== 'Supervisor' ) {
        const error = new Error('Acción no válida')
        return res.status(400).json({error: error.message}) 
    }
    next()
}
