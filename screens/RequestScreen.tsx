
import React, { useState, useRef } from 'react';
import { BloodType, BloodRequest } from '../types';
import { AlertTriangle, Send, ShieldCheck, Upload, User, Hospital, Phone, FileText, CheckCircle2, MessageSquare, BellRing } from 'lucide-react';
import { storageService } from '../services/storage';

export const RequestScreen: React.FC = () => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    bloodType: '' as BloodType | '',
    reason: '',
    hospital: '',
    hospitalWard: '',
    doctorName: '',
    contactNumber: '',
    proofFile: null as File | null
  });
  const [urgency, setUrgency] = useState(50);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [submittedRequest, setSubmittedRequest] = useState<BloodRequest | null>(null);
  const [error, setError] = useState('');
  
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, proofFile: e.target.files[0] });
      setError('');
    }
  };

  const handleVerifyClick = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.proofFile) {
      setError('Proof of medical necessity (Prescription/Admission Slip) is mandatory.');
      return;
    }

    if (!formData.contactNumber || formData.contactNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!storageService.checkDailyLimit()) {
      setError('Daily request limit reached (Max 3). To prevent spam, you cannot submit more requests today.');
      return;
    }

    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpSubmit = () => {
    const code = otp.join('');
    if (code.length === 4) {
      // Simulate verification & broadcast
      const req = storageService.addRequest({
        patientName: formData.patientName,
        patientAge: formData.patientAge,
        bloodType: formData.bloodType || '',
        reason: formData.reason,
        hospital: formData.hospital,
        hospitalWard: formData.hospitalWard,
        doctorName: formData.doctorName,
        contactNumber: formData.contactNumber,
        urgency: urgency,
        verificationProof: formData.proofFile?.name || 'Uploaded Document'
      });
      setSubmittedRequest(req);
      setStep('form');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleReset = () => {
    setSubmittedRequest(null);
    setFormData({
      patientName: '',
      patientAge: '',
      bloodType: '',
      reason: '',
      hospital: '',
      hospitalWard: '',
      doctorName: '',
      contactNumber: '',
      proofFile: null
    });
    setUrgency(50);
    setOtp(['', '', '', '']);
    setStep('form');
  };

  // --- Success / Dashboard View ---
  if (submittedRequest) {
    const donorCount = submittedRequest.notifiedCount || 0;
    
    return (
      <div className="flex flex-col gap-6 animate-fade-in pb-20">
        <div className="bg-white rounded-3xl p-6 text-center shadow-sm border border-slate-100 pt-8">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 shadow-lg shadow-green-50">
             <ShieldCheck size={40} />
           </div>
           <h2 className="text-2xl font-bold text-slate-800">Verified & Broadcasted</h2>
           <p className="text-slate-500 mt-2 text-sm">
             Your request has been verified. We have notified <b>{donorCount} eligible donors</b> near {formData.hospital}.
           </p>
        </div>

        {/* Broadcasting Stats */}
        <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl shadow-slate-200">
           <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <h3 className="font-bold text-sm uppercase tracking-wide opacity-80">Live Broadcast Status</h3>
           </div>
           
           <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center">
                 <BellRing size={20} className="mb-2 text-yellow-400" />
                 <span className="text-xl font-bold">{Math.ceil(donorCount * 0.8)}</span>
                 <span className="text-[10px] opacity-60">Push</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center">
                 <MessageSquare size={20} className="mb-2 text-green-400" />
                 <span className="text-xl font-bold">{Math.ceil(donorCount * 0.5)}</span>
                 <span className="text-[10px] opacity-60">WhatsApp</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 flex flex-col items-center">
                 <Phone size={20} className="mb-2 text-blue-400" />
                 <span className="text-xl font-bold">{Math.floor(donorCount * 0.2)}</span>
                 <span className="text-[10px] opacity-60">SMS</span>
              </div>
           </div>
           <div className="mt-4 text-[10px] text-center opacity-50">
              *Notifications sent securely. Donors will contact you via App or Phone.
           </div>
        </div>

        {/* Request Summary Card */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-slate-800 mb-3 text-sm">Request Details</h3>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">Patient</span>
               <span className="font-semibold">{formData.patientName}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">Blood Type</span>
               <span className="font-bold text-brand-red">{formData.bloodType}</span>
             </div>
             <div className="flex justify-between border-b border-slate-50 pb-2">
               <span className="text-slate-500">Hospital</span>
               <span className="font-semibold text-right max-w-[60%]">{formData.hospital}</span>
             </div>
             <div className="flex justify-between pt-1">
               <span className="text-slate-500">Urgency</span>
               <span className="font-bold text-red-600 uppercase">{urgency > 70 ? 'High' : 'Medium'}</span>
             </div>
           </div>
        </div>

        <button 
          onClick={handleReset}
          className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // --- Form View (Existing) ---
  return (
    <div className="flex flex-col gap-4 pb-24 animate-fade-in">
      <div className="bg-brand-red/10 p-4 rounded-3xl border border-brand-red/20 flex items-start gap-3">
         <AlertTriangle className="text-brand-red shrink-0" />
         <div>
           <h3 className="font-bold text-brand-darkRed">Verification Required</h3>
           <p className="text-xs text-brand-red/80">To prevent spam, all requests require OTP verification and valid medical proof.</p>
         </div>
      </div>

      <form onSubmit={handleVerifyClick} className="flex flex-col gap-4">
        
        {/* Patient Details Section */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-50 pb-2">
            <User size={18} className="text-brand-red" />
            <h2>Patient Details</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Patient Name *</label>
              <input 
                required 
                name="patientName"
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20" 
                placeholder="Full Name"
                value={formData.patientName}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-3">
               <div className="w-1/3">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Age *</label>
                  <input 
                    required 
                    name="patientAge"
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20" 
                    placeholder="Age"
                    value={formData.patientAge}
                    onChange={handleInputChange}
                  />
               </div>
               <div className="w-2/3">
                 <label className="block text-xs font-semibold text-slate-500 mb-1">Diagnosis / Reason *</label>
                 <input 
                   required 
                   name="reason"
                   type="text" 
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20" 
                   placeholder="e.g. Surgery, Dengue"
                   value={formData.reason}
                   onChange={handleInputChange}
                 />
               </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Blood Type Required *</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.values(BloodType).map((type) => (
                    <label key={type} className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="bloodType" 
                        className="peer sr-only" 
                        required 
                        checked={formData.bloodType === type}
                        onChange={() => setFormData({...formData, bloodType: type})}
                      />
                      <div className="text-center py-2 rounded-xl border border-slate-200 text-slate-600 peer-checked:bg-brand-red peer-checked:text-white peer-checked:border-brand-red transition-all font-bold text-xs">
                          {type}
                      </div>
                    </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hospital Details Section */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-50 pb-2">
            <Hospital size={18} className="text-brand-red" />
            <h2>Hospital Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Hospital Name *</label>
              <input 
                required 
                name="hospital"
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20" 
                placeholder="Hospital Name"
                value={formData.hospital}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Ward / Room No</label>
                <input 
                  name="hospitalWard"
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20" 
                  placeholder="Optional"
                  value={formData.hospitalWard}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Doctor's Name</label>
                <input 
                  name="doctorName"
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20" 
                  placeholder="Optional"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Proof & Verification */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-50 pb-2">
            <FileText size={18} className="text-brand-red" />
            <h2>Proof & Verification</h2>
          </div>
          
          {/* File Upload */}
          <div className="mb-4">
             <label className="block text-xs font-semibold text-slate-500 mb-2">Upload Doctor's Prescription / Admission Slip *</label>
             <div className="relative">
               <input 
                 type="file" 
                 id="proof-upload"
                 className="hidden" 
                 accept="image/*,.pdf"
                 onChange={handleFileChange}
               />
               <label htmlFor="proof-upload" className={`flex items-center justify-center gap-2 w-full p-4 bg-slate-50 border-2 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors ${!formData.proofFile ? 'border-brand-red/30 bg-red-50/30' : 'border-slate-200'}`}>
                  {formData.proofFile ? (
                    <span className="text-green-600 font-medium text-sm flex items-center gap-2">
                      <ShieldCheck size={16} /> {formData.proofFile.name}
                    </span>
                  ) : (
                    <>
                      <Upload size={18} className="text-brand-red opacity-60" />
                      <span className="text-slate-500 text-sm">Tap to upload file (Required)</span>
                    </>
                  )}
               </label>
             </div>
          </div>

          <div>
             <label className="block text-xs font-semibold text-slate-500 mb-1">Mobile Number (for OTP) *</label>
             <div className="relative">
                <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  required 
                  name="contactNumber"
                  type="tel" 
                  maxLength={10}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-red/20 font-mono tracking-wide" 
                  placeholder="9876543210"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
             </div>
          </div>
        </div>

        {/* Urgency Slider */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
           <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-slate-700">Urgency Level</label>
              <span className={`text-xs font-bold ${urgency > 75 ? 'text-red-600' : 'text-slate-500'}`}>
                {urgency > 75 ? 'CRITICAL' : urgency > 40 ? 'HIGH' : 'MODERATE'}
              </span>
           </div>
           <input 
             type="range" 
             min="0" 
             max="100" 
             value={urgency} 
             onChange={(e) => setUrgency(parseInt(e.target.value))}
             className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
           />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 font-medium animate-pulse">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <button type="submit" className="w-full bg-brand-red text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-200 active:scale-95 transition-transform">
           Verify & Submit Request
        </button>

      </form>

      {/* OTP Modal */}
      {step === 'otp' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-slate-800">Enter OTP</h3>
                 <button onClick={() => setStep('form')} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
              </div>
              
              <p className="text-slate-500 text-sm mb-6 text-center">
                We've sent a verification code to <br/> 
                <span className="text-slate-800 font-bold">+91 {formData.contactNumber}</span>
              </p>

              <div className="flex justify-center gap-3 mb-8">
                 {otp.map((digit, idx) => (
                   <input
                     key={idx}
                     ref={otpRefs[idx]}
                     type="text"
                     maxLength={1}
                     value={digit}
                     onChange={(e) => handleOtpChange(idx, e.target.value)}
                     className="w-12 h-14 border-2 border-slate-200 rounded-xl text-center text-2xl font-bold text-slate-800 outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all"
                   />
                 ))}
              </div>

              {error && (
                <p className="text-red-500 text-xs text-center mb-4">{error}</p>
              )}

              <button 
                onClick={handleOtpSubmit}
                className="w-full bg-brand-darkRed text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-red-100"
              >
                Verify Code
              </button>
              
              <p className="text-center mt-4 text-xs text-slate-400">
                Didn't receive code? <button className="text-brand-red font-bold">Resend</button>
              </p>
           </div>
        </div>
      )}
    </div>
  );
};
