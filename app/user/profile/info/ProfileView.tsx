'use client'
import { useState } from 'react';
import { User, LogOut, Edit2, Mail, UserCircle, Calendar, MapPin, Camera } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "Nov",
    lastName: "Raksa",
    gender: "Male",
    username: "Minus Sinos",
    email: "novraksa204@gmail.com",
    bio: "Passionate traveler exploring the world one country at a time.",
    location: "Phnom Penh, Cambodia",
    joinedDate: "January 2024",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nov"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, avatar: url }));
    }
  };

  const handleSave = () => {
    console.log('Profile saved:', profile);
    alert('Profile saved successfully!');
    setIsEditing(false);
  };

  const handleLogout = () => {
    alert('Logged out!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Cover Photo */}
        <div className="relative h-24 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-t-3xl overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-b-3xl shadow-xl -mt-16 relative">
          
          {/* Avatar Section */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              
              {/* Avatar & Basic Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-100 to-emerald-100">
                    <img
                      src={profile.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        id="avatarUpload"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      <label htmlFor="avatarUpload" className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 cursor-pointer transition">
                        <Camera className="w-4 h-4" />
                      </label>
                    </>
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-500 mb-2">@{profile.username}</p>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profile.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-6 py-2.5 text-red-600 border-2 border-red-600 rounded-full hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full hover:from-emerald-600 hover:to-emerald-700 transition shadow-lg"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 text-gray-700 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {isEditing ? (
              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["firstName","lastName","username","gender","email","location"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                      {field === "gender" ? (
                        <select
                          name={field}
                          value={profile[field as keyof typeof profile]}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                          <option>Prefer not to say</option>
                        </select>
                      ) : (
                        <input
                          type={field === "email" ? "email" : "text"}
                          name={field}
                          value={profile[field as keyof typeof profile]}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {/* Bio Section */}
                <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-blue-600" />
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["firstName","lastName","username","gender"].map((field) => (
                    <div key={field} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <span className="text-sm text-gray-500 font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
                      <p className="text-gray-800 font-semibold mt-1">{profile[field as keyof typeof profile]}</p>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">42</p>
                    <p className="text-sm text-gray-500 mt-1">Countries Visited</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">128</p>
                    <p className="text-sm text-gray-500 mt-1">Photos Shared</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">15</p>
                    <p className="text-sm text-gray-500 mt-1">Favorites</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
