import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { userPreferencesAPI, type UserPreferences } from '@/api/user/user-preferences-api';
import { toast } from 'sonner';
import { 
  IoPersonOutline,
  IoLockClosedOutline,
  IoNotificationsOutline,
  IoColorPaletteOutline,
  IoShieldCheckmarkOutline,
  IoLogOutOutline,
  IoTrashOutline,
  IoSaveOutline,
  IoArrowBackOutline
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { user, updateProfile, changePassword, logout, logoutAll, deleteAccount, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // State for profile settings - sync with user data
  const [profileSettings, setProfileSettings] = useState({
    name: '',
    email: ''
  });

  // State for password change
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State for notification settings - with loading state
  const [notificationSettings, setNotificationSettings] = useState<UserPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    weeklyReports: false,
    theme: 'system'
  });
  
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Sync profile settings when user data changes
  useEffect(() => {
    if (user) {
      setProfileSettings({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Load user preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setPreferencesLoading(true);
        const response = await userPreferencesAPI.getPreferences();
        if (response.success && response.data) {
          setNotificationSettings(response.data.preferences);
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
        // Keep default values if loading fails
      } finally {
        setPreferencesLoading(false);
      }
    };

    if (user) {
      loadPreferences();
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there are any changes
    if (profileSettings.name === user?.name && profileSettings.email === user?.email) {
      toast.info('No changes to save');
      return;
    }
    
    try {
      setProfileLoading(true);
      await updateProfile(profileSettings);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordSettings.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordSettings.currentPassword,
        newPassword: passwordSettings.newPassword
      });
      setPasswordSettings({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully! Please login again.');
    } catch (error) {
      console.error('Password change failed:', error);
      toast.error('Failed to change password');
    }
  };

  const handlePreferenceUpdate = async (key: keyof UserPreferences, value: boolean | string) => {
    try {
      setPreferencesLoading(true);
      const updatedPreferences = { ...notificationSettings, [key]: value };
      
      const response = await userPreferencesAPI.updatePreferences({ [key]: value });
      if (response.success) {
        setNotificationSettings(updatedPreferences);
        toast.success('Preferences updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setPreferencesLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt('Enter your password to confirm account deletion:');
    if (password && window.confirm('Are you sure? This action cannot be undone.')) {
      try {
        await deleteAccount(password);
        toast.success('Account deleted successfully');
        navigate('/');
      } catch (error) {
        console.error('Account deletion failed:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  const SettingSection: React.FC<{ 
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
    title: string; 
    children: React.ReactNode 
  }> = ({ icon: Icon, title, children }) => (
    <div className={`p-6 rounded-xl border ${
      isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-3 mb-4">
        <Icon className={`w-5 h-5 ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
        <h2 className={`text-xl font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className={`min-h-screen p-6 ${
      isDark ? 'bg-neutral-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className={`p-2 ${
              isDark ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'
            }`}
          >
            <IoArrowBackOutline className="w-5 h-5" />
          </Button>
          <h1 className={`text-3xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <SettingSection icon={IoPersonOutline} title="Profile Settings">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-neutral-300' : 'text-gray-700'
                  }`}>
                    Full Name
                  </label>
                  <Input
                    value={profileSettings.name}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, name: e.target.value }))}
                    className={isDark ? 'bg-neutral-700 border-neutral-600' : ''}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-neutral-300' : 'text-gray-700'
                  }`}>
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={profileSettings.email}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                    className={isDark ? 'bg-neutral-700 border-neutral-600' : ''}
                  />
                </div>
              </div>
              <Button type="submit" disabled={profileLoading} className="w-full md:w-auto">
                <IoSaveOutline className="w-4 h-4 mr-2" />
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </SettingSection>

          {/* Password Settings */}
          <SettingSection icon={IoLockClosedOutline} title="Password & Security">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-neutral-300' : 'text-gray-700'
                  }`}>
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordSettings.currentPassword}
                    onChange={(e) => setPasswordSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className={isDark ? 'bg-neutral-700 border-neutral-600' : ''}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-neutral-300' : 'text-gray-700'
                  }`}>
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordSettings.newPassword}
                    onChange={(e) => setPasswordSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                    className={isDark ? 'bg-neutral-700 border-neutral-600' : ''}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-neutral-300' : 'text-gray-700'
                  }`}>
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={passwordSettings.confirmPassword}
                    onChange={(e) => setPasswordSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={isDark ? 'bg-neutral-700 border-neutral-600' : ''}
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          </SettingSection>

          {/* Appearance Settings */}
          <SettingSection icon={IoColorPaletteOutline} title="Appearance">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Dark Mode
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-neutral-400' : 'text-gray-600'
                  }`}>
                    Toggle between light and dark theme
                  </p>
                </div>
                <Button
                  onClick={toggleTheme}
                  variant={isDark ? 'default' : 'outline'}
                  className="min-w-[100px]"
                >
                  {isDark ? 'Dark' : 'Light'}
                </Button>
              </div>
            </div>
          </SettingSection>

          {/* Notification Settings */}
          <SettingSection icon={IoNotificationsOutline} title="Notifications">
            <div className="space-y-4">
              {Object.entries(notificationSettings)
                .filter(([key]) => key !== 'theme') // Exclude theme from notifications
                .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <p className={`text-sm ${
                      isDark ? 'text-neutral-400' : 'text-gray-600'
                    }`}>
                      {key === 'emailNotifications' && 'Receive notifications via email'}
                      {key === 'pushNotifications' && 'Receive push notifications in browser'}
                      {key === 'taskReminders' && 'Get reminders for upcoming tasks'}
                      {key === 'weeklyReports' && 'Weekly productivity reports'}
                    </p>
                  </div>
                  <Button
                    onClick={() => handlePreferenceUpdate(key as keyof UserPreferences, !value)}
                    variant={value ? 'default' : 'outline'}
                    size="sm"
                    disabled={preferencesLoading}
                  >
                    {preferencesLoading ? '...' : (value ? 'On' : 'Off')}
                  </Button>
                </div>
              ))}
            </div>
          </SettingSection>

          {/* Security Actions */}
          <SettingSection icon={IoShieldCheckmarkOutline} title="Account Actions">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  onClick={logout}
                  variant="outline"
                  className="flex-1"
                >
                  <IoLogOutOutline className="w-4 h-4 mr-2" />
                  Logout
                </Button>
                <Button
                  onClick={logoutAll}
                  variant="outline"
                  className="flex-1"
                >
                  <IoLogOutOutline className="w-4 h-4 mr-2" />
                  Logout All Devices
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="flex-1"
                >
                  <IoTrashOutline className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </SettingSection>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
