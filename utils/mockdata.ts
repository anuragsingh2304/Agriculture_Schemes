export interface Scheme {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  eligibility: string
  benefits: string
  documents: string[]
  imageUrl?: string
  schemeType?: "central" | "state" | "ngo" | "international"
  state?: string
  fundingSource?: string
  implementingAgency?: string
  targetGroup?: string
  applicationDeadline?: string
}

export interface Application {
  id: string
  schemeId: string
  applicantName: string
  aadharNumber: string
  status: "pending" | "approved" | "rejected"
  appliedDate: string
}

export interface Crop {
  id: string
  name: string
  season: string
  pesticides: string
  fertilizers: string
  imageUrl?: string
  cropType?: string
  waterRequirement?: string
  soilType?: string
  growthDuration?: string
  averageYield?: string
}

export const schemes: Scheme[] = [
  {
    id: "1",
    title: "PM-KISAN Scheme",
    shortDescription: "Financial assistance of ₹6,000 per year to eligible farmer families.",
    fullDescription:
      "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector scheme with 100% funding from Government of India. Under the scheme, income support of ₹6,000 per year is provided to all eligible farmer families across the country in three equal installments of ₹2,000 each every four months.",
    eligibility:
      "All landholding farmers' families, which have cultivable landholding in their names are eligible to get benefit under the scheme.",
    benefits: "Financial assistance of ₹6,000 per year transferred directly to the bank accounts of the beneficiaries.",
    documents: ["Aadhar Card", "Land Records", "Bank Account Details"],
    schemeType: "central",
    fundingSource: "Ministry of Agriculture & Farmers Welfare",
    implementingAgency: "Department of Agriculture, Cooperation & Farmers Welfare",
    targetGroup: "Small and Marginal Farmers",
    applicationDeadline: "2023-12-31",
  },
  {
    id: "2",
    title: "Pradhan Mantri Fasal Bima Yojana",
    shortDescription: "Crop insurance scheme providing financial support to farmers suffering crop loss/damage.",
    fullDescription:
      "Pradhan Mantri Fasal Bima Yojana (PMFBY) provides comprehensive insurance coverage against crop loss due to non-preventable natural risks from pre-sowing to post-harvest for the crops/areas notified by the concerned State Government.",
    eligibility:
      "All farmers including sharecroppers and tenant farmers growing the notified crops in the notified areas are eligible for coverage.",
    benefits:
      "Insurance coverage and financial support to farmers in the event of failure of any of the notified crops as a result of natural calamities, pests & diseases.",
    documents: ["Aadhar Card", "Land Records", "Bank Account Details", "Crop Sowing Certificate"],
    schemeType: "central",
    fundingSource: "Ministry of Agriculture & Farmers Welfare",
    implementingAgency: "Department of Agriculture, Cooperation & Farmers Welfare",
    targetGroup: "All Farmers",
  },
  {
    id: "3",
    title: "Soil Health Card Scheme",
    shortDescription: "Provides information on soil health to farmers to help improve productivity.",
    fullDescription:
      "The Soil Health Card Scheme provides information to farmers on nutrient status of their soil along with recommendations on appropriate dosage of nutrients to improve soil health and fertility.",
    eligibility: "All farmers with agricultural land are eligible for the Soil Health Card.",
    benefits:
      "Helps farmers to make informed decisions on the use of fertilizers and adopt good agricultural practices to improve soil health and crop productivity.",
    documents: ["Aadhar Card", "Land Records"],
    schemeType: "central",
    implementingAgency: "Department of Agriculture, Cooperation & Farmers Welfare",
  },
  {
    id: "4",
    title: "National Mission for Sustainable Agriculture",
    shortDescription: "Promotes sustainable agriculture through climate change adaptation measures.",
    fullDescription:
      "The National Mission for Sustainable Agriculture (NMSA) aims at promoting sustainable agriculture through climate change adaptation measures, enhancing agriculture productivity especially in rainfed areas focusing on integrated farming, soil health management, and synergizing resource conservation.",
    eligibility: "Farmers in rainfed areas and areas prone to climate change impacts are prioritized.",
    benefits:
      "Financial assistance for adopting sustainable agricultural practices, water conservation, and soil health management.",
    documents: ["Aadhar Card", "Land Records", "Bank Account Details"],
    schemeType: "central",
    fundingSource: "Ministry of Agriculture & Farmers Welfare",
  },
  {
    id: "5",
    title: "Paramparagat Krishi Vikas Yojana",
    shortDescription: "Promotes organic farming practices and certification.",
    fullDescription:
      "Paramparagat Krishi Vikas Yojana (PKVY) is a scheme to promote organic farming. Under this scheme, farmers are encouraged to form groups or clusters and take to organic farming methods over large areas in the country.",
    eligibility: "Farmers willing to adopt organic farming practices are eligible.",
    benefits: "Financial assistance for inputs, organic certification, marketing, and capacity building.",
    documents: ["Aadhar Card", "Land Records", "Bank Account Details"],
    schemeType: "central",
  },
  {
    id: "6",
    title: "Maharashtra State Agricultural Marketing Board Scheme",
    shortDescription: "Supports farmers in Maharashtra with marketing and infrastructure.",
    fullDescription:
      "The Maharashtra State Agricultural Marketing Board Scheme aims to provide better marketing facilities for agricultural produce in Maharashtra. It focuses on developing infrastructure, providing market information, and ensuring fair prices for farmers.",
    eligibility: "Farmers residing in Maharashtra state with valid land records.",
    benefits: "Access to modern market facilities, price information, and reduced post-harvest losses.",
    documents: ["Aadhar Card", "Land Records", "Domicile Certificate", "Bank Account Details"],
    schemeType: "state",
    state: "Maharashtra",
    fundingSource: "Maharashtra State Government",
    implementingAgency: "Maharashtra State Agricultural Marketing Board",
    targetGroup: "Farmers in Maharashtra",
    applicationDeadline: "2023-11-30",
  },
  {
    id: "7",
    title: "Karnataka Krishi Yantra Dhare Yojane",
    shortDescription: "Farm equipment rental scheme for farmers in Karnataka.",
    fullDescription:
      "Karnataka Krishi Yantra Dhare Yojane is a state scheme that provides farm equipment on rent to farmers at subsidized rates. This helps small and marginal farmers access modern farm equipment without having to purchase them.",
    eligibility: "All farmers in Karnataka with valid farmer ID cards.",
    benefits: "Access to modern farm equipment at subsidized rental rates, training on equipment usage.",
    documents: ["Aadhar Card", "Land Records", "Farmer ID Card", "Bank Account Details"],
    schemeType: "state",
    state: "Karnataka",
    fundingSource: "Karnataka State Government",
    implementingAgency: "Department of Agriculture, Karnataka",
    targetGroup: "Small and Marginal Farmers in Karnataka",
  },
]

export const applications: Application[] = [
  {
    id: "app1",
    schemeId: "1",
    applicantName: "Rajesh Kumar",
    aadharNumber: "XXXX-XXXX-1234",
    status: "pending",
    appliedDate: "2023-10-15",
  },
  {
    id: "app2",
    schemeId: "2",
    applicantName: "Suresh Patel",
    aadharNumber: "XXXX-XXXX-5678",
    status: "approved",
    appliedDate: "2023-09-22",
  },
  {
    id: "app3",
    schemeId: "3",
    applicantName: "Priya Singh",
    aadharNumber: "XXXX-XXXX-9012",
    status: "rejected",
    appliedDate: "2023-10-05",
  },
  {
    id: "app4",
    schemeId: "1",
    applicantName: "Amit Sharma",
    aadharNumber: "XXXX-XXXX-3456",
    status: "pending",
    appliedDate: "2023-10-18",
  },
  {
    id: "app5",
    schemeId: "4",
    applicantName: "Neha Verma",
    aadharNumber: "XXXX-XXXX-7890",
    status: "pending",
    appliedDate: "2023-10-20",
  },
]

export const crops: Crop[] = [
  {
    id: "crop1",
    name: "Rice",
    season: "Kharif",
    pesticides: "Carbofuran, Chlorpyrifos",
    fertilizers: "Urea, DAP, Potash",
    cropType: "Cereal",
    waterRequirement: "High",
    soilType: "Alluvial",
    growthDuration: "120-150",
    averageYield: "25-30",
  },
  {
    id: "crop2",
    name: "Wheat",
    season: "Rabi",
    pesticides: "Chlorpyrifos, Cypermethrin",
    fertilizers: "Urea, DAP, MOP",
    cropType: "Cereal",
    waterRequirement: "Medium",
    soilType: "Loamy",
    growthDuration: "120-150",
    averageYield: "35-40",
  },
  {
    id: "crop3",
    name: "Cotton",
    season: "Kharif",
    pesticides: "Imidacloprid, Acephate",
    fertilizers: "Urea, SSP, MOP",
    cropType: "Cash",
    waterRequirement: "Medium",
    soilType: "Black",
    growthDuration: "150-180",
    averageYield: "15-20",
  },
  {
    id: "crop4",
    name: "Sugarcane",
    season: "Year-round",
    pesticides: "Fipronil, Chlorantraniliprole",
    fertilizers: "Urea, SSP, MOP, Zinc Sulphate",
    cropType: "Cash",
    waterRequirement: "High",
    soilType: "Loamy",
    growthDuration: "360-420",
    averageYield: "700-800",
  },
  {
    id: "crop5",
    name: "Maize",
    season: "Kharif/Rabi",
    pesticides: "Deltamethrin, Lambda-cyhalothrin",
    fertilizers: "Urea, DAP, MOP",
    cropType: "Cereal",
    waterRequirement: "Medium",
    soilType: "Sandy Loam",
    growthDuration: "90-120",
    averageYield: "25-30",
  },
]
