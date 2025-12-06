
export enum BloodType {
  A_POS = "A+",
  A_NEG = "A-",
  B_POS = "B+",
  B_NEG = "B-",
  AB_POS = "AB+",
  AB_NEG = "AB-",
  O_POS = "O+",
  O_NEG = "O-",
}

export interface Donor {
  id: string;
  name: string;
  bloodType: BloodType;
  location: string;
  isAvailable: boolean;
  lastDonation?: string;
  badges: string[];
  phone?: string; // For simulation
}

export interface Hospital {
  id: string;
  name: string;
  distance: string;
  stock: Record<string, number>; // Changed to number for units
}

export interface PredictionData {
  day: string;
  demand: number;
  supply: number;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  patientAge?: string;
  bloodType: string;
  reason?: string;
  hospital: string;
  hospitalWard?: string;
  doctorName?: string;
  contactNumber?: string;
  urgency: number;
  status: 'Under Review' | 'Verified' | 'Fulfilled' | 'Cancelled';
  date: string;
  verificationProof?: string; 
  notifiedCount?: number; // Track how many donors were pinged
}

export interface UserProfile {
  id: string;
  name: string;
  bloodType: BloodType;
  donations: number;
  livesSaved: number;
  badges: string[];
  nextEligibleDate: string;
  // Extended fields for registration
  age?: string;
  gender?: string;
  weight?: string;
  city?: string;
  phone?: string;
  isVerified?: boolean;
}

export enum Tab {
  HOME = 'home',
  DONORS = 'donors',
  HOSPITALS = 'hospitals',
  REQUEST = 'request',
  PROFILE = 'profile',
  REGISTER = 'register',
}

export enum NotificationChannel {
  PUSH = 'APP',
  SMS = 'SMS',
  WHATSAPP = 'WA'
}

export interface AppNotification {
  id: string;
  requestId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'URGENT_REQUEST' | 'SYSTEM' | 'REWARD';
  actionLabel?: string;
  hospitalName?: string;
  distance?: string;
  urgencyLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  accepted?: boolean;
}
