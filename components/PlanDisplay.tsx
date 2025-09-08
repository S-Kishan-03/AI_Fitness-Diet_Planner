import React, { useState } from 'react';
import type { WeeklyPlan, CompletionStatus, Exercise } from '../types';
import WorkoutCard from './WorkoutCard';
import DietCard from './DietCard';
import { FitnessIcon } from './icons/FitnessIcon';
import { FoodIcon } from './icons/FoodIcon';
import ExerciseTimerModal from './ExerciseTimerModal';

interface PlanDisplayProps {
  plan: WeeklyPlan;
  completionStatus: CompletionStatus;
  onToggleCompletion: (dayIndex: number, itemType: 'exercise' | 'meal', itemIndex: number) => void;
}

const DayTab: React.FC<{ day: number; active: boolean; onClick: () => void }> = ({ day, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-t-lg transition-colors duration-300 focus:outline-none whitespace-nowrap ${
        active
          ? 'bg-slate-700 text-emerald-400 border-b-2 border-emerald-400'
          : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
      }`}
    >
      Day {day + 1}
    </button>
  );

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, completionStatus, onToggleCompletion }) => {
  const [activeDay, setActiveDay] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const dailyPlan = plan.days[activeDay];

  const allExercises = [
    ...dailyPlan.workoutPlan.warmUp.map(e => ({...e, type: 'Warm-up'})),
    ...dailyPlan.workoutPlan.workout.map(e => ({...e, type: 'Workout'})),
    ...dailyPlan.workoutPlan.coolDown.map(e => ({...e, type: 'Cool-down'})),
  ];

  const handleToggle = (itemType: 'exercise' | 'meal', itemIndex: number) => {
    onToggleCompletion(activeDay, itemType, itemIndex);
  };
  
  const allMeals = [
      { mealType: 'Breakfast', ...dailyPlan.dietPlan.breakfast },
      { mealType: 'Mid-Meal', ...dailyPlan.dietPlan.midMeal },
      { mealType: 'Lunch', ...dailyPlan.dietPlan.lunch },
      { mealType: 'Snack', ...dailyPlan.dietPlan.snack },
      { mealType: 'Dinner', ...dailyPlan.dietPlan.dinner },
  ];

  return (
    <>
      <div className="bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="flex border-b border-slate-600 mb-6 overflow-x-auto">
          {plan.days.map((_, index) => (
            <DayTab key={index} day={index} active={index === activeDay} onClick={() => setActiveDay(index)} />
          ))}
        </div>

        <div className="space-y-8">
          {/* Motivational and Hydration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="font-semibold text-emerald-400">💡 Motivational Tip</p>
                  <p className="text-gray-300">{dailyPlan.motivationalTip}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="font-semibold text-sky-400">💧 Hydration Reminder</p>
                  <p className="text-gray-300">{dailyPlan.hydrationReminder}</p>
              </div>
          </div>

          {/* Workout Plan */}
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2 mb-4 text-emerald-400"><FitnessIcon /> Workout Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {allExercises.map((exercise, index) => (
                  <WorkoutCard
                      key={`${activeDay}-${index}`}
                      exercise={exercise}
                      exerciseType={exercise.type}
                      isChecked={!!completionStatus[`${activeDay}-exercise-${index}`]}
                      onToggle={() => handleToggle('exercise', index)}
                      onSelect={() => setSelectedExercise(exercise)}
                  />
              ))}
            </div>
          </div>

          {/* Diet Plan */}
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2 mb-4 text-orange-400"><FoodIcon /> Diet Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {allMeals.map((meal, index) => (
                  <DietCard
                      key={`${activeDay}-${index}`}
                      meal={meal}
                      mealType={meal.mealType}
                      isChecked={!!completionStatus[`${activeDay}-meal-${index}`]}
                      onToggle={() => handleToggle('meal', index)}
                  />
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedExercise && (
        <ExerciseTimerModal
            exercise={selectedExercise}
            isOpen={!!selectedExercise}
            onClose={() => setSelectedExercise(null)}
        />
      )}
    </>
  );
};

export default PlanDisplay;
