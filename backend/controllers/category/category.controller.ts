import { CategoryService } from '../../services/category/category.service'
import asynchandler from '../../middlewares/asynchandler'
import { NextFunction, Request, Response } from 'express'
import {
  createCategoryValidator,
  updateCategoryValidator,
} from '../../validators/categoryValidator'
import AppError from '../../middlewares/AppError'

export class CategoryController {
  private CategoryService: CategoryService

  constructor(categoryService?: CategoryService) {
    this.CategoryService = categoryService ?? new CategoryService()
  }

  public createCategory = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await createCategoryValidator.validate(req.body)
        const { name, description } = req.body
        const category = await this.CategoryService.createCategory(name, description)
        res.status(201).json({
          success: true,
          message: 'Category created successfully',
          data: category,
        })
      } catch (error: any) {
        console.error('Error creating category', error)
        throw new AppError(error.message, 500, true, error)
      }
    }
  )

  public updateCategory = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await updateCategoryValidator.validate(req.body)
        const { id } = req.params
        const { name, description } = req.body
        const category = await this.CategoryService.updateCategory(id, name, description)
        res.status(200).json({
          success: true,
          message: 'Category updated successfully',
          data: category,
        })
      } catch (error: any) {
        console.error('Error updating category', error)
        throw new AppError(error.message, 500, true, error)
      }
    }
  )

  public deleteCategory = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { id } = req.params
        const category = await this.CategoryService.deleteCategory(id)
        res.status(200).json({
          success: true,
          message: 'Category deleted successfully',
          data: category,
        })
      } catch (error: any) {
        console.error('Error deleting category', error)
        throw new AppError(error.message, 500, true, error)
      }
    }
  )

  public getAllCategories = asynchandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const categories = await this.CategoryService.getAllCategories()
        res.status(200).json({
          success: true,
          message: 'Categories retrieved successfully',
          data: categories,
        })
      } catch (error: any) {
        console.error('Error retrieving categories', error)
        throw new AppError(error.message, 500, true, error)
      }
    }
  )
}
