import type { Request, Response } from 'express'
import Task from '../models/Task'

export class TaskController {

  static createTask = async (req: Request, res: Response) => {
    // console.log(req)
    try {
      const task = new Task(req.body)
      console.log(task)
      task.corredor = req.empresa.id
      req.empresa.tasks.push(task.id)
      await Promise.allSettled([task.save(), req.empresa.save()])
      res.send('Incidencia creada correctamente')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static getCorredorTasks = async (req: Request, res: Response) => {
    try {
      // console.log(req)
      console.log(req.empresa.id)
      const tasks = await Task.find({ corredor: req.empresa.id })
      console.log(tasks)
      res.json(tasks)
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static getTaskById = async (req: Request, res: Response) => {
    console.log(req.task.id)

    try {
      const task = await Task.findById(req.task.id)
        .populate({ path: 'completedBy.user', select: 'id name email' })
        .populate({ path: 'notes', populate: { path: 'createdBy', select: 'id name email' } })
      console.log(task.status)
      res.json(task)
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name
      req.task.description = req.body.description
      await req.task.save()
      res.send("Tarea Actualizada Correctamente")
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.empresa.tasks = req.empresa.tasks.filter(task => task.toString() !== req.task.id.toString())
      await Promise.allSettled([req.task.deleteOne(), req.empresa.save()])
      res.send("Tarea Eliminada Correctamente")
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body
      req.task.status = status
      const data = {
        user: req.user.id,
        status
      }
      req.task.completedBy.push(data)
      await req.task.save()
      res.send('Tarea Actualizada')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }
}