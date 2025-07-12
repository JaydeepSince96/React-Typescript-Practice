import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  IoMailOutline, 
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoSyncOutline,
  IoArrowBackOutline,
  IoLogoGoogle,
  IoLogoApple
} from 'react-icons/io5';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login data:', formData);
    // For now, redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
    }`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md border-b ${
        isDark 
          ? 'bg-neutral-900/80 border-neutral-700' 
          : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-sky-500' : 'bg-blue-600'
              }`}>
                <IoSyncOutline className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                TaskSync
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className={`${
                  isDark 
                    ? 'text-neutral-300 hover:text-white hover:bg-neutral-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IoArrowBackOutline className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/register')}
                className={`${
                  isDark 
                    ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className={`p-8 md:p-12 rounded-3xl shadow-2xl ${
            isDark 
              ? 'bg-neutral-800/80 border border-neutral-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="text-center mb-8">
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome Back
              </h1>
              <p className={`text-lg ${
                isDark ? 'text-neutral-300' : 'text-gray-600'
              }`}>
                Sign in to continue your productivity journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-neutral-300' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <IoMailOutline className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-neutral-400' : 'text-gray-400'
                  }`} />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                    className={`pl-10 h-12 rounded-xl ${
                      isDark 
                        ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-sky-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-neutral-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <IoLockClosedOutline className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-neutral-400' : 'text-gray-400'
                  }`} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 h-12 rounded-xl ${
                      isDark 
                        ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-sky-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      isDark ? 'text-neutral-400 hover:text-neutral-300' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {showPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className={`text-sm font-medium ${
                    isDark ? 'text-sky-400 hover:text-sky-300' : 'text-blue-600 hover:text-blue-500'
                  } transition-colors`}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className={`w-full h-12 text-lg font-semibold rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 shadow-lg shadow-sky-500/25' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25'
                } text-white transform hover:scale-105`}
              >
                Sign In
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className={`absolute inset-0 flex items-center ${
                  isDark ? 'text-neutral-600' : 'text-gray-300'
                }`}>
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`bg-transparent px-2 ${
                    isDark ? 'text-neutral-400' : 'text-gray-500'
                  }`}>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className={`h-12 rounded-xl ${
                    isDark 
                      ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IoLogoGoogle className="w-5 h-5 mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`h-12 rounded-xl ${
                    isDark 
                      ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IoLogoApple className="w-5 h-5 mr-2" />
                  Apple
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className={`text-sm ${
                  isDark ? 'text-neutral-400' : 'text-gray-600'
                }`}>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className={`font-medium ${
                      isDark ? 'text-sky-400 hover:text-sky-300' : 'text-blue-600 hover:text-blue-500'
                    } transition-colors`}
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
