import * as yup from 'yup'

export const createCategoryValidator = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().notRequired(),
})

export const updateCategoryValidator = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().notRequired(),
})
