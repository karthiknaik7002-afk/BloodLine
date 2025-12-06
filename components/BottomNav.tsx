import React from 'react';
import { Home, Users, Building2, PlusCircle, UserCircle } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const getTabClass = (tab: Tab) => `
    flex flex-col items-center justify-center gap-1 p-2 w-full transition-all duration-300
    ${activeTab === tab ? 'text-brand-red scale-105' : 'text-slate-400 hover:text-slate-600'}
  `;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 pb-safe pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 max-w-md mx-auto">
      <div className="flex justify-between items-end pb-2">
        <button onClick={() => onTabChange(Tab.HOME)} className={getTabClass(Tab.HOME)}>
          <Home size={24} strokeWidth={activeTab === Tab.HOME ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        
        <button onClick={() => onTabChange(Tab.DONORS)} className={getTabClass(Tab.DONORS)}>
          <Users size={24} strokeWidth={activeTab === Tab.DONORS ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Donors</span>
        </button>

        {/* Floating Action Button for Request */}
        <div className="relative -top-5">
           <button 
             onClick={() => onTabChange(Tab.REQUEST)}
             className={`
               w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-red-200 transition-transform active:scale-95 border-4 border-slate-50
               ${activeTab === Tab.REQUEST ? 'bg-brand-darkRed text-white' : 'bg-brand-red text-white'}
             `}
           >
             <PlusCircle size={28} />
           </button>
        </div>

        <button onClick={() => onTabChange(Tab.HOSPITALS)} className={getTabClass(Tab.HOSPITALS)}>
          <Building2 size={24} strokeWidth={activeTab === Tab.HOSPITALS ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Hospitals</span>
        </button>

        <button onClick={() => onTabChange(Tab.PROFILE)} className={getTabClass(Tab.PROFILE)}>
          <UserCircle size={24} strokeWidth={activeTab === Tab.PROFILE ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};
