import { Router } from "express"
import { registerUser, loginUser, loginAdmin, handler, logout } from "../controllers/authController.js"

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/admin/login", loginAdmin);
router.get("/my",handler)
router.post("/logout",logout)

export const authRoutes = router