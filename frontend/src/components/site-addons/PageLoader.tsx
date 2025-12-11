import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const PageLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (or wait for real resources if we had hooks for that)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center gap-4">
             {/* Logo / Icon Animation */}
             <motion.div
                initial={{ scale: 0.8, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
             />
             <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 font-medium tracking-widest text-sm"
             >
                LOADING
             </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
