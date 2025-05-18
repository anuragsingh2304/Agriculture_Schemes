"use client"

import Link from "next/link"
import { schemes, applications, crops } from "@/utils/mockdata"
import texts from "@/language/en.json"
import { FileText, TrendingUp, Clock, CheckCircle, XCircle, Leaf, BarChart3, ArrowRight } from "lucide-react"

export default function AdminDashboard() {
  const pendingApplications = applications.filter((app) => app.status === "pending")
  const approvedApplications = applications.filter((app) => app.status === "approved")
  const rejectedApplications = applications.filter((app) => app.status === "rejected")

  // Last 6 applications
  const recentApplications = [...applications]
    .sort((a, b) => {
      return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    })
    .slice(0, 5)

  // Get scheme title
  const getSchemeTitle = (schemeId: string) => {
    const scheme = schemes.find((s) => s._id === schemeId)
    return scheme ? scheme.title : "Unknown Scheme"
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

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-md font-bold text-gray-900 dark:text-white mb-1">{texts.admin.dashboard.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcome back, {localStorage.getItem("userName") || "Admin" } Here's what's happening with your applications.
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <button
            className="btn-primary flex items-center gap-1"
            onClick={() => {
              // This would normally generate a report
              console.log("Generate report")
            }}
          >
            <BarChart3 size={16} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{texts.admin.dashboard.totalSchemes}</p>
              <p className="text-md font-bold text-gray-900 dark:text-white">{schemes.length}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-green-500">+12% from last month</span>
          </div>
        </div>

        <div className="card p-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {texts.admin.dashboard.pendingApplications}
              </p>
              <p className="text-md font-bold text-gray-900 dark:text-white">{pendingApplications.length}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-green-500">+5% from last month</span>
          </div>
        </div>

        <div className="card p-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {texts.admin.dashboard.approvedApplications}
              </p>
              <p className="text-md font-bold text-gray-900 dark:text-white">{approvedApplications.length}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-green-500">+18% from last month</span>
          </div>
        </div>

        <div className="card p-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {texts.admin.dashboard.rejectedApplications}
              </p>
              <p className="text-md font-bold text-gray-900 dark:text-white">{rejectedApplications.length}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
            <span className="text-xs text-red-500">-3% from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <div className="card p-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title">Recent Applications</h2>
              <Link
                href="/admin/approvals"
                className="text-xs text-green-600 dark:text-green-400 hover:underline flex items-center"
              >
                View All <ArrowRight size={12} className="ml-1" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Applicant
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Scheme
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {recentApplications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-2 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 mr-2">
                            {application.applicantName.charAt(0)}
                          </div>
                          <div className="text-xs text-gray-900 dark:text-gray-100">{application.applicantName}</div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                        {getSchemeTitle(application.schemeId)}
                      </td>
                      <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">{application.appliedDate}</td>
                      <td className="px-2 py-2 text-xs">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Links & Crop Info */}
        <div>
          {/* Quick Links */}
          <div className="card p-1 mb-6">
            <h2 className="section-title mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/schemes" className="btn-primary text-center text-xs py-3">
                Add New Scheme
              </Link>
              <Link href="/admin/crops" className="btn-primary text-center text-xs py-3">
                Add New Crop
              </Link>
              <Link href="/admin/approvals" className="btn-secondary text-center text-xs py-3">
                Pending Approvals
              </Link>
              <button className="btn-secondary text-center text-xs py-3" onClick={() => console.log("Generate report")}>
                Generate Report
              </button>
            </div>
          </div>

          {/* Crop Info */}
          <div className="card p-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-title">Available Crops</h2>
              <Link
                href="/admin/crops"
                className="text-xs text-green-600 dark:text-green-400 hover:underline flex items-center"
              >
                View All <ArrowRight size={12} className="ml-1" />
              </Link>
            </div>
            <ul className="space-y-3">
              {crops.slice(0, 4).map((crop) => (
                <li key={crop._id} className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-lg mr-3">
                    <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-800 dark:text-white">{crop.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Season: {crop.season}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
