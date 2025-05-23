"use client";

import type React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SchemeData, userProfile } from "@/utils/mockdata";
import Link from "next/link";
import { notFound, useRouter, useParams } from "next/navigation";
import texts from "@/language/en.json";
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
} from "lucide-react";

interface UploadedDocument {
  name: string;
  url: string;
}

export default function ApplyScheme() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [step, setStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [schemeData, setSchemeData] = useState<SchemeData>();
  const [userData, setUserData] = useState<userProfile>();

  const [selectedDocumentFiles, setSelectedDocumentFiles] = useState<{
    [key: string]: File | null;
  }>({});

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
    documents: [] as UploadedDocument[],
  });

  useEffect(() => {
    async function checkAccess() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/my`, { credentials: "include" });
        if (!res.ok) {
          console.log(res.status)
          router.push("/login");
        }
        const data = await res.json();

        if (data.role !== "user") {
          router.push("/login");
        }else {
          setIsAuthenticated(true)
        }
      }
      checkAccess()


    const getScheme = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/schemes/${params.id}`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) {
        notFound();
      }
      const scheme = await res.json();
      setSchemeData(scheme);
      setIsLoading(false);
    };
    const getUser = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/profile`, { credentials : "include"});
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    };
    getScheme();
    getUser();
    
  }, [params.id]);

  useEffect(() => {
    if (!userData || !isAuthenticated) return;

    setFormData((prev) => ({
      ...prev,
      name: userData.name || "",
      aadhar: userData.profile.aadharNumber || "",
      address: userData.profile.address || "",
      landSize: userData.profile.landHolding || "",
      income: "",
      phone: userData.phone || "",
      email: userData.email || "",
      bankName: userData.bank.bankName || "",
      accountNumber: userData.bank.bankAccount || "",
      ifscCode: userData.bank.ifscCode || "",
    }));
  }, [userData, isAuthenticated]);

  if (!isLoading) {
    if (!schemeData) {
      notFound();
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData((prev) => ({ ...prev, [id]: checked }));
  };

  const handleFileChangeForDocType = (
    docType: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setSelectedDocumentFiles((prev) => ({
        ...prev,
        [docType]: e.target.files ? e.target.files[0] : null, 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error(
        "Cloudinary cloud name or upload preset is not configured."
      );
      alert("File upload service is not configured. Please contact support.");
      setIsLoading(false);
      return;
    }

    const uploadedDocumentsForBackend: UploadedDocument[] = [];

    try {
      for (const docType in selectedDocumentFiles) {
        const file = selectedDocumentFiles[docType];
        if (file) {

          const cloudinaryFormData = new FormData();
          cloudinaryFormData.append("file", file);
          cloudinaryFormData.append("upload_preset", uploadPreset);
          cloudinaryFormData.append("folder", "farmerSchemes");

          const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
            {
              method: "POST",
              body: cloudinaryFormData,
            }
          );

          if (!cloudinaryResponse.ok) {
            const errorData = await cloudinaryResponse.json();
            throw new Error(
              `Cloudinary upload failed for ${docType}: ${errorData.error.message}`
            );
          }
          const cloudinaryData = await cloudinaryResponse.json();
          uploadedDocumentsForBackend.push({
            name: docType, 
            url: cloudinaryData.secure_url,
          });
        }
      }

      const payloadForBackend = {
        filledInfo: {
          name: formData.name,
          address: formData.address,
          aadharNumber: formData.aadhar,
          landHolding: formData.landSize,
          income: formData.income,
          bankName: formData.bankName,
          bankAccount: formData.accountNumber,
          ifscCode: formData.ifscCode,
        }, 
        documents: uploadedDocumentsForBackend, 
      };

     
      console.log(
        "Submitting to backend:",
        JSON.stringify(payloadForBackend, null, 2)
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/applications/${params.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadForBackend),
          credentials: "include"
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error: ${errorData.message}`);
      }
      const resData = await res.json();
      const applicationID = resData._id;
      console.log(applicationID);
      setApplicationId(applicationID); 
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(
        `Failed to submit application: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  if (isLoading) {
    return (
      <div className="w-[100vw] h-[90vh] grid bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p className="place-self-center text-lg text-gray-700 dark:text-gray-300 mb-2">
          Loading please wait
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Login Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to apply for this scheme. Please login or
            register to continue.
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
    );
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
              {texts.apply.applicationSubmitted}{" "}
              <span className="font-semibold">{applicationId}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You will receive updates about your application status via email
              and SMS. You can also check the status in your dashboard.
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
    );
  }

  return (
    <div className="container mx-auto">
      <div className="relative mb-6 rounded-xl overflow-hidden h-48">
        <Image
          src={
            schemeData?.imageUrl ||
            `/placeholder.svg?height=400&width=1200&query=agricultural scheme related to ${
              schemeData?.title.toLowerCase() || "/placeholder.svg"
            }`
          }
          alt="Application form background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center p-4">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/scheme-details/${schemeData?._id}`}
                className="text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-white">
                Apply for: {schemeData?.title}
              </h1>
            </div>
            <p className="text-white/90 text-lg">{texts.apply.subtitle}</p>
            {schemeData?.schemeType && (
              <div className="mt-3">
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    schemeData.schemeType === "central"
                      ? "bg-blue-100 text-blue-800"
                      : schemeData.schemeType === "state"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {schemeData.schemeType === "central"
                    ? "Central Scheme"
                    : schemeData.schemeType === "state"
                    ? `State Scheme${
                        schemeData.state ? `: ${schemeData.state}` : ""
                      }`
                    : schemeData.schemeType}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {}

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
            <div
              className={`flex-1 h-1 mx-2 ${
                step >= 2 ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
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
            <div
              className={`flex-1 h-1 mx-2 ${
                step >= 3 ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
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
            <div
              className={`flex-1 h-1 mx-2 ${
                step >= 4 ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
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
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
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
                  <label
                    htmlFor="aadhar"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
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
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
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
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
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
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary flex items-center gap-1"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Land Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {texts.apply.landDetails}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="landSize"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {texts.apply.landSize} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Ruler size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
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
                  <label
                    htmlFor="income"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
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
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                  Important Note
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Please ensure that the land details provided match with your
                  land records. Any discrepancy may lead to rejection of your
                  application.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary flex items-center gap-1"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Bank Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Bank Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label
                    htmlFor="bankName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
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
                  <label
                    htmlFor="ifscCode"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
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
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                  Why We Need This
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your bank details are required for direct transfer of benefits
                  under this scheme. Please ensure that the account is active
                  and linked to your Aadhar.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary flex items-center gap-1"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {texts.apply.documents}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {texts.apply.uploadInstructions}
              </p>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-3">
                  Required Documents
                </h3>
                <ul className="space-y-2">
                  {schemeData?.documents.map((doc, index) => (
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
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {doc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {schemeData?.documents && schemeData.documents.length > 0 ? (
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please upload the following documents. Supported formats:
                    PDF, JPG, PNG (Max 5MB each).
                  </p>
                  {schemeData.documents.map((docType) => (
                    <div
                      key={docType}
                      className="p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30"
                    >
                      <label
                        htmlFor={`file-${docType.replace(/\s+/g, "-")}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {docType}{" "}
                        {schemeData.documents?.includes(docType)
                          ? "*"
                          : "(Optional)"}
                      </label>
                      <input
                        id={`file-${docType.replace(/\s+/g, "-")}`}
                        type="file"
                        accept=".jpg,.jpeg,.png" // Specify accepted file types
                        className="mt-1 block w-full text-sm text-green-500 dark:text-gray-400
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-700 dark:file:text-primary-50
                                  hover:file:bg-primary-100 dark:hover:file:bg-primary-600 cursor-pointer"
                        onChange={(e) => handleFileChangeForDocType(docType, e)}
                      />
                      {selectedDocumentFiles[docType] && (
                        <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
                          <Check size={14} className="mr-1" />
                          Selected: {selectedDocumentFiles[docType]?.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  No specific documents listed as required for this scheme.
                </p>
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
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {texts.apply.termsAgree}
                  </span>
                </label>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {texts.common.submit}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
