import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Scissors, Plus, Trash2, Check, X, Star, Image as ImageIcon, MessageSquare, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('appointments'); // appointments, services, media, feedback, users
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Service Form State
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({ id: null, name: '', description: '', price: '', duration: '', category: '', availability: { daysOff: [0], startTime: '09:00', endTime: '20:00', isCustom: false } });

  // Media Management State
  const [selectedMediaService, setSelectedMediaService] = useState(null);
  const [mediaUrls, setMediaUrls] = useState('');

  const navigate = useNavigate();
  const userStr = localStorage.getItem('userInfo');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    // eslint-disable-next-line react-hooks/immutability
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [appRes, servRes, userRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/appointments`, config),
        axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/services`),
        axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/users`, config)
      ]);
      setAppointments(appRes.data);
      setServices(servRes.data);
      setUsers(userRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Appointments Management ---
  const updateAppointmentStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_FRONTEND_URL}/api/appointments/${id}`, { status }, config);
      setAppointments(appointments.map(app => app._id === id ? { ...app, status } : app));
    } catch (error) {
      console.error('Error updating appointment', error);
    }
  };

  // --- Services Management ---
  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (serviceForm.id) {
        const { data } = await axios.put(`${import.meta.env.VITE_FRONTEND_URL}/api/services/${serviceForm.id}`, serviceForm, config);
        setServices(services.map(s => s._id === data._id ? data : s));
      } else {
        const { data } = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/services`, serviceForm, config);
        setServices([...services, data]);
      }
      setShowServiceForm(false);
      setServiceForm({ id: null, name: '', description: '', price: '', duration: '', category: '', availability: { daysOff: [0], startTime: '09:00', endTime: '20:00', isCustom: false } });
    } catch (error) {
      console.error('Error saving service', error);
    }
  };

  const deleteService = async (id) => {
    if (window.confirm('Delete this service entirely?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${import.meta.env.VITE_FRONTEND_URL}/api/services/${id}`, config);
        setServices(services.filter(s => s._id !== id));
      } catch (error) {
        console.error('Error deleting service', error);
      }
    }
  };

  const openEditService = (service) => {
    setServiceForm({
      id: service._id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      availability: service.availability || { daysOff: [0], startTime: '09:00', endTime: '20:00', isCustom: false }
    });
    setShowServiceForm(true);
  };

  // --- Media Management ---
  const handleSaveMedia = async (e) => {
    e.preventDefault();
    if (!selectedMediaService) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const updatedPhotos = mediaUrls.split('\n').map(url => url.trim()).filter(url => url !== '');
      const { data } = await axios.put(`${import.meta.env.VITE_FRONTEND_URL}/api/services/${selectedMediaService._id}`, { workPhotos: updatedPhotos }, config);
      setServices(services.map(s => s._id === data._id ? data : s));
      setSelectedMediaService(data);
    } catch (error) {
      console.error('Error saving media', error);
    }
  };

  const openMediaManager = (service) => {
    setSelectedMediaService(service);
    setMediaUrls(service.workPhotos ? service.workPhotos.join('\n') : '');
  };

  // --- Feedback Management ---
  const deleteReview = async (serviceId, reviewId) => {
    if (window.confirm('Delete this review?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${import.meta.env.VITE_FRONTEND_URL}/api/services/${serviceId}/reviews/${reviewId}`, config);
        fetchData(); // Refresh all
      } catch (error) {
        console.error('Error deleting review', error);
      }
    }
  };

  const allReviews = services.flatMap(service => 
    (service.reviews || []).map(review => ({
      ...review,
      serviceName: service.name,
      serviceId: service._id
    }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // --- Helpers ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'approved': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'completed': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const menuItems = [
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={18} /> },
    { id: 'services', label: 'Service Catalog', icon: <Scissors size={18} /> },
    { id: 'media', label: 'Media & Portfolio', icon: <ImageIcon size={18} /> },
    { id: 'feedback', label: 'Feedback & Ratings', icon: <MessageSquare size={18} /> },
    { id: 'users', label: 'User Directory', icon: <Users size={18} /> }
  ];

  if (loading) return <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex flex-col md:flex-row pt-16">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-neutral-900 border-r border-stone-200 dark:border-white/5 flex-shrink-0">
        <div className="p-6 border-b border-stone-200 dark:border-white/5">
          <h2 className="text-xl font-light text-stone-900 dark:text-white tracking-widest uppercase flex items-center gap-2"><LayoutDashboard size={20} className="text-yellow-500"/> Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all ${activeMenu === item.id ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-white/5'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Headers */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-stone-900 dark:text-white uppercase tracking-widest">{menuItems.find(m => m.id === activeMenu)?.label}</h1>
            <div className="w-16 h-1 bg-yellow-500 mt-4"></div>
          </div>

          {/* Module: Appointments */}
          {activeMenu === 'appointments' && (
            <div className="bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-stone-200 dark:border-white/10 rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-white/10 text-stone-600 dark:text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-medium">Client</th>
                      <th className="p-4 font-medium">Service</th>
                      <th className="p-4 font-medium">Date & Time</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {appointments.map((app) => (
                      <tr key={app._id} className="border-b border-stone-200 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="text-stone-900 dark:text-white font-medium">{app.userId?.name}</div>
                          <div className="text-gray-500 text-xs">{app.userId?.email}</div>
                        </td>
                        <td className="p-4 text-stone-600 dark:text-gray-300">{app.serviceId?.name || 'Unknown Service'}</td>
                        <td className="p-4 text-stone-600 dark:text-gray-300">
                          <div>{new Date(app.date).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{app.time}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(app.status)}`}>{app.status}</span>
                        </td>
                        <td className="p-4 flex justify-end gap-2">
                          {app.status === 'pending' && (
                            <>
                              <button onClick={() => updateAppointmentStatus(app._id, 'approved')} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-stone-900 dark:hover:text-white transition-colors" title="Approve"><Check size={16} /></button>
                              <button onClick={() => updateAppointmentStatus(app._id, 'cancelled')} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-stone-900 dark:hover:text-white transition-colors" title="Cancel"><X size={16} /></button>
                            </>
                          )}
                          {app.status === 'approved' && (
                            <button onClick={() => updateAppointmentStatus(app._id, 'completed')} className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-stone-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">Complete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module: Services Catalog */}
          {activeMenu === 'services' && (
            <div>
              <div className="mb-6 flex justify-end">
                <button onClick={() => { setServiceForm({ id: null, name: '', description: '', price: '', duration: '', category: '', availability: { daysOff: [0], startTime: '09:00', endTime: '20:00', isCustom: false } }); setShowServiceForm(true); }} className="bg-yellow-500 text-black px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-lg shadow-yellow-500/20">
                  <Plus size={16}/> Add New Service
                </button>
              </div>

              {showServiceForm && (
                <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 p-6 rounded-2xl mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-light text-stone-900 dark:text-white">{serviceForm.id ? 'Edit Service' : 'Add New Service'}</h3>
                    <button onClick={() => setShowServiceForm(false)} className="text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleSaveService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Service Name" required value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-3 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500" />
                    <input type="text" placeholder="Category" required value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} className="bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-3 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500" />
                    <input type="number" placeholder="Duration (mins)" required value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} className="bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-3 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500" />
                    <textarea placeholder="Detailed Description" rows="3" required className="md:col-span-2 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-3 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500 resize-none" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})}></textarea>
                    
                    <div className="md:col-span-2 mt-2 p-4 border border-stone-200 dark:border-white/10 rounded-xl bg-stone-50/50 dark:bg-neutral-950/50">
                      <h4 className="text-sm font-medium text-stone-900 dark:text-white mb-4 uppercase tracking-widest">Availability Rules</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-600 dark:text-gray-400 uppercase tracking-widest mb-1.5">Start Time</label>
                          <input type="time" value={serviceForm.availability?.startTime || '09:00'} onChange={e => setServiceForm({...serviceForm, availability: {...(serviceForm.availability || {}), startTime: e.target.value}})} className="w-full bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-600 dark:text-gray-400 uppercase tracking-widest mb-1.5">End Time</label>
                          <input type="time" value={serviceForm.availability?.endTime || '20:00'} onChange={e => setServiceForm({...serviceForm, availability: {...(serviceForm.availability || {}), endTime: e.target.value}})} className="w-full bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500 text-sm" />
                        </div>
                        <div className="md:col-span-2 mt-2">
                          <label className="flex items-center gap-3 text-sm text-stone-900 dark:text-white cursor-pointer select-none">
                            <input type="checkbox" checked={serviceForm.availability?.daysOff?.includes(0) ?? true} onChange={(e) => {
                              const currentDaysOff = serviceForm.availability?.daysOff || [];
                              const newDaysOff = e.target.checked ? [...currentDaysOff, 0] : currentDaysOff.filter(d => d !== 0);
                              setServiceForm({...serviceForm, availability: {...(serviceForm.availability || {}), daysOff: newDaysOff}});
                            }} className="accent-yellow-500 w-4 h-4" />
                            <span>Unavailable on Sundays</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end mt-4">
                      <button type="submit" className="bg-yellow-500 text-black px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-yellow-400 transition-colors">Save Service Settings</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                  <div key={service._id} className="bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-stone-200 dark:border-white/5 hover:border-neutral-900/20 dark:hover:border-white/20 rounded-2xl p-6 transition-colors flex flex-col group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">{service.category}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditService(service)} className="text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white" title="Edit"><Scissors size={16} /></button>
                        <button onClick={() => deleteService(service._id)} className="text-red-400 hover:text-red-500" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <h3 className="text-xl font-medium text-stone-900 dark:text-white mb-2">{service.name}</h3>
                    <p className="text-sm text-stone-600 dark:text-gray-400 line-clamp-2 mb-6 flex-1">{service.description}</p>
                    <div className="flex justify-end items-center text-sm font-medium border-t border-stone-200 dark:border-white/10 pt-4">
                      <span className="text-gray-500">{service.duration} mins</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module: Media Content */}
          {activeMenu === 'media' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-stone-200 dark:border-white/10 rounded-2xl p-4 h-[calc(100vh-200px)] overflow-y-auto">
                <h3 className="text-stone-900 dark:text-white font-medium mb-4 uppercase tracking-widest text-sm px-2">Select Service</h3>
                <div className="space-y-2">
                  {services.map(service => (
                    <button
                      key={service._id}
                      onClick={() => openMediaManager(service)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${selectedMediaService?._id === service._id ? 'bg-yellow-500 text-black font-medium' : 'text-stone-600 dark:text-gray-400 hover:bg-stone-100 dark:hover:bg-white/10 hover:text-stone-900 dark:hover:text-white'}`}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-2">
                {selectedMediaService ? (
                  <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-2xl p-6">
                    <h3 className="text-2xl font-light text-stone-900 dark:text-white mb-2">{selectedMediaService.name} - Media</h3>
                    <p className="text-stone-600 dark:text-gray-400 text-sm mb-6">Manage the portfolio images displayed to customers for this service.</p>
                    
                    <form onSubmit={handleSaveMedia} className="mb-8">
                      <label className="block text-xs font-medium text-stone-600 dark:text-gray-400 uppercase tracking-widest mb-2">Image URLs (One per line)</label>
                      <textarea 
                        rows="6" 
                        placeholder="https://example.com/image1.jpg"
                        className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-3 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500 resize-none font-mono text-sm mb-4" 
                        value={mediaUrls} 
                        onChange={e => setMediaUrls(e.target.value)}
                      ></textarea>
                      <button type="submit" className="bg-yellow-500 text-black px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-yellow-400 transition-colors">
                        Update Media Links
                      </button>
                    </form>

                    <div>
                      <h4 className="text-stone-900 dark:text-white font-medium mb-4 uppercase tracking-widest text-xs">Current Portfolio Preview</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {selectedMediaService.workPhotos && selectedMediaService.workPhotos.length > 0 ? (
                          selectedMediaService.workPhotos.map((url, i) => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-stone-200 dark:border-white/10">
                              <img src={url} alt={`Portfolio ${i}`} className="w-full h-full object-cover" />
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-8 text-center text-gray-500 border border-dashed border-stone-300 dark:border-white/20 rounded-xl">
                            No media uploaded for this service.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-stone-200 dark:border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full">
                    <ImageIcon size={48} className="text-gray-600 mb-4" />
                    <p className="text-stone-600 dark:text-gray-400 text-lg">Select a service from the list to manage its media content.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module: Feedback & Ratings */}
          {activeMenu === 'feedback' && (
            <div className="bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-stone-200 dark:border-white/10 rounded-2xl p-6">
              <div className="mb-6 flex justify-between items-end border-b border-stone-200 dark:border-white/10 pb-6">
                <div>
                  <h2 className="text-xl font-medium text-stone-900 dark:text-white">Global Feedback Hub</h2>
                  <p className="text-sm text-stone-600 dark:text-gray-400 mt-1">Review and moderate all customer ratings and feedback across your services.</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-light text-yellow-500">{allReviews.length}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Reviews</div>
                </div>
              </div>

              <div className="space-y-4">
                {allReviews.length > 0 ? (
                  allReviews.map((review) => (
                    <div key={review._id} className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/5 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-stone-300 dark:hover:border-white/10 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-stone-900 dark:text-white font-medium text-lg">{review.name}</span>
                          <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded text-[10px] uppercase tracking-widest font-bold border border-yellow-500/20">{review.serviceName}</span>
                        </div>
                        <div className="flex text-yellow-500 mb-3">
                          {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-600"} />)}
                        </div>
                        <p className="text-stone-600 dark:text-gray-300 font-light italic leading-relaxed">"{review.comment}"</p>
                        <p className="text-xs text-gray-500 mt-4">{new Date(review.createdAt).toLocaleString()}</p>
                      </div>
                      
                      <button onClick={() => deleteReview(review.serviceId, review._id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-stone-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex-shrink-0">
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-gray-500 border border-dashed border-stone-200 dark:border-white/10 rounded-xl">
                    <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                    No customer feedback received yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module: User Directory */}
          {activeMenu === 'users' && (
            <div className="bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-stone-200 dark:border-white/10 rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-white/10 text-stone-600 dark:text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-stone-200 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 text-stone-900 dark:text-white font-medium">{u.name}</td>
                        <td className="p-4 text-stone-600 dark:text-gray-400">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${u.role === 'admin' ? 'text-purple-500 border-purple-500/50 bg-purple-500/10' : 'text-blue-500 border-blue-500/50 bg-blue-500/10'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
