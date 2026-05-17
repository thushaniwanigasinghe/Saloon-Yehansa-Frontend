import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bell, Sparkles, CheckCircle, Clock, XCircle, ChevronLeft } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchNotifications = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [appRes, profileRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/appointments/myappointments`, config),
          axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/auth/profile`, config)
        ]);

        const allAppsNotifs = appRes.data.map(app => {
          let actionText = 'updated';
          let statusColor = 'text-gray-500';
          let iconClass = 'bg-gray-500/10 text-gray-500';
          let icon = <Clock size={20} />;
          
          if (app.status === 'approved') { 
            actionText = 'approved'; statusColor = 'text-green-500'; iconClass = 'bg-green-500/10 text-green-500'; icon = <CheckCircle size={20} />; 
          }
          else if (app.status === 'pending') { 
            actionText = 'placed and is pending approval'; statusColor = 'text-yellow-500'; iconClass = 'bg-yellow-500/10 text-yellow-500'; icon = <Clock size={20} />; 
          }
          else if (app.status === 'cancelled') { 
            actionText = 'cancelled'; statusColor = 'text-red-500'; iconClass = 'bg-red-500/10 text-red-500'; icon = <XCircle size={20} />; 
          }
          else if (app.status === 'completed') { 
            actionText = 'completed'; statusColor = 'text-blue-500'; iconClass = 'bg-blue-500/10 text-blue-500'; icon = <CheckCircle size={20} />; 
          }
          
          return {
            _id: `app-${app._id}-${app.status}`,
            type: 'appointment',
            icon: icon,
            iconClass: iconClass,
            title: 'Booking Update',
            message: `Your booking for <span class="font-bold text-stone-900 dark:text-white">${app.serviceId?.name || "a service"}</span> on ${new Date(app.date).toLocaleDateString()} at ${app.time} has been <span class="${statusColor} font-bold">${actionText}</span>.`,
            updatedAt: app.updatedAt
          };
        });

        const systemNotifs = (profileRes.data.systemNotifications || []).map(notif => ({
          _id: notif._id,
          type: notif.type,
          icon: <Sparkles size={20} />,
          iconClass: 'bg-yellow-500/20 text-yellow-500',
          title: 'Reward Alert',
          message: notif.message,
          updatedAt: notif.createdAt
        }));

        const combined = [...allAppsNotifs, ...systemNotifs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setNotifications(combined);
        
        // Update last seen to now
        localStorage.setItem("lastSeenNotifications", Date.now());
        
      } catch (error) {
        console.error('Error fetching notifications', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate, user?.token]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-stone-50 dark:bg-neutral-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-sm font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 dark:hover:text-white mb-8 transition-colors">
          <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
        </button>
        
        <div className="mb-10">
          <h1 className="text-3xl font-light text-stone-900 dark:text-white tracking-widest uppercase">My <span className="font-serif italic text-yellow-500 lowercase">Notifications</span></h1>
          <p className="text-stone-600 dark:text-gray-400 mt-2">All your booking updates and rewards in one place.</p>
        </div>

        <div className="bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 shadow-xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          {loading ? (
             <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20">
              <Bell size={48} className="mx-auto mb-4 opacity-20 text-stone-900 dark:text-white" />
              <p className="text-stone-600 dark:text-gray-400 text-lg">You have no notifications yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif._id} className="p-6 bg-stone-50 dark:bg-neutral-900/50 border border-stone-200 dark:border-white/5 rounded-2xl flex flex-col sm:flex-row gap-5 hover:border-yellow-500/30 transition-colors group">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${notif.iconClass} group-hover:scale-110 transition-transform duration-300`}>
                      {notif.icon}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 dark:text-white">{notif.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{new Date(notif.updatedAt).toLocaleString()}</span>
                    </div>
                    <p 
                      className="text-stone-600 dark:text-gray-300 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: notif.message }}
                    ></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
