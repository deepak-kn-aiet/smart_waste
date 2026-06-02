import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Plus, Trash2, ArrowRight, ClipboardList, Info } from 'lucide-react';
import { cn } from '../utils/cn';

const wasteTypes = [
  { id: 'plastic', label: 'Plastic Waste', color: 'blue' },
  { id: 'paper', label: 'Paper Waste', color: 'yellow' },
  { id: 'organic', label: 'Organic Waste', color: 'green' },
  { id: 'e-waste', label: 'E-Waste', color: 'purple' },
];

const Planner: React.FC = () => {
  const [quantities, setQuantities] = useState<Record<string, string>>({
    plastic: '',
    paper: '',
    organic: '',
    'e-waste': '',
  });
  const [plan, setPlan] = useState<any[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (id: string, value: string) => {
    setQuantities(prev => ({ ...prev, [id]: value }));
  };

  const generatePlan = () => {
    setIsGenerating(true);
    
    fetch('http://localhost:5001/api/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quantities),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const planData = data.data;
        const newPlan = [
          { bin: 'Blue Bin', items: 'Plastic bottles, containers, bags', color: 'bg-blue-500', key: 'Blue Bin' },
          { bin: 'Green Bin', items: 'Food scraps, vegetable peels, garden waste', color: 'bg-green-500', key: 'Green Bin' },
          { bin: 'Paper Box', items: 'Newspapers, cardboard, office paper', color: 'bg-yellow-500', key: 'Paper Recycling' },
          { bin: 'Special Collection', items: 'Old phones, batteries, cables', color: 'bg-purple-600', key: 'E-Waste Center' },
        ].filter(p => planData[p.key])
        .map(p => ({ ...p, quantity: planData[p.key] }));

        setPlan(newPlan.length > 0 ? newPlan : null);
      }
    })
    .catch(err => console.error("Planner API Error:", err))
    .finally(() => setIsGenerating(false));
  };

  return (
    <section id="planner" className="py-24 bg-light-200/50 dark:bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          
          {/* Planner Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/3 glass dark:bg-white/5 p-8 rounded-[2.5rem] border border-white/50 dark:border-white/5 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-500">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Waste Planner</h3>
            </div>

            <div className="space-y-6">
              {wasteTypes.map((type) => (
                <div key={type.id} className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 block ml-1">
                    {type.label}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 bottles"
                    value={quantities[type.id]}
                    onChange={(e) => handleInputChange(type.id, e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
              ))}

              <button
                onClick={generatePlan}
                disabled={isGenerating}
                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Plan'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Plan Display */}
          <div className="flex-1 w-full min-h-[500px]">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-gray-500 font-medium">Creating your custom plan...</p>
                  </div>
                </motion.div>
              ) : plan ? (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {plan.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass dark:bg-white/5 p-6 rounded-3xl border border-white/50 dark:border-white/5 shadow-lg group hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", item.color)}>
                          <ClipboardList className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold">{item.bin}</h4>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                        Recommended for: <span className="font-semibold text-dark-900 dark:text-white">{item.items}</span>
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/5 px-3 py-2 rounded-xl w-fit">
                        <Info className="w-4 h-4" />
                        Ready to sort
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center glass dark:bg-white/5 rounded-[2.5rem] p-12 text-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/5">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 opacity-50">
                    <ClipboardList className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Plan Generated</h3>
                  <p>Enter waste quantities on the left to see your custom segregation plan.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Planner;
