"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, MapPin, CreditCard, Calendar, Save, Building } from "lucide-react"

export default function ProfilePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isEditing, setIsEditing] = useState(false) // Start in view mode
  const router = useRouter()

  const [userData, setUserData] = useState<any>(null)
  const [renderUpdate, setRenderUpdate] = useState();

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = localStorage.getItem("userAuthenticated") === "true"
    setIsAuthenticated(authenticated)

    // If not authenticated, redirect to login
    if (!authenticated) {
      router.push("/login")
    }

    // Fetch user profile data if authenticated
    const token = localStorage.getItem("token")
    if (token) {
      fetch("http://localhost:8000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setUserData({
            ...data,
            ...(data.profile || {}),
            ...(data.bank || {})
          })
        })
        .catch(err => console.error("Failed to fetch profile:", err))
    }
  }, [router, renderUpdate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev: any) => ({
      ...prev,
      [name]: value
    }))

  }

  const handleSave = async () => {
    setIsEditing(false)
    const token = localStorage.getItem("token")

    const updatedPayload = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      profile: {
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
        aadharNumber: userData.aadharNumber,
        landHolding: userData.landHolding,
        education: userData.education,
        farmingExperience: userData.farmingExperience
      },
      bank: {
        bankName: userData.bankName,
        bankAccount: userData.bankAccount,
        ifscCode: userData.ifscCode
      }
    }

    try {
      const res = await fetch("http://localhost:8000/api/user/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedPayload)
      })

      if (!res.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedData = await res.json()
      setUserData(updatedData)
      setRenderUpdate(userData)
    } catch (error) {
      console.error("Update error:", error)
    }
  }

  const handleCancel = () => {
    // Reset to original data and exit editing mode
    setIsEditing(false)
    router.push("/user/dashboard")
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please login to access your profile...</p>
      </div>
    )
  }

  if (!userData) {
    return <div className="text-center py-10">Loading profile...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl font-bold text-green-600 dark:text-green-400">
                {userData.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
                <p className="text-gray-600 dark:text-gray-400">Update your personal information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={userData.name || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900 dark:text-white">{userData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={userData.email || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900 dark:text-white">{userData.email || "Not Available"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={userData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900 dark:text-white">{userData.phone || "Not Available"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="dateOfBirth"
                      value={userData.dateOfBirth || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900 dark:text-white">{userData.dateOfBirth}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Aadhar Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="aadharNumber"
                      value={userData.aadharNumber || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900 dark:text-white">{userData.aadharNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address and Other Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={userData.address || ""}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900 dark:text-white">{userData.address || "Not Available"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Land Holding
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="landHolding"
                      value={userData.landHolding || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 dark:text-white">{userData.landHolding || "Not Available"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Education</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="education"
                      value={userData.education || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 dark:text-white">{userData.education || "Not Available"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Farming Experience
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="farmingExperience"
                      value={userData.farmingExperience || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 dark:text-white">{userData.farmingExperience || "Not Available"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Bank Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="bankName"
                      value={userData.bankName || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900 dark:text-white">{userData.bankName || "Not Available"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bank Account Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="bankAccount"
                      value={userData.bankAccount || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900 dark:text-white">{userData.bankAccount || "Not Available"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IFSC Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="ifscCode"
                      value={userData.ifscCode || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-900 dark:text-white">{userData.ifscCode || "Not Available"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => {
                  if (isEditing) {
                    // Reset form and exit editing mode
                    setIsEditing(false)
                    router.push("/user/dashboard")
                  } else {
                    setIsEditing(true)
                  }
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                <Save size={18} className="inline mr-1" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
