
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserProfile } from '../types';
import { TrophyIcon } from './icons/TrophyIcon';

interface ProgressTrackerProps {
  profile: UserProfile;
  progressData: { name: string; completed: number; total: number }[];
  streak: number;
  rewards: string[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ profile, progressData, streak, rewards }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg space-y-6 sticky top-8">
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">Your Progress</h3>
        <p className="text-gray-400">Keep up the great work!</p>
      </div>

      {/* User Profile Summary */}
      <div className="bg-slate-900/50 p-4 rounded-lg">
        <h4 className="font-semibold text-lg text-emerald-400 mb-2">Client Profile</h4>
        <div className="text-sm space-y-1 text-gray-300">
            <p><strong>Goal:</strong> {profile.goal}</p>
            <p><strong>Intensity:</strong> {profile.intensity}</p>
            <p><strong>Diet:</strong> {profile.diet}</p>
        </div>
      </div>

      {/* Rewards */}
      {rewards.length > 0 && (
         <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
            <h4 className="font-semibold text-lg text-yellow-300 mb-2 flex items-center gap-2"><TrophyIcon /> Rewards</h4>
            <ul className="list-disc list-inside space-y-1 text-yellow-200">
                {rewards.map((reward, index) => <li key={index}>{reward}</li>)}
            </ul>
        </div>
      )}

      {/* Streak Counter */}
      <div className="text-center bg-slate-700/50 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">CURRENT STREAK</p>
        <p className="text-5xl font-bold text-emerald-400">{streak} <span className="text-3xl">Days 🔥</span></p>
      </div>
      
      {/* Workouts Completed Chart */}
      <div>
        <h4 className="font-semibold text-lg text-white mb-4">Workouts Completed This Week</h4>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={progressData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}
                cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
              />
              <Legend wrapperStyle={{fontSize: "14px"}} />
              <Bar dataKey="completed" fill="#10b981" name="Completed Workouts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
