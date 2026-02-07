import express from 'express'
import { createWasteData, getAllWasteData, deleteWasteData } from '../controllers/wasteData.controller.js'

const router = express.Router()

router.post('/', createWasteData)
router.get('/', getAllWasteData)
router.delete('/:id', deleteWasteData)

export default router
