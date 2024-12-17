import { Router } from 'express'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import { UnidadController } from '../controllers/UnidadController'

const router = Router()

router.use(authenticate)
/** Unidades */
router.post('/:empresaId',
  body('economico')
      .notEmpty().withMessage('El Economico del Autobus es Obligatorio'),
  handleInputErrors,
  UnidadController.createUnidad
)

router.get('/corredor/:empresaId',UnidadController.getUnidadesByIdCorredor)

router.get('/:idUnidad',UnidadController.getUnidadById)

export default router