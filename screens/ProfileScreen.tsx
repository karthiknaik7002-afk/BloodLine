
import React, { useEffect, useState } from 'react';
import { User, Award, Droplet, Clock, Edit2, Settings, Save, X, History, Trash2, AlertCircle, FileText, Share2, Activity, MapPin, Zap, Trophy, ShieldCheck, Lock, Star } from 'lucide-react';
import { BloodType, UserProfile, BloodRequest } from '../types';
import { storageService } from '../services/storage';

const ALL_BADGES = [
  { id: 'first_donor', name: 'First Donor', desc: 'Completed your first blood donation.', icon: Droplet, color: 'text-red-500 bg-red-100' },
  { id: 'life_saver', name: 'Life Saver', desc: 'Your donations have saved 5+ lives.', icon: Activity, color: 'text-blue-500 bg-blue-100' },
  { id: 'hero', name: 'Hero', desc: 'Responded to an urgent emergency request.', icon: Zap, color: 'text-yellow-500 bg-yellow-100' },
  { id: 'regular', name: 'Regular Donor', desc: 'Donated 3 times in a single year.', icon: Clock, color: 'text-green-500 bg-green-100' },
  { id: 'golden', name: 'Golden Arm', desc: 'Reached a milestone of 20 donations.', icon: Trophy, color: 'text-purple-500 bg-purple-100' },
  { id: 'verified', name: 'Verified', desc: 'Identity and medical records verified.', icon: ShieldCheck, color: 'text-teal-500 bg-teal-100' },
  { id: 'superstar', name: 'Super Star', desc: 'Donated to 50 different people.', icon: Star, color: 'text-pink-500 bg-pink-100' },
];

export const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const userProfile = storageService.getProfile();
    setProfile(userProfile);
    setEditForm(userProfile);
    setRequests(storageService.getRequests());
  };

  const handleSave = () => {
    if (editForm) {
      storageService.updateProfile(editForm);
      setProfile(editForm);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleDeleteRequest = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this request permanently?')) {
      storageService.deleteRequest(id);
      loadData();
      if (selectedRequest?.id === id) setSelectedRequest(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Under Review': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'Verified': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'Fulfilled': return 'bg-green-100 text-green-700 border border-green-200';
      case 'Cancelled': return 'bg-slate-100 text-slate-600 border border-slate-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!profile || !editForm) return null;

  return (
    <div className="flex flex-col gap-6 pb-24 animate-fade-in relative">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center relative">
         <button 
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
         >
           <Settings size={20} />
         </button>
         
         <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-red to-rose-600 p-1 mb-3 shadow-lg shadow-red-100">
           <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
             <User size={40} className="text-slate-300" />
           </div>
         </div>
         
         {isEditing ? (
           <div className="w-full flex flex-col items-center gap-2 mb-4">
             <input 
                type="text" 
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="text-center font-bold text-xl text-slate-800 border-b border-slate-300 focus:border-brand-red outline-none pb-1 w-2/3"
             />
             <div className="text-slate-500 text-sm">ID: {profile.id}</div>
           </div>
         ) : (
           <>
             <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
             <p className="text-slate-500 text-sm mb-4">ID: {profile.id}</p>
           </>
         )}
         
         <div className="flex gap-4 w-full justify-center">
            <div className="flex flex-col items-center bg-slate-50 px-4 py-2 rounded-2xl min-w-[100px]">
               <span className="text-xs text-slate-400 font-medium uppercase mb-1">Type</span>
               {isEditing ? (
                 <select 
                   value={editForm.bloodType}
                   onChange={(e) => setEditForm({...editForm, bloodType: e.target.value as BloodType})}
                   className="bg-white border border-slate-200 text-sm rounded-lg p-1 text-slate-800 font-bold outline-none"
                 >
                   {Object.values(BloodType).map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
               ) : (
                 <span className="text-xl font-bold text-brand-darkRed">{profile.bloodType}</span>
               )}
            </div>
            <div className="flex flex-col items-center bg-slate-50 px-4 py-2 rounded-2xl min-w-[100px]">
               <span className="text-xs text-slate-400 font-medium uppercase mb-1">Donations</span>
               <span className="text-xl font-bold text-slate-800">{profile.donations}</span>
            </div>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-2">
               <Droplet size={18} fill="currentColor" />
            </div>
            <p className="text-xs text-slate-400">Lives Saved</p>
            <p className="text-lg font-bold text-slate-800">~{profile.livesSaved}</p>
         </div>
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-2">
               <Clock size={18} />
            </div>
            <p className="text-xs text-slate-400">Next Eligible</p>
            <p className="text-lg font-bold text-slate-800">{profile.nextEligibleDate}</p>
         </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
         <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-slate-800">Badges Earned</h3>
           <button 
             onClick={() => setShowBadgesModal(true)}
             className="text-xs text-brand-red font-medium hover:underline"
           >
             View All
           </button>
         </div>
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {profile.badges.map((badgeName, idx) => {
              // Find badge def to use icon
              const badgeDef = ALL_BADGES.find(b => b.name === badgeName) || ALL_BADGES[0];
              const Icon = badgeDef.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-1 min-w-[70px]">
                   <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 border-2 border-yellow-200">
                      <Icon size={24} />
                   </div>
                   <span className="text-[10px] font-medium text-slate-600 text-center">{badgeName}</span>
                </div>
              );
            })}
         </div>
      </div>

      {/* Request History */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
             <History size={18} className="text-brand-red" />
             <h3 className="font-bold text-slate-800">My Requests</h3>
          </div>
          
          {requests.length > 0 ? (
            <div className="flex flex-col gap-3">
              {requests.map(req => (
                <div 
                  key={req.id} 
                  onClick={() => setSelectedRequest(req)}
                  className="bg-slate-50 p-3 rounded-xl flex justify-between items-start group relative overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-800">{req.hospital}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Patient: {req.patientName} {req.patientAge ? `(${req.patientAge}y)` : ''}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{new Date(req.date).toLocaleDateString()}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-brand-red text-sm">{req.bloodType}</span>
                         <button 
                            onClick={(e) => handleDeleteRequest(e, req.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-lg transition-colors z-10"
                          >
                            <Trash2 size={14} />
                          </button>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${getStatusStyle(req.status)}`}>
                        {req.status}
                      </span>
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No active requests found.
            </div>
          )}
      </div>

      {isEditing ? (
        <div className="flex gap-3">
          <button 
            onClick={cancelEdit}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-200 text-slate-700 p-4 rounded-2xl font-bold"
          >
            <X size={18} /> Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-green-200"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white p-4 rounded-2xl font-bold shadow-lg shadow-slate-200"
        >
          <Edit2 size={18} /> Edit Profile
        </button>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-700 font-medium text-sm">Push Notifications</span>
                <div className="w-10 h-6 bg-brand-red rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-700 font-medium text-sm">Dark Mode</span>
                <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-700 font-medium text-sm">Location Access</span>
                <div className="w-10 h-6 bg-brand-red rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              
              <hr className="border-slate-100 my-2" />
              
              <button className="w-full text-left p-3 hover:bg-slate-50 rounded-xl text-slate-600 font-medium text-sm transition-colors">
                Privacy Policy
              </button>
              <button className="w-full text-left p-3 hover:bg-slate-50 rounded-xl text-slate-600 font-medium text-sm transition-colors">
                Help & Support
              </button>
              
              <button 
                 onClick={() => {
                    if(window.confirm('Log out?')) setShowSettings(false);
                 }}
                 className="w-full mt-2 text-red-500 font-bold py-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badges Modal */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
           <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-slide-up">
              <button 
                onClick={() => setShowBadgesModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>
              
              <div className="mb-6">
                <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block">ACHIEVEMENTS</span>
                <h2 className="text-2xl font-bold text-slate-800">All Badges</h2>
                <p className="text-slate-500 text-sm mt-1">Earn badges by donating and helping others.</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                 {ALL_BADGES.map((badge) => {
                   const isEarned = profile.badges.includes(badge.name);
                   const Icon = badge.icon;
                   
                   return (
                     <div key={badge.id} className={`flex flex-col items-center p-3 rounded-xl border ${isEarned ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 relative ${isEarned ? badge.color : 'bg-slate-200 text-slate-400 grayscale'}`}>
                           <Icon size={20} />
                           {!isEarned && (
                             <div className="absolute -bottom-1 -right-1 bg-slate-500 rounded-full p-0.5 border-2 border-white text-white">
                               <Lock size={8} />
                             </div>
                           )}
                        </div>
                        <span className={`text-xs font-bold text-center mb-1 ${isEarned ? 'text-slate-800' : 'text-slate-400'}`}>
                          {badge.name}
                        </span>
                        <p className="text-[9px] text-center text-slate-400 leading-tight">
                           {badge.desc}
                        </p>
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
           <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-slide-up">
              
              <button 
                onClick={() => setSelectedRequest(null)}
                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                   <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${getStatusStyle(selectedRequest.status)}`}>
                      {selectedRequest.status}
                   </span>
                   <span className="text-[10px] text-slate-400">ID: {selectedRequest.id}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 leading-tight">Request Details</h2>
              </div>

              {/* Broadcast Stats */}
              <div className="bg-slate-900 rounded-2xl p-4 text-white mb-6 shadow-xl shadow-slate-200">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                      <Activity size={16} className="text-brand-red" />
                      <span className="font-bold text-sm">Broadcast Summary</span>
                   </div>
                   <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Live</span>
                </div>
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-3xl font-bold">{selectedRequest.notifiedCount || 0}</p>
                      <p className="text-[10px] opacity-60">Donors Notified</p>
                   </div>
                   <button className="text-xs bg-white text-slate-900 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
                      <Share2 size={12} /> Share
                   </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                      <User size={12} /> Patient Information
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Name</p>
                        <p className="font-bold text-slate-800">{selectedRequest.patientName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Age</p>
                        <p className="font-bold text-slate-800">{selectedRequest.patientAge} Years</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500">Diagnosis/Reason</p>
                        <p className="font-bold text-slate-800">{selectedRequest.reason}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                      <MapPin size={12} /> Hospital Details
                   </h3>
                   <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500">Hospital Name</p>
                        <p className="font-bold text-slate-800">{selectedRequest.hospital}</p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Ward</p>
                          <p className="font-bold text-slate-800">{selectedRequest.hospitalWard || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Doctor</p>
                          <p className="font-bold text-slate-800">{selectedRequest.doctorName || 'N/A'}</p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="bg-red-50 p-2 rounded-lg text-brand-red">
                         <FileText size={18} />
                      </div>
                      <div>
                         <p className="text-xs text-slate-500 font-medium">Verification Proof</p>
                         <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{selectedRequest.verificationProof}</p>
                      </div>
                   </div>
                   <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold">Verified</span>
                </div>
              </div>

              {selectedRequest.status !== 'Fulfilled' && selectedRequest.status !== 'Cancelled' && (
                 <button 
                   onClick={() => {
                      if(window.confirm('Mark this request as fulfilled? This will stop notifications to donors.')) {
                        storageService.acceptRequest(selectedRequest.id);
                        loadData();
                        setSelectedRequest(null);
                      }
                   }}
                   className="w-full mt-6 bg-brand-red text-white py-3 rounded-xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform"
                 >
                   Mark as Fulfilled
                 </button>
              )}
           </div>
        </div>
      )}

    </div>
  );
};
