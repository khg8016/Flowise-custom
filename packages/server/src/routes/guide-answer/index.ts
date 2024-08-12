import express from 'express'
import guideAnswerController from '../../controllers/guide-answer'
const router = express.Router()

// CREATE
router.post(['/', '/:id'], guideAnswerController.createGuideAnswer)

export default router
