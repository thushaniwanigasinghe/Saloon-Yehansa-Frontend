import React, { useState } from 'react';
import { ShieldCheck, CalendarClock, CreditCard, AlertCircle, FileText } from 'lucide-react';

const Terms = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 font-sans pb-20">
      
      {/* Luxury Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center bg-fixed opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-neutral-950/80 to-neutral-950"></div>
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-6xl font-light text-stone-900 dark:text-white uppercase tracking-widest mb-6">
            Terms & <span className="font-serif italic text-yellow-500 lowercase">Conditions</span>
          </h1>
          <p className="text-stone-600 dark:text-gray-400 font-light text-sm tracking-[0.3em] uppercase">Last Updated: April 2026</p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto mt-10"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sticky Sidebar Navigation */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-28 bg-neutral-900/50 border border-stone-200 dark:border-white/5 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-stone-900 dark:text-white font-serif italic text-xl mb-6">Contents</h3>
              <ul className="space-y-4">
                {[
                  { id: 'introduction', icon: FileText, label: '1. Introduction' },
                  { id: 'booking', icon: CalendarClock, label: '2. Appointments' },
                  { id: 'cancellation', icon: AlertCircle, label: '3. Cancellation' },
                  { id: 'refunds', icon: CreditCard, label: '4. Refunds' },
                  { id: 'safety', icon: ShieldCheck, label: '5. Health & Safety' }
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-3 text-sm font-light tracking-wide transition-all duration-300 w-full text-left ${
                        activeSection === item.id ? 'text-yellow-500 translate-x-2' : 'text-stone-600 dark:text-gray-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <item.icon size={16} strokeWidth={1.5} className={activeSection === item.id ? 'text-yellow-500' : 'text-gray-500'} />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-neutral-900/30 border border-stone-200 dark:border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-md">
              <div className="space-y-16 text-stone-600 dark:text-gray-300 font-light leading-loose text-base md:text-lg">
                
                {/* Section 1 */}
                <section id="introduction" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                      <FileText size={20} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-serif italic text-stone-900 dark:text-white">1. Introduction</h2>
                  </div>
                  <p className="text-stone-600 dark:text-gray-400">
                    Welcome to Salon Yehansa. These terms and conditions outline the rules and regulations for the use of Salon Yehansa's Website and our professional services. By accessing this website and booking our services, we assume you accept these terms and conditions in full. Do not continue to use Salon Yehansa's website if you do not accept all of the terms and conditions stated on this page.
                  </p>
                </section>

                <div className="w-full h-[1px] bg-white dark:bg-white/5 shadow-sm dark:shadow-none"></div>

                {/* Section 2 */}
                <section id="booking" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                      <CalendarClock size={20} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-serif italic text-stone-900 dark:text-white">2. Appointments & Booking</h2>
                  </div>
                  <p className="text-stone-600 dark:text-gray-400 mb-6">
                    All appointments must be booked in advance through our online platform or by contacting our front desk. When booking an appointment, you agree to provide accurate and complete information. Salon Yehansa reserves the right to cancel or modify reservations where it appears that a customer has engaged in fraudulent or inappropriate activity.
                  </p>
                  <div className="bg-white/60 dark:bg-black/40 shadow-sm dark:shadow-none border border-stone-200 dark:border-white/5 rounded-xl p-6">
                    <ul className="space-y-4 text-stone-600 dark:text-gray-400">
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2.5 flex-shrink-0"></span>
                        <span>Please arrive at least <strong className="text-stone-900 dark:text-white font-normal">10 minutes prior</strong> to your scheduled appointment time to ensure a full luxury experience.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2.5 flex-shrink-0"></span>
                        <span>Late arrivals (over 15 minutes) may result in a shortened service or total cancellation to respect the next client's time.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2.5 flex-shrink-0"></span>
                        <span>Certain extensive luxury services may require a non-refundable deposit at the time of booking.</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <div className="w-full h-[1px] bg-white dark:bg-white/5 shadow-sm dark:shadow-none"></div>

                {/* Section 3 */}
                <section id="cancellation" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                      <AlertCircle size={20} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-serif italic text-stone-900 dark:text-white">3. Cancellation Policy</h2>
                  </div>
                  <p className="text-stone-600 dark:text-gray-400">
                    We value your time and ours. If you need to cancel or reschedule your appointment, we require a minimum of <strong className="text-stone-900 dark:text-white font-normal">24 hours' notice</strong>. 
                    Cancellations made less than 24 hours in advance may be subject to a cancellation fee equivalent to 50% of the scheduled service cost. No-shows will be charged 100% of the service cost without exception.
                  </p>
                </section>

                <div className="w-full h-[1px] bg-white dark:bg-white/5 shadow-sm dark:shadow-none"></div>

                {/* Section 4 */}
                <section id="refunds" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                      <CreditCard size={20} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-serif italic text-stone-900 dark:text-white">4. Refunds & Satisfaction</h2>
                  </div>
                  <p className="text-stone-600 dark:text-gray-400">
                    Salon Yehansa strives to provide the highest level of service and artistry. If you are dissatisfied with your service, please notify our management within 48 hours of your appointment. While we do not offer cash refunds for services rendered, we will gladly offer a complimentary adjustment to ensure your absolute satisfaction. Retail products may be returned within 14 days of purchase, provided they are unopened and in their original pristine packaging.
                  </p>
                </section>

                <div className="w-full h-[1px] bg-white dark:bg-white/5 shadow-sm dark:shadow-none"></div>

                {/* Section 5 */}
                <section id="safety" className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                      <ShieldCheck size={20} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-serif italic text-stone-900 dark:text-white">5. Health & Safety</h2>
                  </div>
                  <p className="text-stone-600 dark:text-gray-400">
                    The health and safety of our clients and staff is our paramount priority. Please inform your stylist or therapist of any allergies, medical conditions, or sensitivities prior to your service commencing. Salon Yehansa is not liable for any adverse reactions caused by undisclosed medical conditions. We maintain strict sanitization protocols between every client for your peace of mind.
                  </p>
                </section>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Terms;
