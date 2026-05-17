import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Trash2, ArrowLeft } from 'lucide-react';

const MyBookings = () => {
  const [appointments, setAppointments] = useState([]);
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

    const fetchAppointments = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/appointments/myappointments`, config);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate, user?.token]);

  const cancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`${import.meta.env.VITE_FRONTEND_URL}/api/appointments/${id}`, { status: 'cancelled' }, config);
        
        // Update local state
        setAppointments(appointments.map(app => app._id === id ? { ...app, status: 'cancelled' } : app));
      } catch (error) {
        console.error('Error cancelling appointment', error);
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-stone-50 dark:bg-neutral-950 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-light text-stone-900 dark:text-white tracking-widest uppercase">
                My <span className="font-serif italic text-yellow-500 lowercase">Bookings</span>
              </h1>
              <p className="text-stone-600 dark:text-gray-400 mt-2">Manage all your upcoming and past appointments</p>
            </div>
            <button onClick={() => navigate('/services')} className="bg-yellow-500 text-black px-6 py-2.5 rounded-full font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white dark:hover:bg-yellow-400 dark:hover:text-black transition-all shadow-lg hover:shadow-xl">
              Book New Service
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[80px] -mr-10 -mt-10 rounded-full pointer-events-none"></div>

          {loading ? (
             <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div></div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-20 relative z-10">
              <Calendar size={48} strokeWidth={1} className="mx-auto text-stone-300 dark:text-stone-700 mb-6" />
              <p className="text-stone-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">You have no appointments yet. Your bookings history will appear here once you schedule a service.</p>
              <button onClick={() => navigate('/services')} className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-yellow-500 dark:hover:text-black transition-all shadow-lg hover:shadow-xl">
                Explore Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {appointments.map((app) => (
                <div key={app._id} className="bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-yellow-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                  
                  {/* Subtle Glow based on status */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none transition-all duration-500 group-hover:opacity-40 ${
                    app.status === 'approved' ? 'bg-green-500' :
                    app.status === 'pending' ? 'bg-yellow-500' :
                    app.status === 'cancelled' ? 'bg-red-500' :
                    app.status === 'completed' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}></div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-1">
                        {app.serviceId?.name || 'Service Removed'}
                      </h3>
                      <p className="text-[10px] text-stone-500 dark:text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          app.status === 'approved' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' :
                          app.status === 'pending' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-pulse' :
                          app.status === 'cancelled' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' :
                          app.status === 'completed' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-gray-500'
                        }`}></span>
                        {app.status}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-white/5 rounded-2xl p-4 mb-6 border border-stone-100 dark:border-white/5 relative z-10">
                    <div className="flex items-center text-stone-700 dark:text-gray-300 text-sm mb-3 font-medium">
                      <div className="w-8 h-8 rounded-full bg-stone-50 dark:bg-black/50 flex items-center justify-center mr-3 border border-stone-200 dark:border-white/10 shadow-sm">
                        <Calendar size={14} className="text-yellow-500" />
                      </div>
                      {new Date(app.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center text-stone-700 dark:text-gray-300 text-sm font-medium">
                      <div className="w-8 h-8 rounded-full bg-stone-50 dark:bg-black/50 flex items-center justify-center mr-3 border border-stone-200 dark:border-white/10 shadow-sm">
                        <Clock size={14} className="text-yellow-500" />
                      </div>
                      {app.time}
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    {app.status === 'pending' || app.status === 'approved' ? (
                      <button 
                        onClick={() => cancelAppointment(app._id)}
                        className="w-full group/btn flex items-center justify-center gap-2 py-3 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-gray-400 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-widest"
                      >
                        <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" /> Cancel Appointment
                      </button>
                    ) : (
                      <div className={`w-full py-3 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest border ${
                        app.status === 'completed' ? 'border-blue-500/20 bg-blue-500/5 text-blue-500' :
                        app.status === 'cancelled' ? 'border-red-500/20 bg-red-500/5 text-red-500' :
                        'border-stone-200 dark:border-white/5 text-gray-500 bg-stone-50 dark:bg-white/5'
                      }`}>
                        {app.status === 'completed' ? 'Service Completed' : app.status === 'cancelled' ? 'Booking Cancelled' : app.status}
                      </div>
                    )}
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

export default MyBookings;
