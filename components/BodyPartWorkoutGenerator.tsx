import React, { useState } from 'react';
import { BodyPartProfile, WorkoutPlan, Exercise } from '../types';
import { generateBodyPartWorkout } from '../services/geminiService';
import WorkoutCard from './WorkoutCard';
import ExerciseTimerModal from './ExerciseTimerModal';
import { FitnessIcon } from './icons/FitnessIcon';

interface BodyPartWorkoutGeneratorProps {
    onApiKeyInvalid: () => void;
}

const BodyPartWorkoutGenerator: React.FC<BodyPartWorkoutGeneratorProps> = ({ onApiKeyInvalid }) => {
    const [profile, setProfile] = useState<BodyPartProfile>({
        bodyPart: 'Chest',
        intensity: 'Intermediate',
        timeAvailable: 60,
    });
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: name === 'timeAvailable' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setWorkoutPlan(null);
        try {
            const plan = await generateBodyPartWorkout(profile);
            setWorkoutPlan(plan);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            if (errorMessage.toLowerCase().includes('api key')) {
                onApiKeyInvalid();
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const allExercises = workoutPlan ? [
        ...workoutPlan.warmUp.map(e => ({...e, type: 'Warm-up'})),
        ...workoutPlan.workout.map(e => ({...e, type: 'Workout'})),
        ...workoutPlan.coolDown.map(e => ({...e, type: 'Cool-down'})),
    ] : [];

    const formOptions = {
        bodyPart: ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'],
        intensity: ['Beginner', 'Intermediate', 'Advanced'],
    };

    return (
        <>
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-2 text-emerald-400">Single Day Workout</h2>
                <p className="text-center text-gray-400 mb-8">Generate a focused workout for a specific body part.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Body Part */}
                        <div>
                            <label htmlFor="bodyPart" className="block text-sm font-medium text-gray-300 mb-2">Body Part</label>
                            <select name="bodyPart" id="bodyPart" value={profile.bodyPart} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition">
                                {formOptions.bodyPart.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        {/* Intensity */}
                        <div>
                            <label htmlFor="intensity" className="block text-sm font-medium text-gray-300 mb-2">Intensity</label>
                            <select name="intensity" id="intensity" value={profile.intensity} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition">
                                {formOptions.intensity.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        {/* Time */}
                        <div>
                            <label htmlFor="timeAvailable" className="block text-sm font-medium text-gray-300 mb-2">Time (minutes)</label>
                            <input type="number" name="timeAvailable" id="timeAvailable" value={profile.timeAvailable} onChange={handleChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" required min="15" max="120" />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 duration-300">
                        Generate Workout
                    </button>
                </form>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center mt-10">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-emerald-500"></div>
                    <p className="mt-6 text-lg text-emerald-300">Generating your workout...</p>
                </div>
            )}

            {error && (
                <div className="mt-8 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative text-center max-w-3xl mx-auto" role="alert">
                    <strong className="font-bold">Oops! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {workoutPlan && !isLoading && (
                <div className="mt-10 max-w-5xl mx-auto">
                    <h3 className="text-3xl font-bold flex items-center gap-3 mb-6 text-emerald-400 justify-center">
                        <FitnessIcon /> Your {profile.bodyPart} Workout Plan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {allExercises.map((exercise, index) => (
                            <WorkoutCard
                                key={`${exercise.name}-${index}`}
                                exercise={exercise}
                                exerciseType={exercise.type}
                                isChecked={false} // Completion not tracked for single day workouts
                                onToggle={() => {}} // No-op
                                onSelect={() => setSelectedExercise(exercise)}
                            />
                        ))}
                    </div>
                </div>
            )}
            
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

export default BodyPartWorkoutGenerator;
