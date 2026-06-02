import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Recycle, Trash2, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            <span>Next-gen Waste Management</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            AI-Powered <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
              Waste Segregation
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
            Upload any waste item to instantly discover disposal instructions, 🏡 DIY recycling ideas, and 💰 real-time scrap value estimates in India.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/20 group"
            >
              Analyze Waste
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          {/* Main Visual */}
          <div className="relative z-10 w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 rounded-[3rem] p-8 flex items-center justify-center animate-float border border-white/50 dark:border-white/5 shadow-2xl">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-32 h-32 bg-white dark:bg-dark-800 rounded-3xl shadow-lg flex flex-col items-center justify-center p-4"
              >
                <Recycle className="w-10 h-10 text-emerald-500 mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Recyclable</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -10 }}
                className="w-32 h-32 bg-white dark:bg-dark-800 rounded-3xl shadow-lg flex flex-col items-center justify-center p-4 translate-y-8"
              >
                <Trash2 className="w-10 h-10 text-teal-500 mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Compostable</span>
              </motion.div>
            </div>
            
            {/* Floating Cards */}
            <motion.div
              initial={{ x: 20, y: 20 }}
              animate={{ x: [20, -10, 20], y: [20, 40, 20] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-4 -right-4 glass dark:bg-white/10 p-4 rounded-2xl shadow-xl border border-white/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  96%
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Confidence</p>
                  <p className="text-sm font-bold">Plastic Bottle</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, y: -20 }}
              animate={{ x: [-20, 10, -20], y: [-20, -40, -20] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute -bottom-8 -left-8 glass dark:bg-white/10 p-4 rounded-2xl shadow-xl border border-white/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white">
                  <Recycle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Impact</p>
                  <p className="text-sm font-bold">-0.5kg CO₂</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Background effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/20 blur-[100px] -z-10 rounded-full" />
        </motion.div>
      </div>
      
      {/* Floating particles background (simplified) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-500/20"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              scale: Math.random() + 0.5 
            }}
            animate={{ 
              y: [null, Math.random() * 100 + "%"],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear" 
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
