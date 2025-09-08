import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit }) => {
  const [profile, setProfile] = useState<UserProfile>({
    age: 30,
    gender: 'Male',
    goal: 'Weight Loss',
    healthConditions: '',
    timeAvailable: 45,
    intensity: 'Beginner',
    diet: 'Non-Veg',
    region: 'Indian',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'timeAvailable' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };
  
  const formOptions = {
    gender: ['Male', 'Female', 'Other'],
    goal: ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Stamina', 'Flexibility', 'Rehab'],
    intensity: ['Beginner', 'Intermediate', 'Advanced'],
    diet: ['Veg', 'Non-Veg', 'Vegan', 'Eggetarian', 'Custom']
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2 text-emerald-400">Create Your Profile</h2>
      <p className="text-center text-gray-400 mb-8">Tell us about yourself to generate a personalized plan.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">Age</label>
            <input type="number" name="age" id="age" value={profile.age} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" required min="12" max="100" />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
            <select name="gender" id="gender" value={profile.gender} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition">
              {formOptions.gender.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Fitness Goal */}
          <div className="md:col-span-2">
            <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-2">Primary Fitness Goal</label>
            <select name="goal" id="goal" value={profile.goal} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition">
              {formOptions.goal.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          
          {/* Health Conditions */}
          <div className="md:col-span-2">
            <label htmlFor="healthConditions" className="block text-sm font-medium text-gray-300 mb-2">Health Conditions (e.g., diabetes, injury)</label>
            <input type="text" name="healthConditions" id="healthConditions" value={profile.healthConditions} onChange={handleChange} placeholder="Optional, e.g., 'Knee Injury'" className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" />
          </div>

          {/* Time Available */}
          <div>
            <label htmlFor="timeAvailable" className="block text-sm font-medium text-gray-300 mb-2">Time per Day (minutes)</label>
            <input type="number" name="timeAvailable" id="timeAvailable" value={profile.timeAvailable} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" required min="10" max="180" />
          </div>
          
          {/* Intensity Level */}
          <div>
            <label htmlFor="intensity" className="block text-sm font-medium text-gray-300 mb-2">Intensity Level</label>
            <select name="intensity" id="intensity" value={profile.intensity} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition">
              {formOptions.intensity.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Dietary Preference */}
          <div>
            <label htmlFor="diet" className="block text-sm font-medium text-gray-300 mb-2">Dietary Preference</label>
            <select name="diet" id="diet" value={profile.diet} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition">
              {formOptions.diet.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

           {/* Cuisine Region */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-2">Cuisine Region</label>
            <input type="text" name="region" id="region" value={profile.region} onChange={handleChange} placeholder="e.g., 'Indian', 'Mediterranean'" className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" required />
          </div>
        </div>

        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 duration-300">
          Generate My Plan
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;