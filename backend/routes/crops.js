import express from "express"
import { protect, isAdmin } from "../middleware/authMiddleware.js"
import {
  getAllCrops,
  createCrop,
  updateCrop,
  deleteCrop,
  getCropById
} from "../controllers/cropController.js"

const router = express.Router()

router.get("/", getAllCrops)
router.get("/:id", getCropById)
router.post("/", protect, isAdmin, createCrop)
router.put("/:id", protect, isAdmin, updateCrop)
router.delete("/:id", protect, isAdmin, deleteCrop)

export const cropRoutes = router