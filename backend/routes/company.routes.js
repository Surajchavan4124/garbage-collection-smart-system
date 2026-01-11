import express from 'express'

import { protect } from '../middleware/auth.middleware.js'
import { isCompanyAdmin } from '../middleware/company.middleware.js'

import {
  getCompanyProfile,
  getCompanyDashboard
} from '../controllers/company.controller.js'

import {
  createPanchayat,
  listPanchayats,
  approvePanchayat,
  rejectPanchayat,
  getPanchayatById,
} from '../controllers/panchayat.controller.js'

import { uploadPanchayatDocs } from '../middleware/upload.middleware.js'

const router = express.Router()

/**
 * COMPANY DASHBOARD
 */
router.get('/dashboard', protect, isCompanyAdmin, getCompanyDashboard)

/**
 * COMPANY PROFILE
 */
router.get('/profile', protect, isCompanyAdmin, getCompanyProfile)

/**
 * PANCHAYAT MANAGEMENT
 */
router.post(
  '/panchayats',
  protect,
  isCompanyAdmin,
  uploadPanchayatDocs,
  createPanchayat
)

router.get('/panchayats', protect, isCompanyAdmin, listPanchayats)
router.patch('/panchayats/:id/approve', protect, isCompanyAdmin, approvePanchayat)
router.patch('/panchayats/:id/reject', protect, isCompanyAdmin, rejectPanchayat)
router.get('/panchayats/:id', protect, isCompanyAdmin, getPanchayatById)

export default router
