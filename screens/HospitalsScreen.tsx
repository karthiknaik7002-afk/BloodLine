
import React, { useState } from 'react';
import { MOCK_HOSPITALS } from '../constants';
import { Hospital, BloodType } from '../types';
import { MapPin, Phone, X, Clock, Ambulance, CheckCircle2, Navigation } from 'lucide-react';

export const HospitalsScreen: React.FC = () => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const getStockColor = (units: number) => {
    if (units === 0) return 'text-slate-400 bg-slate-50 border-slate-100'; // None
    if (units < 5) return 'text-red-600 bg-red-50 border-red-100'; // Critical
    if (units < 15) return 'text-orange-600 bg-orange-50 border-orange-100'; // Low
    if (units < 30) return 'text-yellow-700 bg-yellow-50 border-yellow-100'; // Medium
    return 'text-green-600 bg-green-50 border-green-100'; // High
  };

  const allBloodTypes = Object.values(BloodType);

  return (
    <div className="flex flex-col gap-4 pb-24 animate-fade-in relative">
       <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
         <h2 className="text-xl font-bold text-slate-800">Nearby Hospitals</h2>
         <p className="text-slate-500 text-sm">View real-time blood bank status</p>
       </div>

       {MOCK_HOSPITALS.map((hospital) => (
         <div key={hospital.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-slate-800">{hospital.name}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                   <MapPin size={12} /> {hospital.distance} away
                </div>
              </div>
              <button onClick={() => window.open(`tel:108`)} className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100">
                 <Phone size={16} />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
               <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Stock Levels</p>
               <div className="flex flex-wrap gap-2">
                  {Object.entries(hospital.stock).slice(0, 4).map(([type, units]) => (
                    <div key={type} className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm">
                       <span className="font-bold text-slate-700 text-sm">{type}</span>
                       <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getStockColor(units).split(' ')[0]}`}>
                         {units} Units
                       </span>
                    </div>
                  ))}
                  {Object.keys(hospital.stock).length > 4 && (
                    <span className="text-[10px] text-slate-400 flex items-center px-2">+{Object.keys(hospital.stock).length - 4} more</span>
                  )}
               </div>
            </div>
            
            <button 
               onClick={() => setSelectedHospital(hospital)}
               className="w-full mt-3 py-2 text-sm font-medium text-brand-red border border-brand-red/20 rounded-xl hover:bg-red-50 transition-colors active:scale-95"
            >
               View Details
            </button>
         </div>
       ))}

       {/* Hospital Details Modal */}
       {selectedHospital && (
         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-slide-up">
               
               <button 
                  onClick={() => setSelectedHospital(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
               >
                  <X size={20} />
               </button>

               <div className="mb-6">
                  <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block">HOSPITAL</span>
                  <h2 className="text-2xl font-bold text-slate-800 leading-tight pr-8">{selectedHospital.name}</h2>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                     <MapPin size={14} /> 
                     <span>{selectedHospital.distance} • Mangalore</span>
                  </div>
               </div>

               {/* Quick Actions */}
               <div className="flex gap-3 mb-6">
                  <button onClick={() => window.open('tel:108')} className="flex-1 bg-brand-red text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-100 active:scale-95 transition-transform">
                     <Phone size={16} /> Call Now
                  </button>
                  <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-200 active:scale-95 transition-transform">
                     <Navigation size={16} /> Navigate
                  </button>
               </div>

               {/* Facilities */}
               <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                     <div className="p-2 bg-white rounded-full text-blue-600">
                        <Clock size={16} />
                     </div>
                     <div>
                        <p className="text-xs text-blue-400 font-bold uppercase">Hours</p>
                        <p className="text-sm font-bold text-slate-700">Open 24/7</p>
                     </div>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center gap-3">
                     <div className="p-2 bg-white rounded-full text-emerald-600">
                        <Ambulance size={16} />
                     </div>
                     <div>
                        <p className="text-xs text-emerald-500 font-bold uppercase">Service</p>
                        <p className="text-sm font-bold text-slate-700">Emergency</p>
                     </div>
                  </div>
               </div>

               {/* Detailed Stock */}
               <div className="mb-6">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                     Current Blood Stock
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                     {/* Show all blood types even if 0 stock */}
                     {allBloodTypes.map((type) => {
                        const units = selectedHospital.stock[type] || 0;
                        return (
                           <div key={type} className={`flex justify-between items-center p-3 rounded-xl border ${getStockColor(units)}`}>
                              <span className="font-extrabold text-lg text-slate-800">{type}</span>
                              <span className="text-xs font-bold px-2 py-1 bg-white/60 rounded-lg backdrop-blur-sm">
                                 {units} Units
                              </span>
                           </div>
                        );
                     })}
                  </div>
               </div>

               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500">
                  <div className="flex gap-2 mb-1">
                     <CheckCircle2 size={14} className="text-green-500" />
                     <p>Stock updated 15 minutes ago</p>
                  </div>
                  <div className="flex gap-2">
                     <CheckCircle2 size={14} className="text-green-500" />
                     <p>Verified Government Blood Bank</p>
                  </div>
               </div>

            </div>
         </div>
       )}
    </div>
  );
};
