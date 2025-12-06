
import { BloodType, Donor, Hospital } from "./types";

export const MOCK_DONORS: Donor[] = [
  { id: '1', name: "Sarah Johnson", bloodType: BloodType.O_POS, location: "Bejai, 0.5km", isAvailable: true, badges: ["Regular Donor"] },
  { id: '2', name: "Michael Chen", bloodType: BloodType.AB_NEG, location: "Kankanady, 2.1km", isAvailable: false, badges: ["Life Saver"] },
  { id: '3', name: "Jessica Davis", bloodType: BloodType.A_POS, location: "Kadri, 3.4km", isAvailable: true, badges: [] },
  { id: '4', name: "David Wilson", bloodType: BloodType.O_NEG, location: "Falnir, 1.2km", isAvailable: true, badges: ["Hero"] },
  { id: '5', name: "Emily White", bloodType: BloodType.B_POS, location: "Urwa, 5.0km", isAvailable: true, badges: ["Regular Donor"] },
  // Added more donors for simulation
  { id: '6', name: "Rahul Verma", bloodType: BloodType.A_POS, location: "Hampankatta, 1.0km", isAvailable: true, badges: ["First Time"] },
  { id: '7', name: "Priya Shetty", bloodType: BloodType.O_POS, location: "Valencia, 2.5km", isAvailable: true, badges: ["Verified"] },
  { id: '8', name: "Ahmed Khan", bloodType: BloodType.B_NEG, location: "Bunder, 3.0km", isAvailable: true, badges: [] },
  { id: '9', name: "John Doe", bloodType: BloodType.AB_POS, location: "Kuloor, 6.0km", isAvailable: true, badges: ["Hero"] },
  { id: '10', name: "Sneha Reddy", bloodType: BloodType.A_NEG, location: "Kavoor, 4.5km", isAvailable: true, badges: [] },
  { id: '11', name: "Kiran Rao", bloodType: BloodType.O_POS, location: "Ladyhill, 1.5km", isAvailable: true, badges: ["Life Saver"] },
];

export const MOCK_HOSPITALS: Hospital[] = [
  { 
    id: 'h1', 
    name: "Wenlock District Hospital", 
    distance: "0.5 km", 
    stock: { "A+": 45, "O-": 3, "B+": 12, "AB+": 8, "O+": 24 } 
  },
  { 
    id: 'h2', 
    name: "KMC Hospital (Attavar)", 
    distance: "1.2 km", 
    stock: { "A+": 15, "O+": 32, "AB-": 4, "B+": 18, "A-": 6 } 
  },
  { 
    id: 'h3', 
    name: "Father Muller Medical College", 
    distance: "2.3 km", 
    stock: { "O+": 8, "B-": 2, "A-": 14, "AB+": 22 } 
  },
  { 
    id: 'h4', 
    name: "A.J. Hospital & Research Centre", 
    distance: "4.5 km", 
    stock: { "AB+": 30, "O-": 12, "B+": 28, "A+": 40 } 
  },
  { 
    id: 'h5', 
    name: "Unity Hospital", 
    distance: "1.0 km", 
    stock: { "A-": 5, "O+": 16, "AB+": 1, "B-": 0 } 
  },
];

export const BLOOD_TYPES_LIST = Object.values(BloodType);