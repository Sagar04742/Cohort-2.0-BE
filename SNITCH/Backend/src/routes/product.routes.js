import express from 'express'
import multer from 'multer'
import { authenticateSeller } from '../middlewares/auth.middleware.js'
import { createProduct } from '../controllers/product.controller.js'
import { validateCreateProduct } from '../validator/product.validator.js'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

const productRouter = express.Router()

productRouter.post("/", authenticateSeller, upload.array('images', 7), validateCreateProduct, createProduct)

export default productRouter
