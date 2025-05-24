import express from "express"
import { protect, isAdmin } from "../middleware/authMiddleware.js"
import {
  applyToScheme,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getMySingleApplication
} from "../controllers/applicationController.js"

const router = express.Router()

// User applies to scheme
router.post("/:schemeId", protect, applyToScheme)

// User gets their own applications
router.get("/my", protect, getMyApplications)

// Admin views all applications
router.get("/", protect, isAdmin, getAllApplications)

router.get("/:id", protect, getMySingleApplication)
// Admin updates status
router.put("/:id/status", protect, isAdmin, updateApplicationStatus)

export const applicationRoutes = router