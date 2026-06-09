import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Phone, Home } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-50 dark:bg-black pt-16 pb-6 mt-auto font-sans border-t border-stone-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Column 1: Logo & Socials */}
          <div className="flex flex-col items-start gap-8">
            <Link to="/" className="flex flex-col items-center group inline-flex">
              <span className="text-5xl font-sans font-normal uppercase tracking-widest text-stone-600 dark:text-gray-300 group-hover:text-black dark:hover:text-yellow-500 transition-colors leading-none mb-1">Salon</span>
              <span className="text-[12px] font-normal tracking-[0.4em] uppercase text-stone-600 dark:text-gray-400 group-hover:text-black dark:hover:text-yellow-500 transition-colors border-y border-stone-300 dark:border-white/20 py-1 w-full text-center">Yehansa</span>
              <span className="text-[9px] font-normal tracking-[0.2em] uppercase text-yellow-500 mt-1 w-full text-center">Hair & Beauty Unisex</span>
            </Link>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 text-stone-600 dark:text-gray-400">
              <a href="https://www.facebook.com/sa.nethuki.yehansha" target="_blank" rel="noreferrer" className="text-stone-600 dark:text-gray-400 hover:text-black dark:hover:text-yellow-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-stone-600 dark:text-gray-400 hover:text-black dark:hover:text-yellow-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="text-stone-600 dark:text-gray-400 hover:text-black dark:hover:text-yellow-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-yellow-500 font-normal uppercase tracking-wide text-sm mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm font-light text-stone-600 dark:text-gray-400 uppercase tracking-wider">
              <li><Link to="/" className="hover:text-black dark:hover:text-yellow-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-black dark:hover:text-yellow-500 transition-colors">About</Link></li>
              <li><Link to="/services" className="hover:text-black dark:hover:text-yellow-500 transition-colors">Services</Link></li>
              <li><Link to="/terms" className="hover:text-black dark:hover:text-yellow-500 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/contact" className="hover:text-black dark:hover:text-yellow-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="lg:col-span-1">
            <h4 className="text-yellow-500 font-normal uppercase tracking-wide text-sm mb-6">Contact Us</h4>
            
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-2 text-stone-600 dark:text-gray-300 font-normal text-sm tracking-wide">
                  <Clock size={18} strokeWidth={1.5} />
                  <span>OPENING TIMES</span>
                </div>
                <p className="text-sm text-stone-600 dark:text-gray-400 ml-8 font-light">Mon - Sat: 9:00 AM - 8:00 PM</p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2 text-stone-600 dark:text-gray-300 font-normal text-sm tracking-wide">
                  <Home size={18} strokeWidth={1.5} />
                  <span>OUR LOCATION</span>
                </div>
                <p className="text-sm text-stone-600 dark:text-gray-400 ml-8 font-light leading-relaxed">
                  Tangalle Road,<br />Withrandeniya
                </p>
              </div>
            </div>
          </div>

          {/* Column 4: Phone */}
          <div className="lg:pt-11">
            <div>
              <div className="flex items-center gap-3 mb-2 text-stone-600 dark:text-gray-300 font-normal text-sm tracking-wide">
                <Phone size={18} strokeWidth={1.5} />
                <span>OUR PHONE</span>
              </div>
              <p className="text-sm text-stone-600 dark:text-gray-400 ml-8 font-light">076-5547927</p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-stone-200 dark:border-white/10 text-center">
          <p className="text-xs text-gray-500 font-light tracking-wide">
            &copy; {new Date().getFullYear()} All Rights Reserved @ Salon Yehansa 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
