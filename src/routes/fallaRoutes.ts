import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import { FallaController } from '../controllers/FallaController'

const router = Router()

router.use(authenticate)

router.post('/',
  body('name')
  .notEmpty().withMessage('El nombre de la falla es obligatorio'),
  handleInputErrors,
  FallaController.createFalla
)

router.get('/:idFalla',
  param('idFalla').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  FallaController.getFallaByID
)
router.put('/:idFalla',
  param('idFalla').isMongoId().withMessage('ID no válido'),
  body('name')
  .notEmpty().withMessage('El nombre de la falla es obligatorio'),
  handleInputErrors,
  FallaController.updateFalla
)

router.get('/',FallaController.getAllFallas )
export default router