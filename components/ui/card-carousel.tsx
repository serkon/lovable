import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface LifestyleCard {
  id: string;
  category: string;
  content: string;
}

interface LifestyleCardProps {
  card: LifestyleCard;
  onAdd: (card: LifestyleCard) => void;
  onNext: () => void;
  onPrev: () => void;
  isAdded: boolean;
  direction?: number;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    rotate: direction > 0 ? 10 : -10,
  }),
  center: {
    zIndex: 20,
    x: 0,
    opacity: 1,
    rotate: 0,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    rotate: direction < 0 ? 10 : -10,
  }),
};

const LifestyleCardComponent: React.FC<LifestyleCardProps> = ({
  card,
  onAdd,
  onNext,
  onPrev,
  isAdded,
  direction = 0,
}) => {
  return (
    <div className="mb-8 flex w-full flex-col items-center justify-center space-y-6 py-4">
      {/* Category Label - Separator Style */}
      <div className="flex w-full max-w-[20rem] items-center gap-4 sm:max-w-[24rem]">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          {card.category}
        </span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
      </div>

      <div className="relative flex w-full items-center justify-center">
        {/* Navigation Buttons */}
        <button
          onClick={onPrev}
          className="dark:bg-surface-dark border-border-light dark:border-border-dark hover:text-primary hover:border-primary group absolute left-11 z-30 hidden h-10 w-10 items-center justify-center rounded-full border bg-white text-gray-400 shadow-sm transition-all focus:outline-none sm:flex"
        >
          <span className="material-icons-round text-xl transition-transform group-hover:-translate-x-0.5">
            arrow_back
          </span>
        </button>

        {/* Card Stack Visual */}
        <div className="perspective-1000 relative flex h-[12rem] w-full max-w-[20rem] items-center justify-center sm:max-w-[24rem]">
          {/* Background stack cards */}
          <div className="dark:bg-surface-dark border-border-light dark:border-border-dark absolute z-0 h-full w-full -translate-x-8 scale-90 -rotate-6 transform rounded-3xl border bg-white opacity-40 shadow-sm"></div>
          <div className="dark:bg-surface-dark border-border-light dark:border-border-dark absolute z-0 h-full w-full translate-x-8 scale-90 rotate-6 transform rounded-3xl border bg-white opacity-40 shadow-sm"></div>
          <div className="dark:bg-surface-dark border-border-light dark:border-border-dark absolute z-10 h-full w-full -translate-x-4 scale-95 -rotate-3 transform rounded-3xl border bg-white opacity-70 shadow-md"></div>

          {/* Main interactive card */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={card.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 25 },
                opacity: { duration: 0.2 },
                rotate: { duration: 0.2 },
              }}
              className="dark:bg-surface-dark shadow-card dark:shadow-card-dark border-border-light dark:border-border-dark relative z-20 flex h-full w-full transform flex-col items-center justify-between rounded-3xl border bg-white px-4 py-5 text-center sm:px-6"
            >
              <div className="flex flex-grow items-center justify-center px-2">
                <p className="font-display text-text-main-light dark:text-text-main-dark text-lg leading-snug sm:text-xl">
                  {card.content}
                </p>
              </div>

              <div className="mt-1 flex w-full justify-center">
                <button
                  onClick={() => onAdd(card)}
                  className={`group flex transform items-center justify-center gap-1.5 rounded-full border px-5 py-2 transition-all hover:scale-[1.02] active:scale-95 ${
                    isAdded
                      ? "bg-primary border-primary text-white"
                      : "text-primary border-primary hover:bg-primary/5 bg-transparent"
                  } `}
                >
                  <span className="material-icons-round text-sm">{isAdded ? "check" : "add"}</span>
                  <span className="text-xs font-medium">{isAdded ? "Eklendi" : "Ekle"}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={onNext}
          className="dark:bg-surface-dark border-border-light dark:border-border-dark hover:text-primary hover:border-primary group absolute right-12 z-30 hidden h-10 w-10 items-center justify-center rounded-full border bg-white text-gray-400 shadow-sm transition-all focus:outline-none sm:flex"
        >
          <span className="material-icons-round text-xl transition-transform group-hover:translate-x-0.5">
            arrow_forward
          </span>
        </button>

        {/* Mobile Navigation */}
        <div className="absolute -bottom-14 mt-4 flex items-center gap-4 sm:hidden">
          <button
            onClick={onPrev}
            className="dark:bg-surface-dark border-border-light dark:border-border-dark hover:text-primary flex h-10 w-10 items-center justify-center rounded-full border bg-white text-gray-400 shadow-sm transition-all"
          >
            <span className="material-icons-round text-xl">arrow_back</span>
          </button>
          <button
            onClick={onNext}
            className="dark:bg-surface-dark border-border-light dark:border-border-dark hover:text-primary flex h-10 w-10 items-center justify-center rounded-full border bg-white text-gray-400 shadow-sm transition-all"
          >
            <span className="material-icons-round text-xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LifestyleCardComponent;
