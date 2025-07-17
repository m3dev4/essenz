import { PrismaClient } from '../../lib/generated/prisma'
import { Category } from '../../types/categoryTypes'
import AppError from '../../middlewares/AppError'

export class CategoryService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  //Create Category
  public async createCategory(name: string, description?: string): Promise<Category> {
    const existingCategory = this.prisma.category.findUnique({
      where: { name: name },
    })
    if (!existingCategory) {
      throw new AppError('Category already exists', 400, true, 'Category already exists')
    }
    const category = this.prisma.category.create({
      data: {
        name: name,
        description: description?.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        subCategories: true,
      },
    })
    return category
  }

  //update Category
  public async updateCategory(
    categoryId: string,
    name: string,
    description?: string
  ): Promise<Category> {
    const isExist = await this.prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!isExist) {
      throw new AppError('Category not found', 404, true, 'Category not found')
    }
    const category = this.prisma.category.update({
      where: { id: categoryId },
      data: {
        name: name,
        description: description,
        updatedAt: new Date(),
      },
      include: {
        subCategories: true,
      },
    })
    return category
  }

  //delete Category
  public async deleteCategory(categoryId: string): Promise<Category> {
    const isExist = await this.prisma.category.findUnique({
      where: { id: categoryId },
    })
    if (!isExist) {
      throw new AppError('Category not found', 404, true, 'Category not found')
    }
    const category = this.prisma.category.delete({
      where: { id: categoryId },
      include: {
        subCategories: true,
      },
    })
    return category
  }

  //Get all categories
  public async getAllCategories(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        subCategories: true,
      },
    })
    return categories
  }
}
