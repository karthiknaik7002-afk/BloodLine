import React, { useState, useEffect } from 'react';
import { Search, MapPin, Droplet, Filter, RefreshCw } from 'lucide-react';
import { storageService } from '../services/storage';
import { BloodType, Donor } from '../types';

export const DonorsScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<BloodType | ''>('');
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = () => {
    const data = storageService.getAllDonors();
    setDonors(data);
  };

  const filteredDonors = donors.filter(donor => {
     const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           donor.location.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesType = filterType ? donor.bloodType === filterType : true;
     return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col gap-4 pb-24 h-full animate-fade-in">
      {/* Search Header */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-slate-800">Find Donors</h2>
           <button onClick={loadDonors} className="p-2 text-slate-400 hover:text-brand-red bg-slate-50 rounded-full">
              <RefreshCw size={16} />
           </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            className="w-full bg-slate-50 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-red/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
          <button 
             onClick={() => setFilterType('')}
             className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${!filterType ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
          >
            All
          </button>
          {Object.values(BloodType).map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${filterType === type ? 'bg-brand-red text-white border-brand-red' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Donors List */}
      <div className="flex flex-col gap-3">
        {filteredDonors.map((donor) => (
          <div key={donor.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm relative">
                {donor.name.charAt(0)}
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${donor.isAvailable ? 'bg-green-500' : 'bg-slate-400'}`}></span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{donor.name}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <MapPin size={12} /> {donor.location}
                </div>
                <div className="flex gap-1 mt-1">
                  {donor.badges.map(badge => (
                     <span key={badge} className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-medium">{badge}</span>
                  ))}
                  {/* Tag for new users */}
                  {!MOCK_DONORS_IDS.includes(donor.id) && (
                     <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">New</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <span className="bg-red-50 text-brand-red font-bold px-2 py-1 rounded-lg text-xs border border-red-100">
                {donor.bloodType}
              </span>
              <button onClick={() => window.open(donor.phone ? `tel:${donor.phone}` : 'tel:108')} className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-full font-medium active:scale-95 transition-transform">
                Contact
              </button>
            </div>
          </div>
        ))}
        
        {filteredDonors.length === 0 && (
           <div className="text-center py-10 text-slate-400">
             <Filter size={40} className="mx-auto mb-2 opacity-50" />
             <p>No donors found matching your criteria.</p>
           </div>
        )}
      </div>
    </div>
  );
};

// Helper to identify mock vs real for UI tag
const MOCK_DONORS_IDS = ['1','2','3','4','5','6','7','8','9','10','11'];
