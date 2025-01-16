import express from 'express'
import multer from 'multer'
import path from 'path'
import crawlController from '../../controllers/crawl'

const router = express.Router()

// CREATE
router.post(['/'], crawlController.crawl)

export default router
