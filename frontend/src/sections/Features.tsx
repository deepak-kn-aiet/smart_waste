import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Brain, Home, Coins } from 'lucide-react';

const features = [
  {
    icon: <Scan className="w-6 h-6" />,
    title: 'AI Waste Detection',
    description: 'Instantly identify waste items using our high-precision computer vision model.',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Smart Segregation',
    description: 'Get precise instructions on which bin to use for every type of material.',
  },
  {
    icon: <Home className="w-6 h-6" />,
    title: 'Recycle At Home',
    description: 'Discover creative DIY ways to reuse or upcycle your waste items effectively.',
  },
  {
    icon: <Coins className="w-6 h-6" />,
    title: 'Earn From Recycling',
    description: 'Get real-time estimates of how much you can earn by selling scrap in India.',
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Smarter Waste, <span className="text-emerald-500">Cleaner Planet</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Our cutting-edge technology makes recycling effortless and impactful for everyone.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass dark:bg-white/5 p-8 rounded-[2rem] border border-white/50 dark:border-white/5 shadow-xl hover:shadow-emerald-500/10 transition-all group"
            >
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
