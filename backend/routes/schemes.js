import express from "express"
import {
  getAllSchemes,
  createScheme,
  updateScheme,
  deleteScheme,
  getSchemeById
} from "../controllers/schemeController.js"

import { protect, isAdmin } from "../middleware/authMiddleware.js"


const router = express.Router()

// Public
router.get("/", getAllSchemes)

// Admin only
router.post("/", protect, isAdmin, createScheme)

// Admin only
router.put("/:id", protect, isAdmin, updateScheme)

// Admin only
router.delete("/:id", protect, isAdmin, deleteScheme)

// Public
router.get("/:id", getSchemeById)

export const schemeRoutes = router