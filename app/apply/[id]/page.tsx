"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { schemes } from "@/utils/mockdata"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import texts from "@/language/en.json"
import {
  User,
  CreditCard,
  MapPin,
  Ruler,
  DollarSign,
  Upload,
  Check,
  ChevronRight,
  ArrowLeft,
  Building,
  Phone,
  Mail,
} from "lucide-react"

export default function ApplyScheme({ params }: { params: { id: string } }) {
  const router = useRouter()
  const scheme = schemes.find((s) => s.id === params.id)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState("")
  const [step, setStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    aadhar: "",
    address: "",
    landSize: "",
    income: "",
    phone: "",
    email: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    termsAgreed: false,
  })

  useEffect(() => {
    // Check if user is authenticated (in a real app, use a proper auth system)
    const authenticated = localStorage.getItem("userAuthenticated") === "true"
    setIsAuthenticated(authenticated)

    // If authenticated, pre-fill some form fields
    if (authenticated) {
      setFormData((prev) => ({
        ...prev,
        name: "Rajesh Kumar",
        aadhar: "XXXX-XXXX-1234",
        address: "Village Sundarpur, District Varanasi, Uttar Pradesh - 221001",
        phone: "+91 98765 43210",
        email: "rajesh.kumar@example.com",
      }))
    }
  }, [])

  if (!scheme) {
    notFound()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target
    setFormData((prev) => ({ ...prev, [id]: checked }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => file.name)
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate a random application ID
    const newApplicationId =
      "APP" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")
    setApplicationId(newApplicationId)
    setIsSubmitted(true)
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Login Required</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to apply for this scheme. Please login or register to continue.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={`/login?redirect=/apply/${params.id}`}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-md text-sm font-medium transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto text-center">
          <div className="py-8">
            <div className="bg-green-100 dark:bg-green-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600 dark:text-green-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Application Submitted Successfully
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              {texts.apply.applicationSubmitted} <span className="font-semibold">{applicationId}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You will receive updates about your application status via email and SMS. You can also check the status in
              your dashboard.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href={`/user/applications/${applicationId}`}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                View Application
              </Link>
              <Link
                href="/user/dashboard"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-md text-sm font-medium transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="relative mb-6 rounded-xl overflow-hidden h-48">
        <Image
          src={
            scheme.imageUrl ||
            `/placeholder.svg?height=400&width=1200&query=agricultural scheme related to ${scheme.title.toLowerCase() || "/placeholder.svg"}`
          }
          alt="Application form background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center p-4">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-2">
              <Link href={`/scheme-details/${scheme.id}`} className="text-white/80 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-white">Apply for: {scheme.title}</h1>
            </div>
            <p className="text-white/90 text-lg">{texts.apply.subtitle}</p>
            {scheme.schemeType && (
              <div className="mt-3">
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    scheme.schemeType === "central"
                      ? "bg-blue-100 text-blue-800"
                      : scheme.schemeType === "state"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {scheme.schemeType === "central"
                    ? "Central Scheme"
                    : scheme.schemeType === "state"
                      ? `State Scheme${scheme.state ? `: ${scheme.state}` : ""}`
                      : scheme.schemeType}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <User size={20} />
              </div>
              <span className="text-sm mt-2">Personal</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <Ruler size={20} />
              </div>
              <span className="text-sm mt-2">Land</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <Building size={20} />
              </div>
              <span className="text-sm mt-2">Bank</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 4 ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 4
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <Upload size={20} />
              </div>
              <span className="text-sm mt-2">Documents</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {texts.apply.personalDetails}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {texts.apply.name} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                      placeholder={texts.apply.name}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {texts.apply.aadhar} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <CreditCard size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="aadhar"
                      value={formData.aadhar}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                      placeholder={texts.apply.aadhar}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {texts.apply.address} *
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                    placeholder={texts.apply.address}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-1">
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Land Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{texts.apply.landDetails}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="landSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {texts.apply.landSize} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Ruler size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="landSize"
                      value={formData.landSize}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                      placeholder={texts.apply.landSize}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="income" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {texts.apply.income} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="income"
                      value={formData.income}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                      placeholder={texts.apply.income}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">Important Note</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Please ensure that the land details provided match with your land records. Any discrepancy may lead to
                  rejection of your application.
                </p>
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={prevStep} className="btn-secondary">
                  Back
                </button>
                <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-1">
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Bank Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bank Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bank Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Building size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                      placeholder="Bank Name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="accountNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Account Number *
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                    placeholder="Account Number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    id="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                    placeholder="IFSC Code"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">Why We Need This</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your bank details are required for direct transfer of benefits under this scheme. Please ensure that
                  the account is active and linked to your Aadhar.
                </p>
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={prevStep} className="btn-secondary">
                  Back
                </button>
                <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-1">
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{texts.apply.documents}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{texts.apply.uploadInstructions}</p>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3">Required Documents</h3>
                <ul className="space-y-2">
                  {scheme.documents.map((doc, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer">
                <label htmlFor="documents" className="cursor-pointer block">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <span className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Drag and drop files here or click to browse
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Supported formats: PDF, JPG, PNG (Max 5MB each)
                  </span>
                  <input type="file" id="documents" multiple className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3">Uploaded Files:</h3>
                  <ul className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Check size={16} className="text-green-600 mr-2" />
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleCheckboxChange}
                    className="rounded text-green-600 focus:ring-green-500 mr-2"
                    required
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{texts.apply.termsAgree}</span>
                </label>
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={prevStep} className="btn-secondary">
                  Back
                </button>
                <button type="submit" className="btn-primary">
                  {texts.common.submit}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
