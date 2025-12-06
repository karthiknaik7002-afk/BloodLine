import React, { useState, useRef } from 'react';
import { User, Phone, MapPin, Upload, ShieldCheck, Check, AlertCircle, ArrowLeft, Calendar, Scale, FileText } from 'lucide-react';
import { BloodType, Tab, UserProfile, Donor } from '../types';
import { storageService } from '../services/storage';

interface DonorRegistrationScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

export const DonorRegistrationScreen: React.FC<DonorRegistrationScreenProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    dob: '',
    gender: 'Male',
    weight: '',
    tattoo: 'No',
    bloodType: BloodType.O_POS,
    lastDonation: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    fitToDonate: false,
    noRecentTattoo: false,
    allowNotifications: false,
    agreeTerms: false
  });

  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadhaarFile(e.target.files[0]);
    }
  };

  const handleSendOTP = () => {
    if (formData.phone.length === 10) {
      setOtpSent(true);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } else {
      alert("Please enter a valid 10-digit phone number");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) otpRefs[index + 1].current?.focus();
  };

  const handleVerifyOTP = () => {
    if (otp.join('').length === 4) {
      setOtpVerified(true);
      setOtpSent(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Save profile data for the current user
    const newProfile: UserProfile = {
      ...storageService.getProfile(),
      name: formData.fullName,
      bloodType: formData.bloodType as BloodType,
      age: formData.age,
      gender: formData.gender,
      weight: formData.weight,
      city: formData.city,
      phone: formData.phone,
      isVerified: true
    };
    storageService.updateProfile(newProfile);

    // 2. Add as a public Donor in the system
    const newDonor: Donor = {
      id: `D-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.fullName,
      bloodType: formData.bloodType as BloodType,
      location: formData.city || 'Unknown',
      isAvailable: true,
      badges: ['New Donor'],
      phone: formData.phone
    };
    storageService.addDonor(newDonor);

    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 animate-fade-in text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-50">
          <ShieldCheck size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Registration Successful!</h2>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto">
          Welcome to the BloodLine community, <b>{formData.fullName}</b>. You are now a registered donor.
        </p>
        
        <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 text-left">
           <div className="flex items-center gap-2 mb-2 text-sm text-slate-600">
             <Check size={16} className="text-green-500" /> Notifications Enabled
           </div>
           <div className="flex items-center gap-2 mb-2 text-sm text-slate-600">
             <Check size={16} className="text-green-500" /> ID Verified
           </div>
           <div className="flex items-center gap-2 text-sm text-slate-600">
             <Check size={16} className="text-green-500" /> Health Check Passed
           </div>
           <div className="flex items-center gap-2 mt-2 text-sm text-brand-red font-semibold">
             <Check size={16} /> Added to Donor List
           </div>
        </div>

        <button 
          onClick={onComplete}
          className="w-full bg-brand-red text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-200 active:scale-95 transition-transform"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-4 py-4 border-b border-slate-100 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Donor Registration</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-5">
        
        {/* Section 1: Personal Information */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-50 pb-2">
            <User size={18} className="text-brand-red" />
            <h2>Personal Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Full Name *</label>
              <input 
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Date of Birth *</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    required
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Age</label>
                <input 
                  type="number" 
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Yrs" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-xs font-semibold text-slate-500 mb-1 block">Gender *</label>
                 <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20"
                 >
                   <option>Male</option>
                   <option>Female</option>
                   <option>Other</option>
                 </select>
               </div>
               <div>
                 <label className="text-xs font-semibold text-slate-500 mb-1 block">Weight (kg) *</label>
                 <div className="relative">
                    <Scale size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      required
                      type="number" 
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="00" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20"
                    />
                 </div>
               </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Blood Group *</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.values(BloodType).map((type) => (
                    <label key={type} className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="bloodType" 
                        value={type}
                        checked={formData.bloodType === type}
                        onChange={handleChange}
                        className="peer sr-only" 
                      />
                      <div className="text-center py-2 rounded-xl border border-slate-200 text-slate-600 peer-checked:bg-brand-red peer-checked:text-white peer-checked:border-brand-red transition-all font-bold text-xs">
                          {type}
                      </div>
                    </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Tattoo in last 6 months?</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tattoo" value="Yes" onChange={handleChange} checked={formData.tattoo === "Yes"} className="accent-brand-red" />
                  <span className="text-sm text-slate-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tattoo" value="No" onChange={handleChange} checked={formData.tattoo === "No"} className="accent-brand-red" />
                  <span className="text-sm text-slate-700">No</span>
                </label>
              </div>
              {formData.tattoo === 'Yes' && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> You may not be eligible to donate currently.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Contact & OTP */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-50 pb-2">
            <Phone size={18} className="text-brand-red" />
            <h2>Contact & Address</h2>
          </div>

          <div className="space-y-4">
             <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Phone Number *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">+91</span>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={10}
                      disabled={otpVerified}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20 font-mono tracking-wide ${otpVerified ? 'text-green-600 font-bold bg-green-50' : ''}`}
                    />
                    {otpVerified && <Check size={16} className="absolute right-3 top-3 text-green-500" />}
                  </div>
                  {!otpVerified && (
                     <button 
                       type="button"
                       onClick={handleSendOTP}
                       disabled={otpSent}
                       className="bg-brand-red text-white text-xs font-bold px-4 rounded-xl disabled:bg-slate-300 whitespace-nowrap"
                     >
                       {otpSent ? 'Sent' : 'Send OTP'}
                     </button>
                  )}
                </div>
             </div>

             {otpSent && !otpVerified && (
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 animate-slide-up">
                  <label className="text-xs font-semibold text-slate-500 mb-2 block text-center">Enter 4-digit Code</label>
                  <div className="flex justify-center gap-2 mb-3">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpRefs[idx]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-10 h-10 border border-slate-300 rounded-lg text-center text-lg font-bold text-slate-800 outline-none focus:border-brand-red"
                      />
                    ))}
                  </div>
                  <button 
                    type="button"
                    onClick={handleVerifyOTP}
                    className="w-full bg-slate-800 text-white py-2 rounded-lg text-xs font-bold"
                  >
                    Verify OTP
                  </button>
               </div>
             )}

             <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">City & Pincode *</label>
                <div className="flex gap-3">
                   <input 
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City" 
                      className="flex-[2] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20"
                   />
                   <input 
                      required
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Pin" 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20"
                   />
                </div>
             </div>
             
             <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Full Address</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-red/20 resize-none"
                ></textarea>
             </div>
          </div>
        </div>

        {/* Section 3: Identity */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-50 pb-2">
            <FileText size={18} className="text-brand-red" />
            <h2>Identification</h2>
          </div>
          
          <label className="block text-xs font-semibold text-slate-500 mb-2">Upload Aadhaar Card *</label>
          <div className="relative">
             <input 
               type="file" 
               id="aadhaar-upload" 
               className="hidden" 
               accept=".jpg,.png,.pdf"
               onChange={handleFileChange} 
             />
             <label htmlFor="aadhaar-upload" className={`flex flex-col items-center justify-center gap-2 w-full p-6 bg-slate-50 border-2 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors ${aadhaarFile ? 'border-green-300 bg-green-50' : 'border-slate-300'}`}>
                {aadhaarFile ? (
                   <>
                     <ShieldCheck size={24} className="text-green-500" />
                     <div className="text-center">
                       <p className="text-sm font-bold text-green-700">{aadhaarFile.name}</p>
                       <p className="text-[10px] text-green-600">File attached successfully</p>
                     </div>
                   </>
                ) : (
                   <>
                     <Upload size={24} className="text-slate-400" />
                     <div className="text-center">
                       <p className="text-sm font-semibold text-slate-600">Click to Upload</p>
                       <p className="text-[10px] text-slate-400">JPG, PNG or PDF (Max 5MB)</p>
                     </div>
                   </>
                )}
             </label>
          </div>
        </div>

        {/* Section 4: Health & Consent */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-50 pb-2">
            <ShieldCheck size={18} className="text-brand-red" />
            <h2>Health & Consent</h2>
          </div>

          <div className="space-y-3">
             <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
               <input 
                 type="checkbox" 
                 required
                 name="fitToDonate"
                 checked={formData.fitToDonate}
                 onChange={handleCheckboxChange}
                 className="mt-1 w-4 h-4 accent-brand-red" 
               />
               <span className="text-xs text-slate-600 leading-relaxed">
                 I confirm I am <b>fit to donate</b> (no major illness, not pregnant, healthy weight).
               </span>
             </label>

             <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
               <input 
                 type="checkbox" 
                 required
                 name="noRecentTattoo"
                 checked={formData.noRecentTattoo}
                 onChange={handleCheckboxChange}
                 className="mt-1 w-4 h-4 accent-brand-red" 
               />
               <span className="text-xs text-slate-600 leading-relaxed">
                 I confirm I have <b>NOT</b> done any tattoo in the past 6 months.
               </span>
             </label>

             <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
               <input 
                 type="checkbox" 
                 name="allowNotifications"
                 checked={formData.allowNotifications}
                 onChange={handleCheckboxChange}
                 className="mt-1 w-4 h-4 accent-brand-red" 
               />
               <span className="text-xs text-slate-600 leading-relaxed">
                 Allow BloodLine to send me <b>urgent donation alerts</b> via App/SMS.
               </span>
             </label>

             <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
               <input 
                 type="checkbox" 
                 required
                 name="agreeTerms"
                 checked={formData.agreeTerms}
                 onChange={handleCheckboxChange}
                 className="mt-1 w-4 h-4 accent-brand-red" 
               />
               <span className="text-xs text-slate-600 leading-relaxed">
                 I agree to the <b className="text-brand-red">Privacy Policy</b> and consent to be contacted for emergencies.
               </span>
             </label>
          </div>
        </div>

        {/* Submit Button */}
        <button 
           type="submit"
           disabled={!otpVerified || !formData.agreeTerms || !formData.fitToDonate}
           className="w-full bg-brand-red disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-200 active:scale-95 transition-transform"
        >
          {otpVerified ? 'Register as Donor' : 'Verify OTP to Register'}
        </button>

      </form>
    </div>
  );
};
