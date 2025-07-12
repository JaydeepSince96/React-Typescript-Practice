import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoSyncOutline,
  IoArrowBackOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password
      });
      
      // Redirect to dashboard after successful registration
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth context with toast
      console.error('Registration failed:', error);
    }
  };

  const benefits = [
    "Unlimited task creation and organization",
    "Real-time collaboration with team members",
    "Advanced analytics and productivity insights",
    "Cross-platform synchronization",
    "Priority customer support",
    "Secure cloud storage"
  ];

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
                onClick={() => navigate('/login')}
                className={`${
                  isDark 
                    ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Registration Form */}
            <div className="order-2 lg:order-1">
              <div className={`p-8 md:p-12 rounded-3xl shadow-2xl ${
                isDark 
                  ? 'bg-neutral-800/80 border border-neutral-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="text-center mb-8">
                  <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Your Journey Begins Here
                  </h1>
                  <p className={`text-lg ${
                    isDark ? 'text-neutral-300' : 'text-gray-600'
                  }`}>
                    Join thousands of professionals transforming their productivity
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-neutral-300' : 'text-gray-700'
                      }`}>
                        First Name
                      </label>
                      <div className="relative">
                        <IoPersonOutline className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDark ? 'text-neutral-400' : 'text-gray-400'
                        }`} />
                        <Input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className={`pl-10 h-12 rounded-xl ${
                            isDark 
                              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-sky-500' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                          }`}
                          required
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDark ? 'text-neutral-300' : 'text-gray-700'
                      }`}>
                        Last Name
                      </label>
                      <div className="relative">
                        <IoPersonOutline className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDark ? 'text-neutral-400' : 'text-gray-400'
                        }`} />
                        <Input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className={`pl-10 h-12 rounded-xl ${
                            isDark 
                              ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-sky-500' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                          }`}
                          required
                        />
                      </div>
                    </div>
                  </div>

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
                        placeholder="Create a strong password"
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

                  {/* Confirm Password Field */}
                  <div className="relative">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-neutral-300' : 'text-gray-700'
                    }`}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <IoLockClosedOutline className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        isDark ? 'text-neutral-400' : 'text-gray-400'
                      }`} />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className={`pl-10 pr-10 h-12 rounded-xl ${
                          isDark 
                            ? 'bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:border-sky-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                          isDark ? 'text-neutral-400 hover:text-neutral-300' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {showConfirmPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-12 text-lg font-semibold rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 shadow-lg shadow-sky-500/25' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25'
                    } text-white transform hover:scale-105 disabled:opacity-50 disabled:transform-none`}
                  >
                    {loading ? 'Creating Account...' : 'Create Your Account'}
                  </Button>

                  {/* Sign In Link */}
                  <div className="text-center">
                    <p className={`text-sm ${
                      isDark ? 'text-neutral-400' : 'text-gray-600'
                    }`}>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className={`font-medium ${
                          isDark ? 'text-sky-400 hover:text-sky-300' : 'text-blue-600 hover:text-blue-500'
                        } transition-colors`}
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side - Benefits */}
            <div className="order-1 lg:order-2">
              <div className="text-center lg:text-left">
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Why Choose TaskSync?
                </h2>
                <p className={`text-lg mb-8 ${
                  isDark ? 'text-neutral-300' : 'text-gray-600'
                }`}>
                  Join the productivity revolution and experience the difference
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                        isDark ? 'bg-sky-500/20' : 'bg-blue-100'
                      }`}>
                        <IoCheckmarkCircleOutline className={`w-4 h-4 ${
                          isDark ? 'text-sky-400' : 'text-blue-600'
                        }`} />
                      </div>
                      <p className={`text-lg ${
                        isDark ? 'text-neutral-300' : 'text-gray-700'
                      }`}>
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      isDark ? 'text-sky-400' : 'text-blue-600'
                    }`}>
                      50K+
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-neutral-400' : 'text-gray-600'
                    }`}>
                      Active Users
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      isDark ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      99.9%
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-neutral-400' : 'text-gray-600'
                    }`}>
                      Uptime
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      isDark ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>
                      4.9★
                    </div>
                    <div className={`text-sm ${
                      isDark ? 'text-neutral-400' : 'text-gray-600'
                    }`}>
                      User Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
