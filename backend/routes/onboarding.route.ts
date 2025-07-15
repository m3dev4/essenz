import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware'
import { OnboardingController } from '../controllers/onboarding/onboarding.controller'
import { upload } from '../middlewares/upload.middleware'

const onboardingController = new OnboardingController()

const router: express.Router = express.Router()

router.patch('/step-one/:id', isAuthenticated, onboardingController.updateOnboardingStepOne)
router.patch('/step-two/:id', isAuthenticated, onboardingController.updateOnboardingStepTwo)
router.patch('/step-three/:id', isAuthenticated, onboardingController.updateOnboardingStepThree)
router.patch(
  '/step-four/:id',
  isAuthenticated,
  upload.single('avatar'),
  onboardingController.updateOnboardingStepFour
)

export default router
