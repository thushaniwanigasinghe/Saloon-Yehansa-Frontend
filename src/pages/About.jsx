import logoImage from '../assets/logo.jpg';
import { Sparkles, Users, Heart, ShieldCheck } from 'lucide-react';


const About = () => {
  const stats = [
    { label: 'Years Experience', value: '15+' },
    { label: 'Happy Clients', value: '10k+' },
    { label: 'Master Stylists', value: '24' },
    { label: 'Awards Won', value: '12' },
  ];

  const values = [
    {
      icon: <Sparkles size={24} />,
      title: 'Premium Products',
      description: 'We partner exclusively with luxury brands to ensure your hair receives the ultimate care.'
    },
    {
      icon: <Users size={24} />,
      title: 'Master Stylists',
      description: 'Our artists undergo continuous international training to master the latest techniques.'
    },
    {
      icon: <Heart size={24} />,
      title: 'Personalized Care',
      description: 'Every treatment is uniquely tailored to your individual features and lifestyle.'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Uncompromised Quality',
      description: 'We hold ourselves to the highest standards of hygiene, precision, and excellence.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 text-stone-900 dark:text-white font-sans overflow-hidden">
      
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Salon Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/60 to-neutral-950"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <h4 className="text-yellow-500 text-xs font-bold tracking-[0.4em] uppercase mb-6">The Salon Yehansa Experience</h4>
         <h1 className="text-4xl md:text-5xl font-light text-white dark:text-white mb-6 tracking-widest uppercase">
  Our <span className="font-serif italic text-white/70 lowercase">Heritage</span>
</h1>
          <div className="w-24 h-[1px] bg-yellow-500 mx-auto mb-8"></div>
          <p className="text-white dark:text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
  Redefining luxury hair care through artistry, innovation, and an unwavering commitment to elegance.
</p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/10 translate-x-4 translate-y-4 rounded-2xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Stylist working" 
              className="relative z-10 rounded-2xl shadow-2xl border border-stone-200 dark:border-white/10 grayscale hover:grayscale-0 transition-all duration-700 object-cover aspect-[4/5]" 
            />
          </div>
          
          <div>
            <h4 className="text-yellow-500 text-xs font-bold tracking-[0.3em] uppercase mb-4">Since 2008</h4>
            <h2 className="text-3xl md:text-4xl font-light mb-8 uppercase tracking-widest">
              The <span className="text-yellow-500 font-serif italic lowercase">Vision</span>
            </h2>
            <div className="space-y-6 text-stone-600 dark:text-gray-400 font-light leading-relaxed text-base">
              <p>
                Founded with a singular vision to elevate the standard of beauty, Salon Yehansa emerged as a sanctuary for those who seek more than just a haircut. We believe that true elegance lies in the details.
              </p>
              <p>
                Our flagship studio was designed to be a haven of tranquility, where modern aesthetics meet timeless luxury. Every element of the Salon Yehansa experience has been meticulously crafted to provide you with an atmosphere of absolute serenity and indulgence.
              </p>
            </div>
            
            <div className="border-l-2 border-yellow-500 pl-8 my-10 py-2">
              <p className="text-2xl font-serif italic text-stone-900 dark:text-white leading-snug">
                "Our mission is to empower you through exceptional styling and a truly rejuvenating experience."
              </p>
            </div>
            
            <div className="pt-8 border-t border-stone-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-6">
              <img src={logoImage} alt="Salon Yehansa Logo" className="h-20 w-20 object-cover rounded-full border-2 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]" />
              <div className="text-center sm:text-left">
                <p className="text-xs text-stone-600 dark:text-gray-400 uppercase tracking-widest">Founder & Creative Director</p>
                <p className="text-base text-stone-900 dark:text-white font-medium mt-1 tracking-wide">S.A.Nethuki Yehansha</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-stone-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center px-4">
                <div className="text-3xl md:text-4xl font-light text-yellow-500 mb-2">{stat.value}</div>
                <div className="text-xs text-stone-600 dark:text-gray-400 uppercase tracking-widest font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-stone-900 dark:text-white mb-6 tracking-widest uppercase">
  Our <span className="font-serif italic text-black dark:text-white/50 lowercase">Philosophy</span>
</h2>
          <div className="w-16 h-[1px] bg-yellow-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, idx) => (
            <div key={idx} className="bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-none border border-stone-200 dark:border-white/5 p-8 rounded-2xl hover:border-black dark:hover:border-yellow-500/30 hover:bg-stone-50 dark:hover:bg-white/[0.04] transition-all duration-500 group">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                {value.icon}
              </div>
              <h3 className="text-base md:text-lg font-light text-stone-900 dark:text-white mb-4 tracking-wide">{value.title}</h3>
              <p className="text-sm text-stone-600 dark:text-gray-400 font-light leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default About;
