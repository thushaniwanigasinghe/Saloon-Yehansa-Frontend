import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Trash2, } from 'lucide-react';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const profileRes = await axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/auth/profile`, config);
        setUserProfile(profileRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, user?.token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'approved': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'completed': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-stone-50 dark:bg-neutral-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-light text-stone-900 dark:text-white tracking-widest uppercase">My <span className="font-serif italic text-yellow-500 lowercase">Dashboard</span></h1>
            <p className="text-stone-600 dark:text-gray-400 mt-2">Welcome back, {user?.name}</p>
          </div>
          <button onClick={() => navigate('/services')} className="bg-yellow-500 text-black px-6 py-2.5 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white dark:hover:bg-yellow-400 dark:hover:text-black transition-all shadow-lg hover:shadow-xl">
            Book Service
          </button>
        </div>

        {/* Gamification Section */}
        {userProfile && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-yellow-500"></span>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-gray-400">Salon Rewards Program</h2>
              <span className="flex-1 h-px bg-stone-200 dark:bg-white/5"></span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* VIP Status Card */}
              <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-yellow-500/20"></div>
                
                <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                  <div>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.3)] mb-6 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                      <span className="text-3xl filter drop-shadow-md">👑</span>
                    </div>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 dark:text-gray-400 mb-2">Current VIP Status</h2>
                    <h3 className="text-3xl font-black uppercase tracking-widest mb-1 flex items-center">
                      <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                        userProfile.loyaltyLevel === 'Gold' ? 'from-yellow-400 to-yellow-600 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                        userProfile.loyaltyLevel === 'Silver' ? 'from-gray-400 to-gray-600 dark:from-gray-300 dark:to-gray-500 drop-shadow-[0_0_10px_rgba(148,163,184,0.3)]' :
                        'from-amber-600 to-amber-800 dark:from-amber-500 dark:to-amber-700'
                      }`}>
                        {userProfile.loyaltyLevel}
                      </span>
                    </h3>
                  </div>
                  <div className="mt-8 pt-6 border-t border-stone-100 dark:border-white/5">
                    <p className="text-stone-400 dark:text-stone-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span>
                      <span className="text-stone-900 dark:text-white text-lg">{userProfile.loyaltyPoints}</span> Points Earned
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress & Milestone Card */}
              <div className="bg-stone-900 dark:bg-black border border-stone-800 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-xl lg:col-span-2 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                    <div>
                      <h4 className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        Next Milestone Reward
                      </h4>
                      <p className="text-stone-300 text-sm font-light leading-relaxed max-w-md">
                        Complete <span className="text-white font-medium">5 services</span> to unlock a <span className="text-yellow-400 font-medium">20% discount</span> on your next visit!
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-3xl font-light text-white">{100 - (userProfile.loyaltyPoints % 100)}</span>
                      <span className="text-[9px] text-stone-500 font-bold uppercase tracking-widest block mt-1">pts to next tier</span>
                    </div>
                  </div>

                  <div className="w-full bg-black/50 dark:bg-white/5 rounded-full h-3 overflow-hidden shadow-inner p-0.5 border border-white/10">
                    <div 
                      className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full transition-all duration-1000 relative shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                      style={{ width: `${Math.max(5, Math.min((userProfile.loyaltyPoints % 100), 100))}%` }}
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-10 pt-8 border-t border-white/10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-5">Reward Gallery</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { id: 'First Visit', name: 'Starter', icon: '⭐', req: 'First Visit' },
                      { id: '20% Discount Reward', name: '20% Off', icon: '💸', req: '5 Services' },
                      { id: 'Free Hairstyle Reward', name: 'Free Cut', icon: '✂️', req: '10 Services' },
                      { id: 'Bridal Bonus', name: 'Bridal Promo', icon: '💍', req: 'Bridal Booking' }
                    ].map((reward, idx) => {
                      const isUnlocked = userProfile.badges?.includes(reward.id);
                      return isUnlocked ? (
                        <div key={idx} className="flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 group cursor-pointer backdrop-blur-sm">
                          <span className="text-2xl mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 filter drop-shadow-md">{reward.icon}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-yellow-500 text-center mb-1.5">{reward.name}</span>
                          <span className="text-[7px] uppercase text-stone-300 font-medium tracking-wider px-2 py-0.5 bg-white/10 rounded-full">Unlocked</span>
                        </div>
                      ) : (
                        <div key={idx} className="flex flex-col items-center justify-center bg-white/5 p-5 rounded-2xl border border-dashed border-white/10 opacity-50 relative group overflow-hidden">
                          <span className="text-2xl mb-3 grayscale opacity-40 group-hover:opacity-10 transition-opacity">{reward.icon}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500 text-center group-hover:opacity-0 transition-opacity">{reward.name}</span>
                          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                            <span className="text-sm mb-1">🔒</span>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-stone-300 text-center px-2">{reward.req}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-stone-200 dark:border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-500 cursor-pointer" onClick={() => navigate('/my-bookings')}>
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-yellow-500/20 transition-colors duration-500"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-stone-50 dark:bg-black/50 flex items-center justify-center border border-stone-200 dark:border-white/10 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Calendar size={28} className="text-yellow-500" />
              </div>
              <div>
                <h2 className="text-2xl font-light text-stone-900 dark:text-white mb-2">My Bookings</h2>
                <p className="text-stone-500 dark:text-gray-400 text-sm">View, manage, or cancel your upcoming and past appointments.</p>
              </div>
            </div>
            
            <button className="px-8 py-3 rounded-full border border-stone-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-stone-900 dark:text-white group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500 transition-all duration-300">
              Manage Bookings ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
