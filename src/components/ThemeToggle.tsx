import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      className="relative flex h-9 w-16 items-center rounded-full border border-(--border-soft) bg-white/5 px-1 transition-colors"
    >
      <motion.div
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-twin-blue via-twin-teal to-twin-purple shadow-md"
      >
        {isDark ? <Moon size={14} className="text-white" /> : <Sun size={14} className="text-white" />}
      </motion.div>
    </button>
  );
}
