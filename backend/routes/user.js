import { Router } from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getMySingleApplication } from "../controllers/applicationController.js"
import { getUserProfile, updateUserProfile, uploadUserDocument } from "../controllers/userController.js"


const router = Router()

router.get("/profile", protect, getUserProfile);
router.put("/profile/update", protect, updateUserProfile)
router.post("/document/upload", protect, uploadUserDocument)

router.get("/applications/:id", protect, getMySingleApplication)
export const userRoutes =  router