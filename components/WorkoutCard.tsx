import React from 'react';
import type { Exercise } from '../types';

interface WorkoutCardProps {
  exercise: Exercise;
  exerciseType: string;
  isChecked: boolean;
  onToggle: () => void;
  onSelect: () => void;
}

const IntensityBadge: React.FC<{ intensity: string }> = ({ intensity }) => {
    const colorClasses = {
        Beginner: 'bg-green-500/20 text-green-300',
        Intermediate: 'bg-yellow-500/20 text-yellow-300',
        Advanced: 'bg-red-500/20 text-red-300'
    }[intensity] || 'bg-gray-500/20 text-gray-300';

    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>{intensity}</span>
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ exercise, exerciseType, isChecked, onToggle, onSelect }) => {

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <div 
      className={`bg-slate-700/50 rounded-xl shadow-md p-4 transition-all duration-300 ${isChecked ? 'opacity-50' : 'opacity-100'} cursor-pointer group transform hover:scale-105`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Open timer for ${exercise.name}`}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs uppercase tracking-wide text-emerald-400 font-bold">{exerciseType}</p>
                <h4 className={`text-lg font-semibold text-white mt-1 ${isChecked ? 'line-through' : ''}`}>{exercise.name}</h4>
            </div>
            <div 
                className="p-2 -mr-2 -mt-2" // Increase clickable area
                onClick={handleCheckboxClick}
                role="button"
                aria-label={`Mark ${exercise.name} as complete`}
            >
                <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="form-checkbox h-6 w-6 bg-slate-600 border-slate-500 text-emerald-500 rounded focus:ring-emerald-500 cursor-pointer pointer-events-none"
                />
            </div>
        </div>
        <p className="mt-2 text-gray-300">{exercise.repsOrDuration}</p>
        <div className="mt-4">
            <IntensityBadge intensity={exercise.intensity} />
        </div>
    </div>
  );
};

export default WorkoutCard;
