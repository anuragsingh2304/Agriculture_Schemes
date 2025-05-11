"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { schemes, applications } from "@/utils/mockdata"
import {
  FileText,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"

export default function ApplicationDetails({ params }: { params: { id: string } }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const application = applications.find((app) => app.id === params.id)
  const scheme = application ? schemes.find((s) => s.id === application.schemeId) : null

  useEffect(() => {
    // Check if user is authenticated (in a real app, use a proper auth system)
    const authenticated = localStorage.getItem("userAuthenticated") === "true"
    setIsAuthenticated(authenticated)

    // If not authenticated, redirect to login
    if (!authenticated) {
      router.push("/login")
    }
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please login to access your application details...</p>
      </div>
    )
  }

  if (!application || !scheme) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Application Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The application you are looking for does not exist or you don't have permission to view it.
          </p>
          <Link
            href="/user/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
      default:
        return <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/user/dashboard"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Application Details</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Application ID: <span className="font-medium">{application.id.toUpperCase()}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                application.status,
              )}`}
            >
              {getStatusIcon(application.status)}
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors">
              <Download size={16} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scheme Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="h-48 relative">
              <Image
                src={
                  scheme.imageUrl ||
                  `/placeholder.svg?height=400&width=800&query=agricultural scheme related to ${scheme.title.toLowerCase() || "/placeholder.svg"}`
                }
                alt={scheme.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2">{scheme.title}</h2>
                  <p className="text-white/90 text-sm">{scheme.shortDescription}</p>
                  {scheme.schemeType && (
                    <div className="mt-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
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
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Applied on: <span className="font-medium">{application.appliedDate}</span>
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Application Timeline</h3>
              <div className="relative pl-8 pb-8 border-l border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <div className="absolute -left-2.5 mt-1.5">
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">Application Submitted</p>
                    <p className="text-gray-500 dark:text-gray-400">{application.appliedDate}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="absolute -left-2.5 mt-1.5">
                    <div
                      className={`w-5 h-5 rounded-full ${
                        application.status === "pending" ||
                        application.status === "approved" ||
                        application.status === "rejected"
                          ? "bg-green-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      } flex items-center justify-center`}
                    >
                      {(application.status === "pending" ||
                        application.status === "approved" ||
                        application.status === "rejected") && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">Document Verification</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {application.status === "pending" ||
                      application.status === "approved" ||
                      application.status === "rejected"
                        ? "Completed on: 18 Oct 2023"
                        : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="absolute -left-2.5 mt-1.5">
                    <div
                      className={`w-5 h-5 rounded-full ${
                        application.status === "approved" || application.status === "rejected"
                          ? "bg-green-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      } flex items-center justify-center`}
                    >
                      {(application.status === "approved" || application.status === "rejected") && (
                        <CheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">Application Review</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {application.status === "approved" || application.status === "rejected"
                        ? "Completed on: 20 Oct 2023"
                        : "Pending"}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="absolute -left-2.5 mt-1.5">
                    <div
                      className={`w-5 h-5 rounded-full ${
                        application.status === "approved"
                          ? "bg-green-600"
                          : application.status === "rejected"
                            ? "bg-red-600"
                            : "bg-gray-300 dark:bg-gray-600"
                      } flex items-center justify-center`}
                    >
                      {application.status === "approved" && <CheckCircle className="h-3 w-3 text-white" />}
                      {application.status === "rejected" && <XCircle className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">Final Decision</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {application.status === "approved"
                        ? "Approved on: 22 Oct 2023"
                        : application.status === "rejected"
                          ? "Rejected on: 22 Oct 2023"
                          : "Pending"}
                    </p>
                  </div>
                </div>
              </div>

              {application.status === "approved" && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">
                    Application Approved
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    Congratulations! Your application has been approved. You are eligible for the benefits under this
                    scheme.
                  </p>
                  <button className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                    View Benefit Details
                  </button>
                </div>
              )}

              {application.status === "rejected" && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Application Rejected</h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    We regret to inform you that your application has been rejected. Please review the reason below.
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md text-sm text-gray-700 dark:text-gray-300 mb-3">
                    <p>
                      <strong>Reason for Rejection:</strong> Incomplete documentation. The land records provided do not
                      match with the government database.
                    </p>
                  </div>
                  <button className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
                    Appeal Decision
                  </button>
                </div>
              )}

              {application.status === "pending" && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                    Application Under Review
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Your application is currently under review. We will notify you once a decision has been made.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Uploaded Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Aadhar Card</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">PDF, 1.2 MB</span>
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Land Records</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">PDF, 2.5 MB</span>
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Bank Details</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">PDF, 0.8 MB</span>
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Applicant Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Applicant Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">{application.applicantName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aadhar Number</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">{application.aadharNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">rajesh.kumar@example.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      Village Sundarpur, District Varanasi, Uttar Pradesh - 221001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scheme Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Scheme Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Scheme Type</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {scheme.schemeType === "central"
                      ? "Central Government Scheme"
                      : scheme.schemeType === "state"
                        ? `State Government Scheme${scheme.state ? `: ${scheme.state}` : ""}`
                        : scheme.schemeType || "Government Scheme"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Implementing Agency</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {scheme.implementingAgency || "Department of Agriculture"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Funding Source</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {scheme.fundingSource || "Ministry of Agriculture & Farmers Welfare"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Target Group</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {scheme.targetGroup || "Small and Marginal Farmers"}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={`/scheme-details/${scheme.id}`}
                  className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                >
                  View Full Scheme Details
                </Link>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions or need assistance with your application, please contact our support team.
              </p>
              <div className="space-y-3">
                <button className="w-full text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                  Contact Support
                </button>
                <button className="w-full text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-md transition-colors">
                  FAQs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
