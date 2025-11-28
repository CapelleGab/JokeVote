import { motion, AnimatePresence } from "framer-motion";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import confetti from "canvas-confetti";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type Props = {
  text: string;
  answer: string;
  isFav: boolean;
  onClick: () => void;
};

export const Joke = ({ text, answer, isFav, onClick }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    if (!isFav) {
      // Confetti origin at the center of the screen for responsive design
      const x = 0.5;
      const y = 0.5;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ['#8b5cf6', '#ec4899', '#3b82f6']
      });
    }
    onClick();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", duration: 0.5 }}
      className="relative p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background gradient blob */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
        <motion.button
          id="like-btn"
          onClick={handleLike}
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          className={cn(
            "p-3 rounded-full transition-colors duration-300",
            isFav ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-400"
          )}
        >
          <AnimatePresence mode="wait">
            {isFav ? (
              <motion.div
                key="filled"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <MdFavorite className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="outline"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <MdFavoriteBorder className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="pr-14 relative z-10">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-6 leading-relaxed tracking-tight">
          {text}
        </h3>
        
        <div className="relative inline-block">
          <motion.div
            animate={{ filter: isHovered || isFav ? "blur(0px)" : "blur(8px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="cursor-pointer select-none"
          >
            <p className="text-base md:text-lg font-medium text-violet-600 italic">
              {answer}
            </p>
          </motion.div>
          
          {/* Hint text that disappears on hover */}
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: isHovered || isFav ? 0 : 0.6 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs uppercase tracking-widest font-bold text-slate-400 pointer-events-none whitespace-nowrap"
          >
            Réponse
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};
