import express from 'express'
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware'
import { CategoryController } from '../controllers/category/category.controller'

const categoryController = new CategoryController()

const router: express.Router = express.Router()

router.post('/create', isAuthenticated, isAdmin, categoryController.createCategory)
router.put('/update/:id', isAuthenticated, isAdmin, categoryController.updateCategory)
router.delete('/delete/:id', isAuthenticated, isAdmin, categoryController.deleteCategory)
router.get('/all', isAuthenticated, isAdmin, categoryController.getAllCategories)

export default router
