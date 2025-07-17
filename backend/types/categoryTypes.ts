import { User } from './userTypes'

export interface Category {
  id: string
  name: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
  subCategories: SubCategory[]
}

export interface SubCategory {
  id: string
  name: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
  category?: Category
  categoryId: string
  user?: User[]
}
