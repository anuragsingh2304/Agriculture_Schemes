"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import texts from "@/language/en.json"
import { Plus, Edit, Trash2, Leaf, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
export default function AdminCrops() {
  const [cropList, setCropList] = useState<any[]>([])
  const [cropName, setCropName] = useState("")
  const [season, setSeason] = useState("")
  const [pesticides, setPesticides] = useState("")
  const [fertilizers, setFertilizers] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCropId, setEditingCropId] = useState<string | null>(null)
  const [cropType, setCropType] = useState("")
  const [waterRequirement, setWaterRequirement] = useState("")
  const [soilType, setSoilType] = useState("")
  const [growthDuration, setGrowthDuration] = useState("")
  const [averageYield, setAverageYield] = useState("")
    const [cropImage, setCropImage] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
useEffect(() => {
  const authenticated = localStorage.getItem("adminAuthenticated") === "true"
  setIsAuthenticated(authenticated)
  

  if (!authenticated) {
    router.push("/admin/login")
  }
  

  const token = localStorage.getItem("token")
  fetch("http://localhost:8000/api/crops", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => setCropList(data))
  .catch(err => console.error("Failed to fetch crops:", err))
}, [router])




  useEffect(() => {
    const authenticated = localStorage.getItem("adminAuthenticated") === "true"
    setIsAuthenticated(authenticated)
    if (!authenticated) {
      router.push("/admin/login")
    }
  }, [router])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setIsUploadingImage(true)
      setCropImage(null) 

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

      if (!cloudName || !uploadPreset) {
        console.error(
          "Cloudinary cloud name or upload preset is not configured."
        )
        alert("File upload service is not configured. Please contact support.")
        setIsUploadingImage(false)
        return
      }

      const cloudinaryFormData = new FormData()
      cloudinaryFormData.append("file", file)
      cloudinaryFormData.append("upload_preset", uploadPreset)
      cloudinaryFormData.append("folder", "crop_images") 

      try {
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: cloudinaryFormData
          }
        )

        if (!cloudinaryResponse.ok) {
          const errorData = await cloudinaryResponse.json()
          throw new Error(
            `Cloudinary upload failed: ${errorData.error.message}`
          )
        }
        const cloudinaryData = await cloudinaryResponse.json()
        setCropImage(cloudinaryData.secure_url)
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error)
        alert(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`)
        setCropImage(null) // Reset on error
      } finally {
        setIsUploadingImage(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    const formData = {
      name: cropName,
      season,
      pesticides,
      fertilizers,
      cropType,
      waterRequirement,
      soilType,
      growthDuration,
      averageYield,
      imageUrl: cropImage || ""
    }

    try {
      const url = isEditMode
        ? `http://localhost:8000/api/crops/${editingCropId}`
        : "http://localhost:8000/api/crops"
      const method = isEditMode ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const savedCrop = await res.json()

      if (res.ok) {
        if (isEditMode) {
          setCropList((prev) =>
            prev.map((c) => (c._id === editingCropId ? savedCrop : c))
          )
        } else {
          setCropList((prev) => [...prev, savedCrop])
        }
        resetForm()
      } else {
        console.error("Error saving crop")
      }
    } catch (err) {
      console.error("Error:", err)
    }
  }

    const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearImage = () => {
    setCropImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const resetForm = () => {
    setCropName("")
    setSeason("")
    setPesticides("")
    setFertilizers("")
    setCropType("")
    setWaterRequirement("")
    setSoilType("")
    setGrowthDuration("")
    setAverageYield("")
    setCropImage(null)
    setIsEditMode(false)
    setEditingCropId(null)
  }

  const handleEditCrop = (crop: any) => {
    setCropName(crop.name)
    setSeason(crop.season)
    setPesticides(crop.pesticides)
    setFertilizers(crop.fertilizers)
    setCropType(crop.cropType)
    setWaterRequirement(crop.waterRequirement)
    setSoilType(crop.soilType)
    setGrowthDuration(crop.growthDuration)
    setAverageYield(crop.averageYield)
    setCropImage(crop.imageUrl || null)
    setIsEditMode(true)
    setEditingCropId(crop._id)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDeleteCrop = async (cropId: string) => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`http://localhost:8000/api/crops/${cropId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.ok) {
        setCropList((prev) => prev.filter((crop) => crop._id !== cropId))
      } else {
        console.error("Failed to delete crop")
      }
    } catch (err) {
      console.error("Error deleting crop:", err)
    }
  }


  const getImageQuery = (cropName: string) => {
    return `farming ${cropName.toLowerCase()} field`
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please login to access the admin panel...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{texts.admin.crops.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card p-1 sticky top-20">
            <h2 className="section-title border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 flex items-center">
              {isEditMode ? (
                <>
                  <Edit size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Edit Crop
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2 text-green-600 dark:text-green-400" />
                  {texts.admin.crops.addCrop}
                </>
              )}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Crop Image</label>
                <div
                  className={`border-2 border-dashed ${
                    cropImage || isUploadingImage ? "border-green-300" : "border-gray-300"
                  } dark:border-gray-700 rounded-md overflow-hidden ${
                    !cropImage && "hover:bg-gray-50 dark:hover:bg-gray-800"
                  } transition-colors`}
                >
                  {cropImage ? (
                    <div className="relative">
                      <Image
                        src={cropImage || "/placeholder.svg"}
                        alt="Crop preview"
                        width={400}
                        height={200}
                        className="w-full h-40 object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : isUploadingImage ? (
                    <div className="p-4 text-center flex flex-col items-center justify-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      <span className="block text-sm text-gray-700 dark:text-gray-300 mt-2">
                        Uploading...
                      </span>
                    </div>
                  ) : (
                    <div
                      className="p-4 text-center cursor-pointer flex flex-col items-center justify-center h-40"
                      onClick={triggerFileInput}
                      role="button"
                      tabIndex={0}
                    >
                      <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Click to upload crop image (Max 2MB)
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, or GIF (Max 2MB)</span>
                    </div>
                  )}
                  <input type="file" id="cropImage" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={isUploadingImage} />
                </div>
              </div>
              <div>
                <label htmlFor="cropName" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {texts.admin.crops.cropName} *
                </label>
                <input
                  type="text"
                  id="cropName"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="cropType" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Crop Type *
                </label>
                <select
                  id="cropType"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Crop Type</option>
                  <option value="cereal">Cereal Crop</option>
                  <option value="pulse">Pulse Crop</option>
                  <option value="oilseed">Oilseed Crop</option>
                  <option value="vegetable">Vegetable Crop</option>
                  <option value="fruit">Fruit Crop</option>
                  <option value="cash">Cash Crop</option>
                  <option value="plantation">Plantation Crop</option>
                  <option value="Fiber">Fiber Crop</option>
                  <option value="Tuber">Tuber Crop</option>
                </select>
              </div>

              <div>
                <label htmlFor="season" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {texts.admin.crops.season} *
                </label>
                <select
                  id="season"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Season</option>
                  <option value="Kharif">Kharif</option>
                  <option value="Rabi">Rabi</option>
                  <option value="Zaid">Zaid</option>
                  <option value="Year-round">Year-round</option>
                </select>
              </div>

              <div>
                <label htmlFor="soilType" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Soil Type *
                </label>
                <select
                  id="soilType"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Soil Type</option>
                  <option value="Alluvial">Alluvial Soil</option>
                  <option value="Black">Black Soil</option>
                  <option value="Red">Red Soil</option>
                  <option value="Laterite">Laterite Soil</option>
                  <option value="Sandy">Sandy Soil</option>
                  <option value="Clay">Clay Soil</option>
                  <option value="Loamy">Loamy Soil</option>
                </select>
              </div>

              <div>
                <label htmlFor="waterRequirement" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Water Requirement *
                </label>
                <select
                  id="waterRequirement"
                  value={waterRequirement}
                  onChange={(e) => setWaterRequirement(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Water Requirement</option>
                  <option value="Low">Low (Drought Resistant)</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Very High">Very High (Water Intensive)</option>
                </select>
              </div>

              <div>
                <label htmlFor="growthDuration" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Growth Duration (Days) *
                </label>
                <input
                  type="text"
                  id="growthDuration"
                  value={growthDuration}
                  onChange={(e) => setGrowthDuration(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 90-120"
                  required
                />
              </div>

              <div>
                <label htmlFor="averageYield" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Average Yield (Quintal/Hectare) *
                </label>
                <input
                  type="text"
                  id="averageYield"
                  value={averageYield}
                  onChange={(e) => setAverageYield(e.target.value)}
                  className="input-field"
                  placeholder="e.g., 25-30"
                  required
                />
              </div>

              <div>
                <label htmlFor="pesticides" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {texts.admin.crops.pesticides}
                </label>
                <textarea
                  id="pesticides"
                  value={pesticides}
                  onChange={(e) => setPesticides(e.target.value)}
                  className="input-field"
                  rows={3}
                ></textarea>
              </div>

              <div>
                <label htmlFor="fertilizers" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {texts.admin.crops.fertilizers}
                </label>
                <textarea
                  id="fertilizers"
                  value={fertilizers}
                  onChange={(e) => setFertilizers(e.target.value)}
                  className="input-field"
                  rows={3}
                ></textarea>
              </div>

              <div className="flex justify-between pt-2">
                {isEditMode && (
                  <button type="button" className="btn-secondary text-xs" onClick={resetForm}>
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className={`btn-primary ${isEditMode ? "bg-blue-600 hover:bg-blue-700" : ""} ${
                    isEditMode ? "ml-auto" : "w-full"
                  }`}
                  disabled={isUploadingImage}
                >
                  {isEditMode ? "Update Crop" : texts.common.submit}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-1">
            <h2 className="section-title border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
              Crop List ({cropList.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cropList.map((crop) => (
                <div
                  key={crop._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-32 relative">
                    <Image
                      src={crop.imageUrl || `/abstract-geometric-shapes.png?key=c933b&height=150&width=400&query=${getImageQuery(crop.name)}`}
                      alt={crop.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                      <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="p-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{crop.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Season: {crop.season}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          onClick={() => handleEditCrop(crop)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          onClick={() => handleDeleteCrop(crop._id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs">
                      <div className="mb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Pesticides:</span>{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {crop.pesticides.length > 30 ? crop.pesticides.slice(0, 30) + "..." : crop.pesticides}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Fertilizers:</span>{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {crop.fertilizers.length > 30 ? crop.fertilizers.slice(0, 30) + "..." : crop.fertilizers}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
