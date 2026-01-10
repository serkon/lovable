import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";

export interface LifestyleCard {
  id: string;
  title: string;
  content: string;
}

interface LifestyleCardProps {
  items: { content: string; category: string }[];
  activeIndex: number;
  onAdd: () => void;
  onNext: () => void;
  onPrev: () => void;
  isAdded: boolean;
  direction?: number;
}

const LifestyleCardComponent: React.FC<LifestyleCardProps> = ({
  items,
  activeIndex,
  onAdd,
  onNext,
  onPrev,
  isAdded,
  direction = 0,
}) => {
  // We want to show a fan of 5 cards: 2 left, 1 center, 2 right
  const getStackItems = () => {
    const stack = [];
    const itemCount = items.length;
    if (itemCount === 0) return [];

    // For 5 cards, we take indices from -2 to 2 relative to activeIndex
    for (let i = -2; i <= 2; i++) {
      const index = (activeIndex + i + itemCount) % itemCount;
      stack.push({ ...items[index], spreadIndex: i });
    }
    return stack;
  };

  const stackItems = getStackItems();

  const cardVariants = {
    // Initial state for NEW items entering the 5-card window
    enter: (spreadIndex: number) => ({
      x: spreadIndex > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.7,
      rotate: spreadIndex > 0 ? 45 : -45,
    }),
    // Current state for items based on their position in the fan
    center: (spreadIndex: number) => ({
      zIndex: 10 - Math.abs(spreadIndex),
      x: spreadIndex * 50, // Slightly reduced spread
      y: Math.abs(spreadIndex) * 12, // Reduced arch effect
      scale: spreadIndex === 0 ? 1 : 0.85 - Math.abs(spreadIndex) * 0.05,
      rotate: spreadIndex * 12, // More pronounced fan rotation
      opacity: spreadIndex === 0 ? 1 : 0.6 - Math.abs(spreadIndex) * 0.2,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 25,
      },
    }),
    // Exit state for items leaving the 5-card window
    exit: (spreadIndex: number) => ({
      x: spreadIndex > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.7,
      rotate: spreadIndex > 0 ? 45 : -45,
      transition: {
        duration: 0.3,
      },
    }),
  };

  const currentItem = items[activeIndex];

  return (
    <div
      className="flex w-full flex-col items-center justify-center"
      data-test-id="lifestyle-card-carousel"
    >
      <div className="relative flex w-[352px] items-center justify-center">
        {/* Navigation Buttons - Desktop */}
        <Button
          onClick={onPrev}
          data-test-id="carousel-prev-button-desktop"
          className="group absolute left-0 z-[60] hidden h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-xl backdrop-blur-md transition-all hover:bg-white active:scale-90 sm:flex dark:border-gray-800 dark:bg-gray-900/90"
        >
          <span className="material-icons-round text-3xl text-gray-500 transition-transform group-hover:-translate-x-0.5">
            chevron_left
          </span>
        </Button>

        <div className="relative flex h-[12rem] w-full max-w-[40rem] items-center justify-center overflow-visible">
          <AnimatePresence initial={false} mode="popLayout">
            {stackItems.map((item) => (
              <motion.div
                key={item.content} // Stable key is critical for smooth transition between positions
                custom={item.spreadIndex}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                data-test-id={
                  item.spreadIndex === 0
                    ? "carousel-card-active"
                    : `carousel-card-spread-${item.spreadIndex}`
                }
                className="absolute flex h-[10rem] max-w-[20rem] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:border-gray-800 dark:bg-gray-900 dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                style={{ originY: 1 }}
              >
                {/* Title above stack */}
                {item.spreadIndex === 0 && (
                  <h3
                    className={`font-dm-sans absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-[12px] border border-neutral-200 bg-neutral-100 bg-white px-3 py-1 text-xs whitespace-nowrap text-gray-400`}
                    data-test-id="carousel-category-title"
                  >
                    {currentItem?.category || "Öneri"}
                  </h3>
                )}
                {/* Content Inside Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-1 flex-col items-center justify-center text-center"
                >
                  <p
                    className="line-clamp-5 px-2 text-lg text-sm leading-relaxed text-gray-700 dark:text-gray-200"
                    data-test-id="carousel-card-content"
                  >
                    {item.content}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Button
          onClick={onNext}
          data-test-id="carousel-next-button-desktop"
          className="group absolute right-0 z-[60] hidden h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white/90 shadow-xl backdrop-blur-md transition-all hover:bg-white active:scale-90 sm:flex dark:border-gray-800 dark:bg-gray-900/90"
        >
          <span className="material-icons-round text-3xl text-gray-500 transition-transform group-hover:translate-x-0.5">
            chevron_right
          </span>
        </Button>
        {/* Add Button */}
        <div className="margin-auto absolute bottom-0 z-10" data-test-id="carousel-add-button">
          <Button
            onClick={onAdd}
            data-test-id="carousel-add-button"
            size="md"
            className={`group border-primary flex items-center justify-center gap-3 rounded-full border-2 ${
              isAdded
                ? "text-primary hover:text-primary bg-white hover:bg-white"
                : "bg-primary text-white"
            }`}
          >
            <span className="material-icons-round text-2xl">{isAdded ? "check" : "add"}</span>
            {/*<span className="text-xl font-bold">{isAdded ? "Eklendi" : "Biyografiye Ekle"}</span>*/}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="mt-10 flex items-center gap-10 sm:hidden">
        <Button
          onClick={onPrev}
          data-test-id="carousel-prev-button-mobile"
          size="md"
          className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-xl dark:border-gray-800 dark:bg-gray-900"
        >
          <span className="material-icons-round text-4xl">chevron_left</span>
        </Button>
        <Button
          onClick={onNext}
          data-test-id="carousel-next-button-mobile"
          size="md"
          className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-xl dark:border-gray-800 dark:bg-gray-900"
        >
          <span className="material-icons-round text-4xl">chevron_right</span>
        </Button>
      </div>
    </div>
  );
};

export default LifestyleCardComponent;
