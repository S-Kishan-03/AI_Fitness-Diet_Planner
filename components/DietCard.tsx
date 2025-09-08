
import React from 'react';
import type { Meal } from '../types';

interface DietCardProps {
  meal: Meal;
  mealType: string;
  isChecked: boolean;
  onToggle: () => void;
}

const DietCard: React.FC<DietCardProps> = ({ meal, mealType, isChecked, onToggle }) => {
  return (
    <div className={`bg-slate-700/50 rounded-xl shadow-md p-4 transition-all duration-300 flex flex-col justify-between ${isChecked ? 'opacity-50' : 'opacity-100'}`}>
      <div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wide text-orange-400 font-bold">{mealType}</p>
            <h4 className={`text-lg font-semibold text-white mt-1 ${isChecked ? 'line-through' : ''}`}>{meal.name}</h4>
          </div>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={onToggle}
            className="form-checkbox h-6 w-6 bg-slate-600 border-slate-500 text-orange-500 rounded focus:ring-orange-500 cursor-pointer"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p className="text-gray-400">Calories: <span className="font-semibold text-gray-200">{meal.calories} kcal</span></p>
            <p className="text-gray-400">Protein: <span className="font-semibold text-gray-200">{meal.protein} g</span></p>
            <p className="text-gray-400">Carbs: <span className="font-semibold text-gray-200">{meal.carbs} g</span></p>
            <p className="text-gray-400">Fats: <span className="font-semibold text-gray-200">{meal.fats} g</span></p>
        </div>
      </div>
    </div>
  );
};

export default DietCard;
