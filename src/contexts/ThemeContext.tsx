import React,
{
  createContext,
  useState,
  useMemo,
  useEffect,
  useContext
} from 'react';

// Define the shape of the context data
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create a provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Toggle the theme
  const toggleTheme = () => {
    setIsDark(prevIsDark => !prevIsDark);
  };

  // Add/remove 'dark' class from the body
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ isDark, toggleTheme }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};