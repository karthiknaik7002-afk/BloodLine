import React, { useState, useEffect } from 'react';
import { Droplet, User, Bell, X, Check, Phone, MapPin, AlertCircle, HeartHandshake } from 'lucide-react';
import { storageService } from '../services/storage';
import { AppNotification } from '../types';

interface HeaderProps {
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll for notifications or update when opening
  const loadNotifications = () => {
    const data = storageService.getNotifications();
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.isRead).length);
  };

  useEffect(() => {
    loadNotifications();
    // Set up a simple interval to poll for new notifications (simulating real-time)
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = (id: string) => {
    storageService.markAsRead(id);
    loadNotifications();
  };

  const handleClearAll = () => {
    storageService.clearAllNotifications();
    loadNotifications();
  };

  const handleAccept = (e: React.MouseEvent, note: AppNotification) => {
    e.stopPropagation();
    if (note.accepted) return;
    
    storageService.acceptRequest(note.requestId, note.id);
    loadNotifications(); // Refresh to show accepted state
    
    // Optional: simple alert to confirm action
    // In a real app, this might show a modal with details
    // alert(`You have accepted the request for ${note.title}`);
  };

  const handleCall = (e: React.MouseEvent) => {
     e.stopPropagation();
     window.location.href = "tel:108"; // Default emergency or specific number
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm relative">
      <div className="flex items-center gap-2">
        <div className="bg-brand-red p-2 rounded-xl text-white shadow-lg shadow-red-200">
          <Droplet size={20} fill="currentColor" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">BloodLine</h1>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            setShowNotifications(!showNotifications);
            loadNotifications();
          }}
          className="p-2 text-slate-400 hover:text-brand-red transition-colors relative"
        >
           <Bell size={20} />
           {unreadCount > 0 && (
             <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-red rounded-full border border-white flex items-center justify-center">
             </span>
           )}
        </button>
        
        <button 
          onClick={onProfileClick}
          className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-200 transition-colors"
        >
          <User size={16} className="text-slate-500" />
        </button>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
          <div className="absolute top-14 right-4 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-4 animate-fade-in origin-top-right max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                 <h3 className="font-bold text-slate-800">Notifications</h3>
                 {unreadCount > 0 && <span className="bg-brand-red text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
              </div>
              <div className="flex gap-2">
                 {notifications.length > 0 && (
                   <button onClick={handleClearAll} className="text-[10px] text-slate-400 hover:text-red-500">Clear</button>
                 )}
                 <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <Bell size={24} className="mx-auto mb-2 opacity-30" />
                  No new notifications
                </div>
              ) : (
                notifications.map((note) => (
                  <div key={note.id} className={`relative p-3 rounded-xl border transition-all ${note.isRead ? 'bg-white border-slate-100' : 'bg-red-50/50 border-red-100'}`}>
                    {!note.isRead && !note.accepted && (
                       <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-red animate-pulse"></div>
                    )}
                    
                    <div className="flex gap-3 items-start">
                      <div className={`shrink-0 mt-1 p-1.5 rounded-full ${note.accepted ? 'bg-green-100 text-green-600' : note.type === 'URGENT_REQUEST' ? 'bg-red-100 text-brand-red' : 'bg-blue-100 text-blue-500'}`}>
                         {note.accepted ? <HeartHandshake size={14} /> : note.type === 'URGENT_REQUEST' ? <AlertCircle size={14} /> : <Check size={14} />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${note.isRead ? 'text-slate-700' : 'text-slate-900'}`}>{note.title}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{note.message}</p>
                        
                        {note.hospitalName && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                             <MapPin size={10} /> {note.hospitalName} • {note.distance} away
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-3">
                           <span className="text-[10px] text-slate-400">
                             {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                           {!note.isRead && !note.accepted && (
                             <button onClick={() => handleMarkRead(note.id)} className="text-[10px] font-semibold text-brand-red">
                               Mark Read
                             </button>
                           )}
                        </div>
                        
                        {/* Actions for Urgent Requests */}
                        {note.type === 'URGENT_REQUEST' && (
                           <div className="flex gap-2 mt-3 pt-2 border-t border-slate-100/50">
                              {note.accepted ? (
                                <div className="flex-1 py-1.5 bg-green-50 text-green-600 text-xs font-bold rounded-lg flex items-center justify-center gap-1 border border-green-200">
                                   <Check size={12} /> Accepted
                                </div>
                              ) : (
                                <button 
                                  onClick={(e) => handleAccept(e, note)}
                                  className="flex-1 py-1.5 bg-brand-red text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm shadow-red-200 hover:bg-brand-darkRed"
                                >
                                  <Check size={12} /> Accept
                                </button>
                              )}
                              
                              <button 
                                onClick={handleCall}
                                className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-transform hover:bg-slate-50"
                              >
                                <Phone size={12} /> Call
                              </button>
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <button 
              onClick={() => {
                notifications.forEach(n => handleMarkRead(n.id));
              }}
              className="w-full mt-4 text-xs text-slate-500 font-medium py-2 hover:bg-slate-50 rounded-lg transition-colors border-t border-slate-50"
            >
              Mark all as read
            </button>
          </div>
        </>
      )}
    </header>
  );
};