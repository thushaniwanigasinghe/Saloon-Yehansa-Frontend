import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {  Bell,  Menu, X, Sun, Moon, Sparkles } from "lucide-react";
import axios from "axios";
import logoImage from "../assets/logo.jpg";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const userStr = localStorage.getItem("userInfo");
  const user = userStr ? JSON.parse(userStr) : null;

  const isActive = (path) => location.pathname === path;

  const getLinkClass = (path) => {
    return `relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 rounded-full flex items-center gap-1.5 ${
      isActive(path)
        ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.05)]'
        : 'text-stone-500 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 border border-transparent'
    }`;
  };

  const ActiveIndicator = () => null; // Replaced by pill shape background

  const getMobileLinkClass = (path) => {
    return `block px-4 py-4 rounded-xl text-lg font-medium border transition-all ${
      isActive(path)
        ? 'bg-yellow-500 text-black border-transparent dark:text-yellow-500 dark:bg-yellow-500/10 dark:border-yellow-500/20'
        : 'text-stone-600 dark:text-gray-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-white/5 border-transparent hover:border-stone-300 dark:hover:border-white/10'
    }`;
  };

  const [hasNotifications, setHasNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastSeen, setLastSeen] = useState(
    Number(localStorage.getItem("lastSeenNotifications") || 0),
  );
  const [openedWithLastSeen, setOpenedWithLastSeen] = useState(lastSeen);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Close menus on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location]);

  useEffect(() => {
    if (user && user.role !== "admin") {
      const checkNotifications = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const [appRes, profileRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/appointments/myappointments`, config),
            axios.get(`${import.meta.env.VITE_FRONTEND_URL}/api/auth/profile`, config)
          ]);

          const allAppsNotifs = appRes.data.map(app => {
            let actionText = '';
            let statusColor = '';
            
            if (app.status === 'approved') { actionText = 'approved'; statusColor = 'text-green-400'; }
            else if (app.status === 'pending') { actionText = 'placed and is pending approval'; statusColor = 'text-yellow-500'; }
            else if (app.status === 'cancelled') { actionText = 'cancelled'; statusColor = 'text-red-500'; }
            else if (app.status === 'completed') { actionText = 'completed'; statusColor = 'text-blue-500'; }

            return {
              _id: `app-${app._id}-${app.status}`,
              type: 'appointment',
              message: `Your booking for <span class="text-yellow-500 font-medium">${app.serviceId?.name || "a service"}</span> on ${new Date(app.date).toLocaleDateString()} at ${app.time} has been <span class="${statusColor} font-medium">${actionText}</span>.`,
              updatedAt: app.updatedAt
            };
          });

          const systemNotifs = (profileRes.data.systemNotifications || []).map(notif => ({
            _id: notif._id,
            type: notif.type, // 'reward'
            message: `<span class="text-yellow-500 font-medium">Reward Alert:</span> ${notif.message}`,
            updatedAt: notif.createdAt
          }));

          const combined = [...allAppsNotifs, ...systemNotifs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          
          setNotifications(combined);

          const hasUnread = combined.some(
            (notif) => new Date(notif.updatedAt).getTime() > lastSeen,
          );
          setHasNotifications(hasUnread);
        } catch (error) {
          console.error("Error fetching notifications", error);
        }
      };

      checkNotifications();
      const interval = setInterval(checkNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [userStr, lastSeen]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const toggleNotifications = () => {
    if (!showDropdown) {
      setOpenedWithLastSeen(lastSeen);
      setShowDropdown(true);
      setHasNotifications(false);
    } else {
      setShowDropdown(false);
      const now = Date.now();
      localStorage.setItem("lastSeenNotifications", now);
      setLastSeen(now);
      setOpenedWithLastSeen(now);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 dark:bg-black/60 backdrop-blur-xl border-b border-stone-200 dark:border-white/5 shadow-sm dark:shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <img
                  src={logoImage}
                  alt="Logo"
                  className="h-6 w-6 object-cover rounded-xl border border-stone-200 dark:border-white/10 shadow-sm group-hover:scale-105 transition-all duration-500 relative z-10"
                />
                <div className="absolute inset-0 bg-yellow-500/20 blur-md rounded-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <span className="text-base font-light tracking-widest text-stone-900 dark:text-white uppercase transition-colors group-hover:text-yellow-600 dark:group-hover:text-yellow-400">
                Salon<span className="font-bold">Yehansa</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1 ml-auto mr-3">
            <Link to="/" className={getLinkClass('/')}>Home</Link>
            <Link to="/about" className={getLinkClass('/about')}>About</Link>
            <Link to="/gallery" className={getLinkClass('/gallery')}>Gallery</Link>
            <Link to="/services" className={getLinkClass('/services')}>Services</Link>
            <Link to="/ai-style" className={getLinkClass('/ai-style')}><Sparkles size={12} className={isActive('/ai-style') ? "text-yellow-500 animate-pulse" : "opacity-70"} /> AI Style</Link>
            <Link to="/contact" className={getLinkClass('/contact')}>Contact</Link>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 border-l border-stone-200 dark:border-white/10 pl-3">
            <button
              onClick={toggleTheme}
              className="text-stone-500 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white p-2.5 rounded-full hover:bg-stone-100 dark:hover:bg-white/5 border border-transparent hover:border-stone-200 dark:hover:border-white/10 transition-all"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <>
                <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="relative px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white bg-stone-900 dark:text-black dark:bg-white rounded-full hover:bg-yellow-500 dark:hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all duration-300 border border-transparent">
                  Dashboard
                </Link>

                  {user.role !== "admin" && (
                    <div className="relative inline-block text-left">
                      <button
                        onClick={toggleNotifications}
                        className={`relative p-2 rounded-full transition-colors flex items-center ${
                          hasNotifications
                            ? "text-red-500 hover:bg-red-500/10 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                            : showDropdown
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "text-stone-600 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-white/10 hover:text-stone-900 dark:hover:text-white"
                        }`}
                        title="Notifications"
                      >
                        <Bell size={20} />
                      </button>

                      {/* Desktop Notifications Dropdown */}
                      {showDropdown && (
                        <div className="absolute right-0 top-full mt-5 w-80 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 before:content-[''] before:absolute before:-top-2 before:right-6 before:border-8 before:border-transparent before:border-b-white dark:before:border-b-neutral-900">
                          <div className="p-4 border-b border-stone-200 dark:border-white/10 flex justify-between items-center bg-stone-50/60 dark:bg-black/60 backdrop-blur-md relative z-10">
                            <h3 className="text-stone-900 dark:text-white font-medium text-xs uppercase tracking-widest flex items-center gap-2">
                              Notifications 
                              <span className="text-[9px] bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 px-1.5 py-0.5 rounded-full font-bold">
                                {notifications.length}
                              </span>
                            </h3>
                            {notifications.length > 0 && (
                              <Link 
                                to="/notifications"
                                onClick={() => setShowDropdown(false)}
                                className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 hover:text-stone-900 dark:hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1 bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-1.5 rounded-full"
                              >
                                View All ➔
                              </Link>
                            )}
                          </div>
                          <div className="max-h-80 overflow-y-auto scrollbar-hide">
                            {notifications.length > 0 ? (
                              notifications.map((notif) => {
                                const isNew =
                                  new Date(notif.updatedAt).getTime() >
                                  openedWithLastSeen;
                                return (
                                  <div
                                    key={notif._id}
                                    onClick={() => { setSelectedNotification(notif); setShowDropdown(false); setIsMobileMenuOpen(false); }}
                                    className={`p-4 border-b border-stone-200 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors relative cursor-pointer ${isNew ? "bg-red-500/5" : ""}`}
                                  >
                                    {isNew && (
                                      <span className="absolute top-4 right-4 bg-red-500 text-stone-900 dark:text-white text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                        New
                                      </span>
                                    )}
                                    <p
                                      className={`text-sm leading-relaxed line-clamp-2 ${isNew ? "text-stone-900 dark:text-white" : "text-stone-600 dark:text-gray-300"}`}
                                      dangerouslySetInnerHTML={{ __html: notif.message }}
                                    ></p>
                                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">
                                      {new Date(
                                        notif.updatedAt,
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-8 text-center text-gray-500 text-sm">
                                <Bell
                                  size={24}
                                  className="mx-auto mb-3 opacity-20"
                                />
                                No notifications yet.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase border border-stone-200 dark:border-white/10 text-stone-600 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-900 dark:hover:text-white transition-all duration-300 ml-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all duration-300 ml-2"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="text-stone-600 dark:text-gray-300 hover:text-stone-900 dark:hover:text-white focus:outline-none p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            {user && user.role !== "admin" && hasNotifications && (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-red-500 animate-pulse relative p-2"
              >
                <Bell size={24} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-neutral-900"></span>
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-600 dark:text-gray-300 hover:text-stone-900 dark:hover:text-white focus:outline-none p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-screen opacity-100 border-b border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-neutral-950 shadow-2xl" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 py-6 space-y-2 flex flex-col max-h-[80vh] overflow-y-auto">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/')}>Home</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/about')}>About Us</Link>
          <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/gallery')}>Gallery</Link>
          <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/services')}>Services</Link>
          <Link to="/ai-style" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/ai-style')}><span className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 font-bold"><Sparkles size={18} /> AI Style Match</span></Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/contact')}>Contact</Link>

          <div className="h-px bg-stone-100 dark:bg-white/10 my-4"></div>

          {user ? (
            <>
              <Link to={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass(user.role === "admin" ? "/admin" : "/dashboard")}>Dashboard</Link>

              {user.role !== "admin" && (
                <div className="bg-white dark:bg-white/5 shadow-sm dark:shadow-none rounded-xl border border-stone-200 dark:border-white/10 overflow-hidden my-2">
                  <button
                    onClick={toggleNotifications}
                    className="w-full text-left px-4 py-4 text-lg font-medium text-stone-900 dark:text-white flex items-center justify-between"
                  >
                    <span className="flex items-center gap-3">
                      <Bell
                        size={20}
                        className={
                          hasNotifications
                            ? "text-red-500"
                            : "text-stone-600 dark:text-gray-400"
                        }
                      />{" "}
                      Notifications
                    </span>
                    {hasNotifications && (
                      <span className="bg-red-500 text-stone-900 dark:text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold animate-pulse">
                        New
                      </span>
                    )}
                  </button>

                  {showDropdown && (
                    <div className="px-2 pb-2 bg-white/60 dark:bg-black/40 shadow-sm dark:shadow-none">
                      {notifications.length > 0 && (
                        <Link 
                          to="/notifications"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full block mb-3 mt-1 p-2 rounded-lg bg-yellow-500 text-black text-xs font-bold uppercase tracking-widest text-center shadow-md"
                        >
                          View All Notifications ➔
                        </Link>
                      )}
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notif) => {
                          const isNew =
                            new Date(notif.updatedAt).getTime() >
                            openedWithLastSeen;
                          return (
                            <div
                              key={notif._id}
                              onClick={() => { setSelectedNotification(notif); setIsMobileMenuOpen(false); }}
                              className="p-3 mb-1 bg-white dark:bg-white/5 shadow-sm dark:shadow-none rounded-lg border border-stone-200 dark:border-white/5 text-sm cursor-pointer active:scale-95 transition-transform"
                            >
                              {isNew && (
                                <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest block mb-1">
                                  New
                                </span>
                              )}
                              <p 
                                className="text-stone-600 dark:text-gray-300 text-xs leading-relaxed line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: notif.message }}
                              ></p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-xs">
                          No notifications.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 block px-4 py-4 rounded-xl text-lg font-medium border border-transparent hover:border-red-500/20 transition-all text-left mt-2"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-yellow-500 text-black hover:bg-neutral-800 dark:hover:bg-yellow-400 block px-4 py-4 rounded-xl text-lg font-bold text-center mt-4 uppercase tracking-widest shadow-lg shadow-black/10 dark:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all"
            >
              Book Appointment
            </Link>
          )}
        </div>
      </div>

      {/* Selected Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative animate-[fadeIn_0.2s_ease-out]">
            <button 
              onClick={() => setSelectedNotification(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:hover:text-white p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl ${selectedNotification.type === 'reward' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                {selectedNotification.type === 'reward' ? <Sparkles size={24} /> : <Bell size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white uppercase tracking-widest">
                  {selectedNotification.type === 'reward' ? 'Reward Alert' : 'Booking Update'}
                </h3>
                <p className="text-xs text-stone-500 uppercase tracking-widest">
                  {new Date(selectedNotification.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div 
              className="text-stone-600 dark:text-gray-300 text-sm leading-relaxed p-4 bg-stone-50 dark:bg-black/40 rounded-2xl border border-stone-100 dark:border-white/5"
              dangerouslySetInnerHTML={{ __html: selectedNotification.message }}
            ></div>
            <button 
              onClick={() => setSelectedNotification(null)}
              className="mt-6 w-full py-3 bg-yellow-500 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
