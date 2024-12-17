import { Router } from 'express'
import { body, param } from 'express-validator'
import { EmpresaController } from '../controllers/EmpresaController'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import { empresaExist } from '../middleware/empresa'
import { hasAuthorization, taskBelongsToCorredor, taskExists } from '../middleware/task'
import { TaskController } from '../controllers/TaskController'
import { NoteController } from '../controllers/NoteController'
import { TeamMemberController } from '../controllers/TeamController'
const router = Router()

router.use(authenticate)

router.post('/integrador',
    body('empresaName')
        .notEmpty().withMessage('El Nombre de la Empresa es Obligatorio'),
    handleInputErrors,
    EmpresaController.createIntegrador
)
router.post('/:empresaId/corredor',
    param('empresaId').isMongoId().withMessage('ID no válido'),
    body('empresaName')
        .notEmpty().withMessage('El Nombre de la Empresa es Obligatorio'),
    handleInputErrors,
    EmpresaController.createCorredor
)
// Todos los integradores
router.get('/integradores' ,EmpresaController.getAllIntegradores)

router.get('/:empresaId',
    param('empresaId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    EmpresaController.getEmpresaById
)

router.get('/user/:userId', 
    param('userId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    EmpresaController.getEmpresaByUserId
)
router.get('/:empresaId/manager',
    param('empresaId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    EmpresaController.getManagerByEmpresaId
)
router.get('/integrador/:empresaId',
    param('empresaId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    EmpresaController.getIntegradorById
)
router.get('/corredor/:empresaId',
    param('empresaId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    EmpresaController.getCorredorById
)

router.param('empresaId',empresaExist)

router.put('/:empresaId',
    param('empresaId').isMongoId().withMessage('ID no válido'),
    body('id')
        .notEmpty().withMessage('El Manager es Obligatorio'),
    EmpresaController.updateEmpresa
)
router.put('/:empresaId/manager',
    param('empresaId').isMongoId().withMessage('ID no válido'),
    body('id')
        .notEmpty().withMessage('El Manager es Obligatorio'),
    EmpresaController.updateManager
)

router.post('/:empresaId/tasks',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El nombre de la incidencia es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es Necesaria'),
    handleInputErrors,
    TaskController.createTask
)
router.get('/:empresaId/tasks',
    TaskController.getCorredorTasks
)

router.param('taskId',taskExists)
router.param('taskId', taskBelongsToCorredor)


router.get('/:empresaId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:empresaId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:empresaId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:empresaId/tasks/:taskId/status', 
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)
/** Routes for teams */
router.post('/:empresaId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:empresaId/team',
    TeamMemberController.getProjecTeam
)

router.post('/:empresaId/team',
    body('id')
        .isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:empresaId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)
/** Routes for Notes */
router.post('/:empresaId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El Contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:empresaId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:empresaId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID No Válido'),
    handleInputErrors,
    NoteController.deleteNote
)
export default router