
import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { DonorsScreen } from './screens/DonorsScreen';
import { HospitalsScreen } from './screens/HospitalsScreen';
import { RequestScreen } from './screens/RequestScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { DonorRegistrationScreen } from './screens/DonorRegistrationScreen';
import { Tab } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);

  const renderScreen = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <HomeScreen onChangeTab={setActiveTab} />;
      case Tab.DONORS:
        return <DonorsScreen />;
      case Tab.HOSPITALS:
        return <HospitalsScreen />;
      case Tab.REQUEST:
        return <RequestScreen />;
      case Tab.PROFILE:
        return <ProfileScreen />;
      case Tab.REGISTER:
        return (
          <DonorRegistrationScreen 
            onBack={() => setActiveTab(Tab.HOME)} 
            onComplete={() => setActiveTab(Tab.PROFILE)} 
          />
        );
      default:
        return <HomeScreen onChangeTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {activeTab !== Tab.REGISTER && <Header onProfileClick={() => setActiveTab(Tab.PROFILE)} />}
      
      <main className={`p-4 overflow-y-auto h-[calc(100vh-60px)] no-scrollbar scroll-smooth ${activeTab === Tab.REGISTER ? 'h-screen p-0 bg-slate-50' : ''}`}>
        {renderScreen()}
      </main>

      {activeTab !== Tab.REGISTER && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  );
}

export default App;
