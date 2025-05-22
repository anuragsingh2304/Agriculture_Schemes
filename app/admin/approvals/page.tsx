"use client";

import { useState, useEffect, useCallback } from "react";
import texts from "@/language/en.json";
import Modal from "@/components/Modal";
import Image from "next/image";
import { CheckCircle, XCircle, Eye, FileText, User, Ruler } from "lucide-react";

interface PopulatedScheme {
  _id: string;
  title: string;

}

interface DocumentFile {
  _id?: string; 
  name: string;
  url: string; 
  mimeType?: string; 
  fileSize?: string; 
}

interface ApplicationFromBackend {
  _id: string;

  scheme: PopulatedScheme;
  status: "pending" | "approved" | "rejected";
  filledInfo: {
    name: string;
    dateOfBirth?: string;
    address?: string;
    aadharNumber: string;
    landHolding?: string; 
    education?: string;
    farmingExperience?: string;
    bankName?: string;
    bankAccount?: string;
    ifscCode?: string;
  };
  documents: [{
    name: string
    url: string
  }];
  appliedAt: string; 
  remark?: string;
}


type Application = ApplicationFromBackend;
const API_BASE_URL = "http://localhost:8000/api/applications";


export default function AdminApprovals() {
  const [applicationsData, setApplicationsData] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewingApplication, setViewingApplication] =
    useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "approved" | "rejected";
    application: Application;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to fetch applications: ${response.status} ${response.statusText}. ${errorBody}`
        );
      }
      const data: Application[] = await response.json();
      setApplicationsData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching applications."
      );
      setApplicationsData([]);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications =
    selectedStatus === "all"
      ? applicationsData
      : applicationsData.filter((app) => app.status === selectedStatus);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleViewApplication = (application: Application) => {
    setViewingApplication(application);
    setIsModalOpen(true);
  };

  const handleConfirmAction = (
    type: "approved" | "rejected",
    application: Application
  ) => {
    setConfirmAction({ type, application });

    if (type === "rejected") {
      setRejectionReason(application.remark || ""); 
    }
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    const { type, application } = confirmAction;
    const payload: { status: "approved" | "rejected"; remark?: string } = {
      status: type,
    };

    if (type === "rejected") {
      payload.remark = rejectionReason.trim();
    }

    try {
     
      const response = await fetch(
        `${API_BASE_URL}/${application._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorBody = await response
          .json()
          .catch(() => ({ message: `Server error: ${response.status}` }));
        throw new Error(
          errorBody.message ||
            `Failed to ${type} application. Status: ${response.status}`
        );
      }
      await fetchApplications();

      console.log(
        `${type === "approved" ? "Approved" : "Rejected"} application: ${
          application._id
        }`
      );
      setConfirmAction(null);
      setRejectionReason("");
      setIsModalOpen(false);
    } catch (err) {
      console.error(`Error ${type}ing application:`, err);
     
      alert(
        `Error: ${
          err instanceof Error ? err.message : "Could not perform action."
        }`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 py-10 text-center">
        Loading applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-2 py-10 text-center text-red-500">
        Error: {error}{" "}
        <button
          onClick={fetchApplications}
          className="ml-2 p-1 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-md font-bold text-gray-900 dark:text-white">
          {texts.admin.approvals.title}
        </h1>

        <div className="mt-2 sm:mt-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 p-1"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>{" "}
      {/* Closes flex container for title and dropdown */}
      <div className="card p-1">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {texts.admin.approvals.applicantName}
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {texts.admin.approvals.schemeApplied}
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    {texts.admin.approvals.applicationDate}
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {texts.admin.approvals.status}
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {texts.admin.approvals.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {filteredApplications.map((application) => (
                  <tr
                    key={application._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {" "}
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 mr-2">
                          {application.filledInfo.name.charAt(0)}
                        </div>
                        <div className="text-xs text-gray-900 dark:text-gray-100">
                          {application.filledInfo.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100">
                      {application.scheme.title}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-900 dark:text-gray-100 hidden md:table-cell">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-2 text-xs">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                          application.status
                        )}`}
                      >
                        {application.status.charAt(0).toUpperCase() +
                          application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-xs text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/50"
                          onClick={() => handleViewApplication(application)}
                          title={texts.admin.approvals.view}
                        >
                          <Eye size={16} />
                        </button>
                        {application.status === "pending" && (
                          <>
                            <button
                              className="p-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50"
                              onClick={() =>
                                handleConfirmAction("approved", application)
                              }
                              title={texts.admin.approvals.approve}
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50"
                              onClick={() =>
                                handleConfirmAction("rejected", application)
                              }
                              title={texts.admin.approvals.reject}
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Application Details Modal */}
      {viewingApplication && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Application Details"
        >
          <div className="space-y-6 overflow-x-hidden">
            {/* Applicant Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <User
                  size={16}
                  className="mr-2 text-green-600 dark:text-green-400"
                />
                Applicant Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Name
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {viewingApplication.filledInfo.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Aadhar Number
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {viewingApplication.filledInfo.aadharNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Scheme Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <FileText
                  size={16}
                  className="mr-2 text-green-600 dark:text-green-400"
                />
                Scheme Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Scheme
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {viewingApplication.scheme.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Application Date
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {new Date(
                        viewingApplication.appliedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Mock Land Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                {" "}
                <Ruler
                  size={16}
                  className="mr-2 text-green-600 dark:text-green-400"
                />
                Land & Income Details
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Land Size
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {viewingApplication.filledInfo.landHolding || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Annual Income
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      N/A
                    </p>{" "}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Address
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {viewingApplication.filledInfo.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            {/* Uploaded Documents */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <FileText
                  size={16}
                  className="mr-2 text-green-600 dark:text-green-400"
                />
                Uploaded Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {viewingApplication.documents.length > 0 ? (
                  viewingApplication.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="aspect-video relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {doc.url? (
                            <Image
                              src={doc.url}
                              alt={doc.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <FileText
                              size={48}
                              className="text-gray-400 dark:text-gray-500"
                            />
                          )}
                        </div>
                      </a>
                      <div className="p-1">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-900 dark:text-gray-100 hover:underline truncate block leading-tight"
                          title={doc.name}
                        >
                          {doc.name}
                        </a>
                       
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full">
                    No documents uploaded.
                  </p>
                )}
              </div>
            </div>{" "}
            {/* Status and Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Current Status
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                      viewingApplication.status
                    )}`}
                  >
                    {viewingApplication.status.charAt(0).toUpperCase() +
                      viewingApplication.status.slice(1)}
                  </span>
                </div>

                {viewingApplication.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      className="btn-secondary text-xs"
                      onClick={() => {
                        setIsModalOpen(false);
                      }}
                    >
                      Close
                    </button>
                    <button
                      className="btn-primary bg-green-600 hover:bg-green-700 text-xs flex items-center gap-1"
                      onClick={() => {
                        setIsModalOpen(false);
                        handleConfirmAction("approved", viewingApplication);
                      }}
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>
                    <button
                      className="btn-primary bg-red-600 hover:bg-red-700 text-xs flex items-center gap-1"
                      onClick={() => {
                        setIsModalOpen(false);
                        handleConfirmAction("rejected", viewingApplication);
                      }}
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </div>
                )}

                {viewingApplication.status !== "pending" && (
                  <button
                    className="btn-secondary text-xs"
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
      {/* Confirmation Modal */}
      {confirmAction && (
        <Modal
          isOpen={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          title={
            confirmAction.type === "approved"
              ? "Approve Application"
              : "Reject Application"
          }
        >
          <div className="py-4">
            <div className="flex justify-center mb-4">
              {confirmAction.type === "approved" ? (
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                  <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
              )}
            </div>

            <h3 className="text-md font-semibold text-center text-gray-900 dark:text-white mb-2">
              {confirmAction.type === "approved"
                ? "Are you sure you want to approve this application?"
                : "Are you sure you want to reject this application?"}
            </h3>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
              {confirmAction.type === "approved"
                ? "This will notify the applicant and grant them access to the scheme benefits."
                : "This will notify the applicant that their application has been rejected."}
            </p>

            {confirmAction.type === "rejected" && (
              <div className="mb-4">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Reason for Rejection (Optional)
                </label>
                <textarea
                  className="input-field w-full"
                  rows={3}
                  placeholder="Provide a reason for rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                ></textarea>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="btn-secondary text-xs"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>
              <button
                className={`btn-primary text-xs flex items-center gap-1 ${
                  confirmAction.type === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                onClick={executeAction}
              >
                {confirmAction.type === "approved" ? (
                  <>
                    <CheckCircle size={14} />
                    Confirm Approval
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    Confirm Rejection
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
