import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  IoPersonOutline, 
  IoLogOutOutline,
  IoSettingsOutline,
  IoLockClosedOutline,
  IoTrashOutline,
  IoCloudUploadOutline,
  IoEyeOutline,
  IoEyeOffOutline
} from 'react-icons/io5';

export const UserProfile: React.FC = () => {
  const { user, logout, logoutAll, updateProfile, uploadProfilePicture, changePassword, deleteAccount, loading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  // State for profile edit dialog
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // State for password change dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // State for delete account dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadProfilePicture(file);
      } catch (error) {
        console.error('Profile picture upload failed:', error);
      }
    }
  };

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setProfileDialogOpen(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordDialogOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };

  // Delete account
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteAccount(deletePassword);
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error('Account deletion failed:', error);
      }
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            isDark 
              ? 'hover:bg-neutral-700 text-neutral-300' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isDark ? 'bg-sky-500' : 'bg-blue-600'
          }`}>
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <IoPersonOutline className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="text-left">
            <div className="font-medium">{user.name}</div>
            <div className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>
              {user.email}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className={`w-64 ${
          isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'
        }`}
      >
        <DropdownMenuLabel className={isDark ? 'text-neutral-300' : 'text-gray-700'}>
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className={isDark ? 'bg-neutral-700' : 'bg-gray-200'} />
        
        {/* Settings */}
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <IoSettingsOutline className="w-4 h-4 mr-3" />
          Settings
        </DropdownMenuItem>
        
        {/* Edit Profile */}
        <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <IoPersonOutline className="w-4 h-4 mr-3" />
              Edit Profile
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className={isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                Edit Profile
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  isDark ? 'bg-sky-500' : 'bg-blue-600'
                }`}>
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <IoPersonOutline className="w-8 h-8 text-white" />
                  )}
                </div>
                <label htmlFor="profilePicture" className="cursor-pointer">
                  <Button type="button" variant="outline" className="text-sm" asChild>
                    <span>
                      <IoCloudUploadOutline className="w-4 h-4 mr-2" />
                      Upload Photo
                    </span>
                  </Button>
                </label>
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-neutral-300' : 'text-gray-700'
                }`}>
                  Name
                </label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className={isDark ? 'bg-neutral-700 border-neutral-600' : ''}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-neutral-300' : 'text-gray-700'
                }`}>
                  Email
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className={isDark ? 'bg-neutral-700 border-neutral-600' : ''}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setProfileDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Change Password */}
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <IoLockClosedOutline className="w-4 h-4 mr-3" />
              Change Password
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className={isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                Change Password
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-neutral-300' : 'text-gray-700'
                }`}>
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className={`pr-10 ${isDark ? 'bg-neutral-700 border-neutral-600' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.current ? 
                      <IoEyeOffOutline className="w-4 h-4" /> : 
                      <IoEyeOutline className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-neutral-300' : 'text-gray-700'
                }`}>
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className={`pr-10 ${isDark ? 'bg-neutral-700 border-neutral-600' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.new ? 
                      <IoEyeOffOutline className="w-4 h-4" /> : 
                      <IoEyeOutline className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-neutral-300' : 'text-gray-700'
                }`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`pr-10 ${isDark ? 'bg-neutral-700 border-neutral-600' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.confirm ? 
                      <IoEyeOffOutline className="w-4 h-4" /> : 
                      <IoEyeOutline className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setPasswordDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <DropdownMenuSeparator className={isDark ? 'bg-neutral-700' : 'bg-gray-200'} />

        {/* Logout */}
        <DropdownMenuItem onClick={logout}>
          <IoLogOutOutline className="w-4 h-4 mr-3" />
          Logout
        </DropdownMenuItem>

        {/* Logout All Devices */}
        <DropdownMenuItem onClick={logoutAll}>
          <IoSettingsOutline className="w-4 h-4 mr-3" />
          Logout All Devices
        </DropdownMenuItem>

        <DropdownMenuSeparator className={isDark ? 'bg-neutral-700' : 'bg-gray-200'} />

        {/* Delete Account */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem 
              onSelect={(e) => e.preventDefault()}
              className="text-red-600 focus:text-red-600"
            >
              <IoTrashOutline className="w-4 h-4 mr-3" />
              Delete Account
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className={isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white'}>
            <DialogHeader>
              <DialogTitle className="text-red-600">
                Delete Account
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className={`text-sm ${isDark ? 'text-neutral-300' : 'text-gray-600'}`}>
                This action cannot be undone. This will permanently delete your account and remove all of your data.
              </p>
              
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-neutral-300' : 'text-gray-700'
                  }`}>
                    Enter your password to confirm
                  </label>
                  <Input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className={isDark ? 'bg-neutral-700 border-neutral-600' : ''}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="destructive" 
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
