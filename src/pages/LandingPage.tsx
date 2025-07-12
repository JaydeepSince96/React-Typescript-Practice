import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  IoCheckmarkCircleOutline, 
  IoSyncOutline, 
  IoStatsChartOutline,
  IoCloudUploadOutline,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
  IoArrowForwardOutline,
  IoPlayOutline,
  IoStarOutline
} from 'react-icons/io5';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const features = [
    {
      icon: <IoSyncOutline className="w-8 h-8" />,
      title: "Real-time Sync",
      description: "Keep your tasks synchronized across all your devices instantly"
    },
    {
      icon: <IoStatsChartOutline className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Track your productivity with detailed insights and reports"
    },
    {
      icon: <IoCloudUploadOutline className="w-8 h-8" />,
      title: "Cloud Storage",
      description: "Your data is safely stored and accessible from anywhere"
    },
    {
      icon: <IoShieldCheckmarkOutline className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Enterprise-grade security to protect your sensitive data"
    },
    {
      icon: <IoFlashOutline className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Optimized performance for seamless task management"
    },
    {
      icon: <IoCheckmarkCircleOutline className="w-8 h-8" />,
      title: "Smart Organization",
      description: "AI-powered categorization and priority management"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      rating: 5,
      comment: "TaskSync transformed how our team manages projects. The real-time sync is a game-changer!"
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      rating: 5,
      comment: "The analytics feature helps me understand my productivity patterns. Highly recommended!"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      rating: 5,
      comment: "Clean interface, powerful features. Everything I need in a task management tool."
    }
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
                onClick={toggleTheme}
                className={`${
                  isDark 
                    ? 'text-neutral-300 hover:text-white hover:bg-neutral-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {isDark ? '☀️' : '🌙'}
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
              <Button
                onClick={handleGetStarted}
                className={`${
                  isDark 
                    ? 'bg-sky-500 hover:bg-sky-600' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-semibold`}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Hero Badge */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full mb-8 ${
              isDark 
                ? 'bg-sky-500/10 border border-sky-500/20' 
                : 'bg-blue-100 border border-blue-200'
            }`}>
              <IoStarOutline className={`w-4 h-4 mr-2 ${
                isDark ? 'text-sky-400' : 'text-blue-600'
              }`} />
              <span className={`text-sm font-medium ${
                isDark ? 'text-sky-400' : 'text-blue-600'
              }`}>
                #1 Task Management Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <span className={`${
                isDark ? 'text-sky-400' : 'text-blue-600'
              }`}>Sync.</span>{' '}
              <span className={`${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`}>Organize.</span>{' '}
              <span className={`${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>Achieve.</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
              isDark ? 'text-neutral-300' : 'text-gray-600'
            }`}>
              Transform your productivity with the most intuitive task management platform. 
              Streamline workflows, collaborate seamlessly, and achieve your goals faster than ever.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className={`group px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 shadow-lg shadow-sky-500/25' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25'
                } text-white transform hover:scale-105`}
              >
                <IoPlayOutline className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Your Journey Begins
                <IoArrowForwardOutline className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-500' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                Watch Demo
              </Button>
            </div>

            {/* Hero Image/Mockup */}
            <div className={`relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl ${
              isDark ? 'shadow-black/50' : 'shadow-gray-500/25'
            }`}>
              <div className={`aspect-video rounded-2xl ${
                isDark 
                  ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700' 
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
              }`}>
                <div className="h-full flex items-center justify-center">
                  <div className={`text-center p-8 ${
                    isDark ? 'text-neutral-400' : 'text-gray-500'
                  }`}>
                    <IoStatsChartOutline className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">TaskSync Dashboard Preview</p>
                    <p className="text-sm mt-2">Beautiful interface coming to life</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${
        isDark ? 'bg-neutral-800/50' : 'bg-slate-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Powerful Features for Modern Teams
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-neutral-300' : 'text-gray-600'
            }`}>
              Everything you need to boost productivity and streamline your workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  isDark 
                    ? 'bg-neutral-800/80 border border-neutral-700 hover:bg-neutral-800 hover:shadow-lg hover:shadow-sky-500/10' 
                    : 'bg-white border border-gray-200 hover:bg-white hover:shadow-lg hover:shadow-blue-500/10'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  isDark 
                    ? 'bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20' 
                    : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`${
                  isDark ? 'text-neutral-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Loved by Thousands of Users
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-neutral-300' : 'text-gray-600'
            }`}>
              See what our users are saying about TaskSync
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-neutral-800/80 border border-neutral-700' 
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <IoStarOutline
                      key={i}
                      className={`w-5 h-5 ${
                        isDark ? 'text-yellow-400' : 'text-yellow-500'
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className={`mb-6 text-lg italic ${
                  isDark ? 'text-neutral-300' : 'text-gray-600'
                }`}>
                  "{testimonial.comment}"
                </p>
                <div>
                  <h4 className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {testimonial.name}
                  </h4>
                  <p className={`text-sm ${
                    isDark ? 'text-neutral-400' : 'text-gray-500'
                  }`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${
        isDark 
          ? 'bg-gradient-to-r from-sky-900/50 to-blue-900/50' 
          : 'bg-gradient-to-r from-blue-600 to-purple-600'
      }`}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have revolutionized their workflow with TaskSync.
            Start your journey today!
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="group px-12 py-4 text-xl font-semibold bg-white text-blue-600 hover:bg-gray-100 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <IoPlayOutline className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform" />
            Start Your Journey Now
            <IoArrowForwardOutline className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${
        isDark 
          ? 'bg-neutral-900 border-neutral-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-sky-500' : 'bg-blue-600'
              }`}>
                <IoSyncOutline className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                TaskSync
              </span>
            </div>
            <div className={`text-sm ${
              isDark ? 'text-neutral-400' : 'text-gray-500'
            }`}>
              © 2025 TaskSync. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
