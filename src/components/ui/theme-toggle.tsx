import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { IoSunny, IoMoon } from 'react-icons/io5';

const ThemeToggle: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center w-14 h-8 rounded-full 
        transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 
        ${isDark 
          ? 'bg-gradient-to-r from-slate-800 to-slate-900 focus:ring-blue-500/30 border border-slate-600' 
          : 'bg-gradient-to-r from-blue-100 to-indigo-100 focus:ring-blue-400/30 border border-blue-200'
        }
        hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Ball */}
      <div
        className={`
          absolute w-6 h-6 rounded-full transition-all duration-300 ease-in-out
          flex items-center justify-center shadow-md
          ${isDark 
            ? 'translate-x-3 bg-gradient-to-br from-slate-200 to-white' 
            : '-translate-x-3 bg-gradient-to-br from-amber-400 to-orange-500'
          }
        `}
      >
        {isDark ? (
          <IoMoon className="w-3 h-3 text-slate-700" />
        ) : (
          <IoSunny className="w-3 h-3 text-white" />
        )}
      </div>
      
      {/* Background Icons */}
      <div className="flex items-center justify-between w-full px-2 pointer-events-none">
        <IoSunny 
          className={`w-3 h-3 transition-opacity duration-300 ${
            isDark ? 'opacity-40 text-slate-400' : 'opacity-0 text-orange-500'
          }`} 
        />
        <IoMoon 
          className={`w-3 h-3 transition-opacity duration-300 ${
            isDark ? 'opacity-0 text-slate-300' : 'opacity-40 text-slate-600'
          }`} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
