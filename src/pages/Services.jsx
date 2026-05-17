import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Clock, X, Star,  MessageSquare, ChevronRight, Search } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Booking State
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
 


  // Viewing State (Details, Photos, Reviews)
  const [viewingService, setViewingService] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // details, photos, reviews
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/services`);
      setServices(data);
    } catch (error) {
      console.error('Error fetching services', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (service, e) => {
    if (e) e.stopPropagation();
    if (!user) {
      navigate('/login');
    } else {
      setViewingService(null);
      setSelectedService(service);
      setBookingSuccess(false);
      setBookingError('');
    }
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/appointments`, {
        serviceId: selectedService._id,
        date: bookingDate,
        endDate: bookingEndDate,
        time: bookingTime,
        notes
      }, config);
      
      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedService(null);
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setBookingError(error.response?.data?.message || error.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    try {
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` }
      };
      
      await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/services/${viewingService._id}/reviews`, {
        rating,
        comment
      }, config);
      
      const { data } = await axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/services/${viewingService._id}`);
      setViewingService(data);
      fetchServices(); // Refresh main list
      
      setComment('');
      setRating(5);
    } catch (error) {
      setReviewError(error.response?.data?.message || error.message);
    } finally {
      setReviewLoading(false);
    }
  };



  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (service.category && service.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-20 bg-stone-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h4 className="text-yellow-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">Official Menu</h4>
          <h1 className="text-3xl md:text-5xl font-light text-stone-900 dark:text-white mb-6 tracking-widest uppercase">
  Service{" "}
  <span className="font-serif italic text-black dark:text-white/50 lowercase">
    Directory
  </span>
</h1>
          <div className="w-24 h-[1px] bg-yellow-500 mx-auto mb-6"></div>
          <p className="text-stone-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">A curated selection of our most distinguished treatments, designed to provide an unparalleled experience. Click on any service for details, reviews, and portfolio.</p>
          
          <div className="max-w-xl mx-auto relative group">
            <input 
              type="text" 
              placeholder="Search for a service, category, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-stone-200 dark:border-white/10 rounded-full py-4 pl-14 pr-6 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500 focus:bg-neutral-900/10 dark:focus:bg-white/10 transition-all font-light"
            />
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
          </div>


        </div>

        {loading ? (
          <div className="flex justify-center"><div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-stone-200 dark:border-white/10 rounded-3xl">
            <Search className="mx-auto text-gray-500 mb-4 opacity-50" size={40} />
            <h3 className="text-stone-900 dark:text-white text-xl font-light tracking-wide mb-2">No services found</h3>
            <p className="text-stone-600 dark:text-gray-400 font-light">We couldn't find anything matching "{searchQuery}". Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(
              filteredServices.reduce((acc, service) => {
                const cat = service.category || 'Other';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(service);
                return acc;
              }, {})
            ).map(([category, categoryServices]) => (
              <div key={category}>
                <div className="flex items-center gap-6 mb-10">
                  <h2 className="text-xl md:text-2xl font-light text-stone-900 dark:text-white tracking-widest uppercase">{category}</h2>
                  <div className="flex-1 h-[1px] bg-stone-100 dark:bg-white/10"></div>
                </div>
                

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.map((service) => (
                    <div 
                      key={service._id} 
                      onClick={() => { setViewingService(service); setActiveTab('details'); }}
                      className="group flex flex-col h-full justify-between p-8 rounded-2xl bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none border border-stone-200 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/[0.04] hover:border-yellow-500 dark:hover:border-yellow-500 hover:shadow-[0_10px_30px_rgba(234,179,8,0.15)] dark:hover:shadow-[0_0_25px_rgba(234,179,8,0.25)] hover:-translate-y-2 cursor-pointer transition-all duration-500"
                    >
                      <div className="mb-6 flex-grow">
                        <div className="flex flex-col mb-4">
                          <h3 className="text-xl font-light text-stone-900 dark:text-white tracking-wide group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors mb-2">{service.name}</h3>
                          <div className="flex items-center gap-0.5 text-yellow-500 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < Math.round(service.rating || 0) ? "currentColor" : "none"} className={i < Math.round(service.rating || 0) ? "" : "text-gray-600"} />
                            ))}
                            <span className="text-xs text-gray-500 ml-2">({service.numReviews} Reviews)</span>
                          </div>
                        </div>
                        <p className="text-stone-600 dark:text-gray-400 text-sm font-light leading-relaxed line-clamp-3">{service.description}</p>
                      </div>
                      
                      <div className="flex flex-row flex-wrap items-center justify-between border-t border-stone-200 dark:border-white/10 pt-6 mt-auto gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest">
                          <Clock size={14} className="text-yellow-500" />
                          <span>{service.duration} mins</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {['Designer Sari Rental', 'Party Frock Rental', 'Bridal Lehenga Rental'].includes(service.name) && (
                            <a 
                              href="https://www.facebook.com/sa.nethuki.yehansha" 
                              target="_blank" 
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-4 py-2.5 bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#1877F2] hover:text-stone-900 dark:hover:text-white transition-all duration-300 flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                              Photos
                            </a>
                          )}
                          <button
                            onClick={(e) => handleBookClick(service, e)}
                            className="px-5 py-2.5 border border-stone-300 dark:border-white/20 rounded-lg text-stone-900 dark:text-white text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-yellow-500 dark:hover:text-black hover:border-black dark:hover:border-yellow-500 hover:scale-105 hover:shadow-lg hover:shadow-black/20 dark:hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all duration-300 flex items-center gap-2"
                          >
                            Book <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Viewing Details Modal */}
      {viewingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-50/90 dark:bg-black/90 backdrop-blur-md">
          <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden shadow-2xl">
            <button onClick={() => setViewingService(null)} className="absolute top-6 right-6 text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white z-10 bg-neutral-900/50 rounded-full p-2">
              <X size={24} />
            </button>
            
            {/* Header */}
            <div className="p-8 border-b border-stone-200 dark:border-white/5 bg-white dark:bg-neutral-900">
              <h2 className="text-2xl md:text-3xl font-light text-stone-900 dark:text-white mb-2">{viewingService.name}</h2>
              <div className="flex items-center gap-6 text-sm text-stone-600 dark:text-gray-400">
                <div className="flex items-center gap-1"><Clock size={14} /> {viewingService.duration} mins</div>
                <div className="flex items-center gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(viewingService.rating || 0) ? "currentColor" : "none"} className={i < Math.round(viewingService.rating || 0) ? "" : "text-gray-600"} />
                  ))}
                  <span className="ml-2 text-stone-600 dark:text-gray-400">({viewingService.numReviews} Reviews)</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-200 dark:border-white/5 bg-stone-50 dark:bg-neutral-950 px-8">
              {['details', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm tracking-widest uppercase font-medium border-b-2 transition-colors ${
                    activeTab === tab ? 'border-black text-black dark:border-yellow-500 dark:text-yellow-500' : 'border-transparent text-stone-500 hover:text-black dark:text-gray-500 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {tab === 'reviews' && <MessageSquare size={16} />}
                    {tab}
                  </div>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <h3 className="text-lg md:text-xl font-light text-stone-900 dark:text-white">About this Service</h3>
                  <p className="text-stone-600 dark:text-gray-400 leading-relaxed font-light text-base md:text-lg">{viewingService.description}</p>
                  
                  <div className="mt-12 p-6 bg-white dark:bg-white/5 shadow-sm dark:shadow-none border border-stone-200 dark:border-white/5 rounded-xl text-center">
                    <p className="text-stone-600 dark:text-gray-300 mb-6 font-light">Ready to experience this service?</p>
                    <button
                      onClick={() => handleBookClick(viewingService)}
                      className="px-10 py-3 bg-yellow-500 text-black text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-yellow-400 transition-colors rounded-xl"
                    >
                      Book Appointment Now
                    </button>
                  </div>
                </div>
              )}



              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  <h3 className="text-lg md:text-xl font-light text-stone-900 dark:text-white mb-6">Client Feedback</h3>
                  
                  {user ? (
                    <form onSubmit={submitReview} className="bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none border border-stone-200 dark:border-white/5 p-6 rounded-xl space-y-4">
                      <h4 className="text-stone-900 dark:text-white text-sm uppercase tracking-widest mb-4">Leave a Review</h4>
                      {reviewError && <div className="text-red-500 text-sm">{reviewError}</div>}
                      
                      <div className="flex items-center gap-2 mb-6">
                        <label className="text-stone-600 dark:text-gray-400 text-sm mr-2">Your Rating:</label>
                        <div className="flex text-yellow-500 gap-1 cursor-pointer">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={22} 
                              onClick={() => setRating(star)}
                              fill={star <= rating ? "currentColor" : "none"} 
                              className={`transition-all hover:scale-110 ${star <= rating ? "drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" : "text-gray-600 hover:text-black dark:hover:text-yellow-500/50"}`} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience..."
                        required
                        rows="3"
                        className="w-full bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-3 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500 resize-none"
                      />
                      <button 
                        type="submit" 
                        disabled={reviewLoading}
                        className="px-6 py-2 bg-yellow-500 text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 dark:hover:bg-yellow-400 disabled:opacity-50"
                      >
                        {reviewLoading ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-500 text-sm">
                      Please <button onClick={() => navigate('/login')} className="font-bold underline">log in</button> to leave a review.
                    </div>
                  )}

                  <div className="space-y-6 mt-8">
                    {viewingService.reviews && viewingService.reviews.length > 0 ? (
                      viewingService.reviews.map((review) => (
                        <div key={review._id} className="border-b border-stone-200 dark:border-white/5 pb-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-stone-900 dark:text-white font-medium block">{review.name}</span>
                              <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-600"} />
                              ))}
                            </div>
                          </div>
                          <p className="text-stone-600 dark:text-gray-400 font-light mt-2 text-sm">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No reviews yet for this service.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl">
            <button onClick={() => setSelectedService(null)} className="absolute top-6 right-6 text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <h2 className="text-xl md:text-2xl font-light text-stone-900 dark:text-white mb-1">Book Appointment</h2>
            <div className="mb-6 border-b border-stone-200 dark:border-white/10 pb-4">
              <p className="text-stone-600 dark:text-gray-400 text-sm">{selectedService.name}</p>
            </div>
            
            {bookingSuccess ? (
              <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-xl text-center">
                Booking successful! Redirecting to dashboard...
              </div>
            ) : (
              <form onSubmit={submitBooking} className="space-y-5">
                {bookingError && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">{bookingError}</div>}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-gray-400 uppercase tracking-widest mb-1.5">Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-black/20 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                      style={{ colorScheme: 'dark' }}
                      value={bookingDate}
                      onChange={(e) => {
                        const dateStr = e.target.value;
                        if (!dateStr) {
                          setBookingDate('');
                          return;
                        }
                        const [year, month, day] = dateStr.split('-');
                        const selectedDate = new Date(year, month - 1, day);
                        const isCustom = selectedService.availability?.isCustom;
                        const daysOff = isCustom ? (selectedService.availability?.daysOff || []) : [0];
                        if (daysOff.includes(selectedDate.getDay()) && selectedDate.getDay() === 0) {
                          setBookingError('Sunday bookings are currently closed. Please choose another day (for example, come on Monday instead).');
                          setBookingDate('');
                        } else if (daysOff.includes(selectedDate.getDay())) {
                          setBookingError('This service is not available on the selected day.');
                          setBookingDate('');
                        } else {
                          setBookingError('');
                          setBookingDate(dateStr);
                        }
                      }}
                    />
                  </div>
                  
                  {selectedService && (selectedService.category === 'Rentals' || selectedService.name.toLowerCase().includes('rental')) ? (
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 dark:text-gray-400 uppercase tracking-widest mb-1.5">Return Date</label>
                      <input
                        type="date"
                        required
                        min={bookingDate || new Date().toISOString().split('T')[0]}
                        className="w-full bg-black/20 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                        style={{ colorScheme: 'dark' }}
                        value={bookingEndDate}
                        onChange={(e) => {
                          const dateStr = e.target.value;
                          if (!dateStr) {
                            setBookingEndDate('');
                            return;
                          }
                          const [year, month, day] = dateStr.split('-');
                          const selectedDate = new Date(year, month - 1, day);
                          const isCustom = selectedService.availability?.isCustom;
                          const daysOff = isCustom ? (selectedService.availability?.daysOff || []) : [0];
                          if (daysOff.includes(selectedDate.getDay()) && selectedDate.getDay() === 0) {
                            setBookingError('Sunday returns are currently closed. Please choose another return date.');
                            setBookingEndDate('');
                          } else {
                            setBookingError('');
                            setBookingEndDate(dateStr);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 dark:text-gray-400 uppercase tracking-widest mb-1.5">Time</label>
                      <input
                        type="time"
                        required
                        className="w-full bg-black/20 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                        style={{ colorScheme: 'dark' }}
                        value={bookingTime}
                        onChange={(e) => {
                          setBookingError('');
                          setBookingTime(e.target.value);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Rental Pricing Logic */}
                {(() => {
                  const isRental = selectedService && (selectedService.category === 'Rentals' || selectedService.name.toLowerCase().includes('rental'));
                  if (isRental && bookingDate && bookingEndDate) {
                    const start = new Date(bookingDate.split('-')[0], bookingDate.split('-')[1] - 1, bookingDate.split('-')[2]);
                    const end = new Date(bookingEndDate.split('-')[0], bookingEndDate.split('-')[1] - 1, bookingEndDate.split('-')[2]);
                    const diffTime = end - start;
                    const rentalDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // 15th to 15th = 1 day
                    
                    const ALLOWED_RENTAL_DAYS = 2;

                    return (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl mt-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-stone-600 dark:text-gray-400 uppercase tracking-widest font-bold">Rental Duration</span>
                          <span className="text-sm font-bold text-stone-900 dark:text-white">{rentalDuration} Days</span>
                        </div>
                        {rentalDuration > ALLOWED_RENTAL_DAYS && (
                          <div className="mt-2 pt-2 border-t border-yellow-500/20">
                            <p className="text-xs font-bold text-red-500">Warning: Your rental exceeds the standard {ALLOWED_RENTAL_DAYS}-day limit. Extra charges will be applied.</p>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}
                
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 dark:text-gray-400 uppercase tracking-widest mb-1.5">Special Requests</label>
                  <textarea
                    rows="1"
                    className="w-full bg-black/20 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-stone-900 dark:text-white focus:outline-none focus:border-yellow-500 resize-none text-sm transition-colors"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific instructions..."
                  ></textarea>
                </div>
                
                <button type="submit" className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-yellow-400 transition-all duration-300 mt-2 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40">
                  Request Booking
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
