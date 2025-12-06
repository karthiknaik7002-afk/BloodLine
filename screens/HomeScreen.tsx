
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Heart, Activity, Trophy, ArrowRight, Zap } from 'lucide-react';
import { getBloodDemandForecast } from '../services/geminiService';
import { PredictionData, Tab } from '../types';

interface HomeScreenProps {
  onChangeTab: (tab: Tab) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onChangeTab }) => {
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  useEffect(() => {
    // Load initial data
    handleLoadPrediction();
  }, []);

  const handleLoadPrediction = async () => {
    setLoadingPrediction(true);
    const data = await getBloodDemandForecast();
    setPredictionData(data);
    setLoadingPrediction(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 animate-fade-in">
      
      {/* 1. Emergency Request Card */}
      <div className="bg-gradient-to-br from-brand-red to-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-red-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <AlertCircle size={24} className="text-white" />
            </div>
            <span className="bg-red-800/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10">URGENT</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Need Blood Urgently?</h2>
          <p className="text-red-100 mb-6 text-sm">Find compatible donors or nearby hospitals instantly.</p>
          <button 
            onClick={() => onChangeTab(Tab.REQUEST)}
            className="w-full bg-white text-brand-red py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            REQUEST BLOOD
          </button>
        </div>
      </div>

      {/* 2. Become a Donor */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Become a Donor</h3>
          <p className="text-slate-500 text-xs mt-1">Help save lives with one click.</p>
          <button 
             onClick={() => onChangeTab(Tab.REGISTER)}
             className="mt-3 text-brand-red text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Register Now <ArrowRight size={14} />
          </button>
        </div>
        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
          <Heart className="text-rose-500" fill="currentColor" size={24} />
        </div>
      </div>

      {/* 3. Live Blood Availability */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Activity size={18} className="text-brand-red" />
            Live Availability
          </h3>
          <span className="text-[10px] text-slate-400">Updated 5m ago</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {['A+', 'B+', 'O+', 'AB+'].map((type) => (
            <div key={type} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2">
              <span className="font-bold text-slate-700">{type}</span>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${type === 'O+' ? 'bg-red-500 w-[30%]' : 'bg-green-500 w-[70%]'}`}></div>
              </div>
            </div>
          ))}
          {['A-', 'B-', 'O-', 'AB-'].map((type) => (
            <div key={type} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2">
              <span className="font-bold text-slate-700">{type}</span>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${type === 'O-' ? 'bg-red-500 w-[20%]' : 'bg-yellow-500 w-[50%]'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. AI Prediction Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Zap size={18} className="text-purple-500" fill="currentColor" />
              AI Demand Forecast
            </h3>
            <p className="text-slate-400 text-xs mt-1">Predicts shortages via Gemini AI</p>
          </div>
          <button 
            onClick={handleLoadPrediction}
            disabled={loadingPrediction}
            className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500"
          >
             <Activity size={16} className={loadingPrediction ? 'animate-spin' : ''}/>
          </button>
        </div>
        
        <div className="h-40 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={predictionData}>
               <defs>
                 <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ color: '#64748B' }}
               />
               <Area type="monotone" dataKey="demand" stroke="#FF4D4D" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
               <Area type="monotone" dataKey="supply" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
           <div className="flex items-center gap-1 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-red-500"></div> Demand
           </div>
           <div className="flex items-center gap-1 text-xs text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Supply
           </div>
        </div>
      </div>

      {/* 5. Rewards Card */}
      <div className="bg-indigo-600 rounded-3xl p-5 text-white shadow-lg shadow-indigo-200 flex items-center justify-between">
         <div>
            <h3 className="font-bold">Earn Rewards</h3>
            <p className="text-indigo-200 text-xs mt-1">Get badges & recognition.</p>
         </div>
         <Trophy size={32} className="text-yellow-300" />
      </div>

    </div>
  );
};
