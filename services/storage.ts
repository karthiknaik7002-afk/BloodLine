import { BloodRequest, UserProfile, BloodType, AppNotification, Donor } from '../types';
import { MOCK_DONORS } from '../constants';

const REQUESTS_KEY = 'bloodline_requests';
const PROFILE_KEY = 'bloodline_profile';
const NOTIFICATIONS_KEY = 'bloodline_notifications';
const DONORS_KEY = 'bloodline_donors';

const DEFAULT_PROFILE: UserProfile = {
  id: 'BL-8839201',
  name: 'Alex Morgan',
  bloodType: BloodType.O_POS,
  donations: 12,
  livesSaved: 36,
  badges: ['First Donor', 'Life Saver', 'Hero'],
  nextEligibleDate: 'Oct 24'
};

export const storageService = {
  // --- Donors ---
  getAllDonors: (): Donor[] => {
    try {
      const data = localStorage.getItem(DONORS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with mocks if empty so the list isn't blank on first load
      localStorage.setItem(DONORS_KEY, JSON.stringify(MOCK_DONORS));
      return MOCK_DONORS;
    } catch {
      return MOCK_DONORS;
    }
  },

  addDonor: (donor: Donor): void => {
    const donors = storageService.getAllDonors();
    // Simple duplicate check based on name (in a real app, check ID or Phone)
    const exists = donors.some(d => d.name === donor.name && d.phone === donor.phone);
    
    if (!exists) {
        // Add new donor to the top of the list
        const updatedDonors = [donor, ...donors];
        localStorage.setItem(DONORS_KEY, JSON.stringify(updatedDonors));
    }
  },

  // --- Requests ---
  getRequests: (): BloodRequest[] => {
    try {
      const data = localStorage.getItem(REQUESTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  checkDailyLimit: (): boolean => {
    const requests = storageService.getRequests();
    const today = new Date().toDateString();
    const todaysRequests = requests.filter(req => new Date(req.date).toDateString() === today);
    return todaysRequests.length < 3; 
  },

  addRequest: (request: Omit<BloodRequest, 'id' | 'date' | 'status' | 'notifiedCount'>): BloodRequest => {
    const requests = storageService.getRequests();
    
    // 1. Create the request object
    const newRequest: BloodRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'Verified', // Auto-verified via OTP for this demo
      notifiedCount: 0
    };

    // 2. Broadcast to donors (Logic simulation)
    const matchingDonors = storageService.findMatchingDonors(newRequest.bloodType);
    newRequest.notifiedCount = matchingDonors.length;

    // 3. Create simulated notifications for the current user (demo purpose: you see what a donor sees)
    if (matchingDonors.length > 0) {
        storageService.createBroadcastNotifications(newRequest, matchingDonors.length);
    }

    // Save
    localStorage.setItem(REQUESTS_KEY, JSON.stringify([newRequest, ...requests]));
    return newRequest;
  },

  acceptRequest: (requestId: string, notificationId?: string): void => {
    // 1. Update Request Status
    const requests = storageService.getRequests();
    const updatedRequests = requests.map(req => 
      req.id === requestId ? { ...req, status: 'Fulfilled' } as BloodRequest : req
    );
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updatedRequests));

    // 2. Update Notification Status if provided
    if (notificationId) {
      const notifications = storageService.getNotifications();
      const updatedNotes = notifications.map(note => 
        note.id === notificationId ? { ...note, accepted: true, isRead: true } : note
      );
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotes));
    }
  },

  deleteRequest: (id: string): void => {
    const requests = storageService.getRequests();
    const updatedRequests = requests.filter(req => req.id !== id);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updatedRequests));
  },

  // --- Matching Logic ---
  findMatchingDonors: (bloodType: string): Donor[] => {
    const allDonors = storageService.getAllDonors();
    // Simple logic: Match exact blood type or O- (Universal donor)
    return allDonors.filter(d => d.bloodType === bloodType || d.bloodType === BloodType.O_NEG);
  },

  // --- Notifications ---
  createBroadcastNotifications: (request: BloodRequest, count: number) => {
    const currentNotes = storageService.getNotifications();
    
    // Create a notification for the "Donor View" of the current user
    const newNotification: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      requestId: request.id,
      title: `URGENT: ${request.bloodType} Blood Needed`,
      message: `${request.hospital} needs ${request.bloodType} blood. Verified Request.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'URGENT_REQUEST',
      actionLabel: 'Respond Now',
      hospitalName: request.hospital,
      distance: '2.4 km', // Simulated distance relative to user
      urgencyLevel: request.urgency > 70 ? 'HIGH' : 'MEDIUM',
      accepted: false
    };

    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([newNotification, ...currentNotes]));
  },

  getNotifications: (): AppNotification[] => {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  markAsRead: (id: string) => {
    const notes = storageService.getNotifications();
    const updated = notes.map(n => n.id === id ? { ...n, isRead: true } : n);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  },

  clearAllNotifications: () => {
    localStorage.removeItem(NOTIFICATIONS_KEY);
  },

  // --- Profile ---
  getProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  updateProfile: (profile: UserProfile): void => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
};