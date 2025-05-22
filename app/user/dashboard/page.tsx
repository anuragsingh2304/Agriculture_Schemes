"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { schemes,SchemeData, UserApplication, userProfile as User } from "@/utils/mockdata"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Search,
  Filter,
  Plus,
  X,
  Eye,
  Trash2,
  Upload,
} from "lucide-react"


const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`

export default function UserDashboard() {
  const BASE_URL = "http://localhost:8000/api"

  useEffect(() => {
    const styleTag = document.createElement("style")
    styleTag.textContent = scrollbarHideStyles
    document.head.appendChild(styleTag)

    return () => {
      document.head.removeChild(styleTag)
    }
  }, [])

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showDocTypeModal, setShowDocTypeModal] = useState(false)
  const [selectedDocType, setSelectedDocType] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [userProfile, setUserProfile] = useState<User>();
  const [userApplication, setUserApplication] = useState<UserApplication[]>([]);
  const [schemeData, setSchemeData] = useState<SchemeData[]>([]);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter()
  let  dcumentUpload ;


  const documentTypes = [
    { id: "aadhar", name: "Aadhar Card" },
    { id: "pan", name: "PAN Card" },
    { id: "land", name: "Land Records" },
    { id: "bank", name: "Bank Statement" },
    { id: "income", name: "Income Certificate" },
    { id: "caste", name: "Caste Certificate" },
  ]

  // Mock user data
  const user = {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 98765 43210",
    address: "Village Sundarpur, District Varanasi, Uttar Pradesh - 221001",
    aadharNumber: "XXXX-XXXX-1234",
  }




  useEffect(() => {

    const authenticated = localStorage.getItem("userAuthenticated") === "true"
    setIsAuthenticated(authenticated)

    if (!authenticated) {
      router.push("/login")
    }
     const fetchUser = async ()=> { 
      
      const response = await fetch(`${BASE_URL}/user/profile`,{
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
      })
      const data = await response.json();
      setUserProfile(data)
     }

     const fetchApplications = async ()=> {
        const res = await fetch(`${BASE_URL}/applications/my`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        const data = await res.json();
        setUserApplication(data);
     }

     const fetchSchemes = async ()=> {
      const res = await fetch(`${BASE_URL}/schemes`);
      const data = await res.json()
      setSchemeData(data);
     }

     fetchUser()
     fetchApplications()
     fetchSchemes()
  }, [router, dcumentUpload])


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

  const handleDocTypeSelect = (docType: string) => {
    setSelectedDocType(docType)
    setShowDocTypeModal(false)
    setShowUploadModal(true)
  }

  const handleFileUpload = async () => {
    if (!fileToUpload || !selectedDocType) {
      alert("Please select a file and document type.");
      return;
    }

    setIsUploading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary cloud name or upload preset is not configured.");
      alert("File upload service is not configured. Please contact support.");
      setIsUploading(false);
      return;
    }

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', fileToUpload);
    cloudinaryFormData.append('upload_preset', uploadPreset);
    cloudinaryFormData.append('folder', "farmerSchemes"); 

    try {
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
        {
          method: 'POST',
          body: cloudinaryFormData,
        }
      );

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
      }

      const cloudinaryData = await cloudinaryResponse.json();
      console.log("Uploaded document URL:", cloudinaryData.secure_url);

      const uploadDate = new Date().toISOString();

      const payloadForBackend = {
        type: selectedDocType,
        url: cloudinaryData.secure_url,
        uploadedAt: uploadDate,
      };
      console.log("Payload for backend:", payloadForBackend);
      
      const docUploadRes = await fetch(`${BASE_URL}/user/document/upload`, {
        method: "POST",
        headers : {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payloadForBackend)
    });
     dcumentUpload = await docUploadRes.json();

      alert(`Document "${documentTypes.find(dt => dt.id === selectedDocType)?.name}" uploaded successfully!`);
      setShowUploadModal(false);
      setFileToUpload(null);
      setSelectedDocType("");
    } catch (error) {
      console.error("Error uploading document:", error);
      alert(`Failed to upload document: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  }

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please login to access your dashboard...</p>

      </div>
    )
  }

  let recentApplication = true;
  let pending = 0; let  approved = 0; let rejected = 0;

  userApplication.map((idx)=> {
    if(idx.status == "pending") pending++;
    if(idx.status == "approved") approved++;
    if(idx.status == "rejected") rejected++;
    
  })

  if(userApplication.length == 0) {
    recentApplication = false
  }



  return (
    <div className="container mx-auto mt-8">
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xl font-bold text-green-600 dark:text-green-400">
              {userProfile?.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {userProfile? userProfile.name : user.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your applications and explore schemes tailored for you
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/schemes"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <Plus size={18} />
              Apply for Scheme
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                activeTab === "overview"
                  ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                activeTab === "applications"
                  ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              My Applications
            </button>
            <button
              onClick={() => setActiveTab("recommended")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                activeTab === "recommended"
                  ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Recommended Schemes
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                activeTab === "documents"
                  ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              My Documents
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                activeTab === "profile"
                  ? "border-b-2 border-green-600 text-green-600 dark:text-green-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Applications</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{userApplication.length}</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{pending}</p>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Approved</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{approved}</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Rejected</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{rejected}</p>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Applications</h2>
                  <button
                    onClick={() => setActiveTab("applications")}
                    className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center"
                  >
                    View All <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Scheme
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      {recentApplication? 
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {userApplication.map((application) => (
                          <tr key={application._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {application.scheme.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">{application.appliedAt.split("T")[0]}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                  application.status,
                                )}`}
                              >
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                href={`/user/applications/${application._id}`}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody> : <tbody>
                        <tr>
                        <td colSpan={4} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">you havn't applied in any Scheme</td>
                        </tr>
                      </tbody>
  }
                    </table>
                  </div>
                </div>
              </div>

              {/* Recommended Schemes */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Schemes</h2>
                  <button
                    onClick={() => setActiveTab("recommended")}
                    className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center"
                  >
                    View All <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {schemeData.slice(0, 3).map((scheme) => (
                    <div
                      key={scheme._id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="h-40 relative">
                        <Image
                          src={
                            scheme.imageUrl ||
                            `/placeholder.svg?height=200&width=400&query=agricultural scheme related to ${scheme.title.toLowerCase() || "/placeholder.svg"}`
                          }
                          alt={scheme.title}
                          fill
                          className="object-cover"
                        />
                        {scheme.schemeType && (
                          <div className="absolute top-2 left-2">
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
                                ? "Central"
                                : scheme.schemeType === "state"
                                  ? `State: ${scheme.state || ""}`
                                  : scheme.schemeType}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{scheme.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {scheme.shortDescription}
                        </p>
                        <div className="flex justify-between items-center">
                          <Link
                            href={`/scheme-details/${scheme._id}`}
                            className="text-sm text-green-600 dark:text-green-400 hover:underline"
                          >
                            View Details
                          </Link>
                          <Link
                            href={`/apply/${scheme._id}`}
                            className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors"
                          >
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Applications</h2>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                      placeholder="Search applications..."
                    />
                  </div>
                  <select className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm px-3 py-2">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Application ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Scheme
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {userApplication.map((application) => (
                        <tr key={application._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {application._id.toUpperCase()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {application.scheme.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{application.appliedAt.split("T")[0]}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                application.status,
                              )}`}
                            >
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/user/applications/${application._id}`}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Schemes Tab */}
          {activeTab === "recommended" && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Schemes</h2>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                      placeholder="Search schemes..."
                    />
                  </div>
                  <select className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm px-3 py-2">
                    <option value="">All Types</option>
                    <option value="central">Central</option>
                    <option value="state">State</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemeData.map((scheme) => (
                  <div
                    key={scheme._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-40 relative">
                      <Image
                        src={
                          scheme.imageUrl ||
                          `/placeholder.svg?height=200&width=400&query=agricultural scheme related to ${scheme.title.toLowerCase() || "/placeholder.svg"}`
                        }
                        alt={scheme.title}
                        fill
                        className="object-cover"
                      />
                      {scheme.schemeType && (
                        <div className="absolute top-2 left-2">
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
                              ? "Central"
                              : scheme.schemeType === "state"
                                ? `State: ${scheme.state || ""}`
                                : scheme.schemeType}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{scheme.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {scheme.shortDescription}
                      </p>
                      <div className="flex justify-between items-center">
                        <Link
                          href={`/scheme-details/${scheme._id}`}
                          className="text-sm text-green-600 dark:text-green-400 hover:underline"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/apply/${scheme._id}`}
                          className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Documents</h2>
                <button
                  onClick={() => setShowDocTypeModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  <Plus size={18} />
                  Upload New Document
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProfile?.documents && userProfile.documents.length > 0 ? (
                  userProfile.documents.map((doc, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                          {doc.type?.trim() || "Untitled Document"}
                        </h4>
                        {doc.verified && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            doc.verified.toLowerCase() === "verified" ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100" :
                            doc.verified.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100" :
                            doc.verified.toLowerCase() === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100" :
                            "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100"
                          }`}>
                            {doc.verified}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Uploaded on: {formatDate(doc.uploadedOn)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 truncate" title={doc.url}>
                      File: {doc.url && typeof doc.url === 'string' ? doc.url.substring(doc.url.lastIndexOf('/') + 1) : "N/A"}                      </p>
                      <div className="flex space-x-3">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                          <Eye size={16} className="mr-1" /> View
                        </a>
                        <button 
                          onClick={() => alert("Delete functionality not yet implemented.")} // Placeholder for delete
                          className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                        >
                          <Trash2 size={16} className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 col-span-full">No documents uploaded yet. Click the button above to upload.</p>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Profile</h2>
                <Link
                  href="/user/profile"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
                          {user.name.charAt(0)}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{userProfile? userProfile.name : user.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Farmer ID: FRM-12345</p>
                      </div>
                    </div>

                    <div className="md:w-2/3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                          <p className="text-base font-medium text-gray-900 dark:text-white">{userProfile? userProfile.email :user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                          <p className="text-base font-medium text-gray-900 dark:text-white">{userProfile? userProfile.phone :user.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Aadhar Number</p>
                          <p className="text-base font-medium text-gray-900 dark:text-white">{userProfile? userProfile.profile.aadharNumber :user.aadharNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Account Created</p>
                          <p className="text-base font-medium text-gray-900 dark:text-white">15 Oct 2023</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                          <p className="text-base font-medium text-gray-900 dark:text-white">{userProfile? userProfile.profile.address :user.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Type Selection Modal */}
      {showDocTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Document Type</h3>
              <button
                onClick={() => setShowDocTypeModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {documentTypes.map((docType) => (
                <button
                  key={docType.id}
                  onClick={() => handleDocTypeSelect(docType.id)}
                  className="w-full text-left px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {docType.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upload {documentTypes.find((dt) => dt.id === selectedDocType)?.name}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
          <div>
              <label htmlFor="document-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select file to upload:
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer mb-4 relative">

                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <span className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                   {fileToUpload ? fileToUpload.name : "Drag and drop file here or click to browse"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Supported formats: PDF, JPG, PNG (Max 5MB)
                </span>
                <input 
                  type="file" 
                  id="document-upload" 
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10" 
                  onChange={(e) => setFileToUpload(e.target.files ? e.target.files[0] : null)}
                  accept=".jpg,.jpeg,.png" 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                disabled={isUploading || !fileToUpload}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
