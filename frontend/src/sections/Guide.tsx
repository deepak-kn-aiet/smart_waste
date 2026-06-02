import React from 'react';
import { motion } from 'framer-motion';
import { Check, Droplets, Scissors, Share2, Trash } from 'lucide-react';

const steps = [
  {
    title: 'Clean the bottle',
    description: 'Rinse out any remaining liquid or food particles to prevent contamination.',
    icon: <Droplets className="w-6 h-6" />,
  },
  {
    title: 'Remove cap',
    description: 'Take off the plastic cap and ring, as they are often made of different plastic.',
    icon: <Scissors className="w-6 h-6" />,
  },
  {
    title: 'Separate materials',
    description: 'If there are paper labels that easily come off, remove them.',
    icon: <Share2 className="w-6 h-6" />,
  },
  {
    title: 'Place in recycling bin',
    description: 'Drop it in the designated blue bin for plastic waste.',
    icon: <Trash className="w-6 h-6" />,
  },
];

const Guide: React.FC = () => {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How to Recycle Correctly</h2>
          <p className="text-gray-500 dark:text-gray-400">Follow these simple steps to ensure your waste is recycled efficiently.</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-100 dark:bg-white/5 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center gap-8 md:gap-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Icon Circle */}
                <div className="absolute left-8 -translate-x-1/2 w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10 md:left-1/2 shadow-xl shadow-emerald-500/30">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="ml-16 md:ml-0 md:w-1/2 md:px-12">
                  <div className={`glass dark:bg-white/5 p-8 rounded-[2rem] border border-white/50 dark:border-white/5 shadow-xl transition-all hover:border-emerald-500/30 group`}>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2 block">Step {index + 1}</span>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guide;
