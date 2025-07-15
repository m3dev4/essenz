import * as yup from 'yup'

export const onboardingValidatorStepOne = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
})
export const onboardingValidatorStepTwo = yup.object().shape({
  age: yup.number().required('Age is required'),
})
export const onboardingValidatorStepThree = yup.object().shape({
  bio: yup.string().notRequired().max(1000, 'Bio must be at most 1000 characters long'),
})
export const onboardingValidatorStepFour = yup.object().shape({
  avatarUrl: yup.string().notRequired(),
})
