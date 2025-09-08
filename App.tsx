import React, { useState, useCallback, useMemo, useRef } from 'react';
import { UserProfile, WeeklyPlan, CompletionStatus } from './types';
import ProfileForm from './components/ProfileForm';
import PlanDisplay from './components/PlanDisplay';
import ProgressTracker from './components/ProgressTracker';
import BodyPartWorkoutGenerator from './components/BodyPartWorkoutGenerator';
import { generatePlan } from './services/geminiService';
import { FitnessIcon } from './components/icons/FitnessIcon';
import ApiKeyModal from './components/ApiKeyModal';

type GeneratorMode = 'weekly' | 'bodyPart';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem('gemini-api-key'));
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus>({});
  const [generatorMode, setGeneratorMode] = useState<GeneratorMode>('weekly');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleApiKeySubmit = (key: string) => {
    sessionStorage.setItem('gemini-api-key', key);
    setApiKey(key);
  };

  const handleApiKeyInvalid = useCallback(() => {
    sessionStorage.removeItem('gemini-api-key');
    setApiKey(null);
  }, []);

  const handleProfileSubmit = useCallback(async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setWeeklyPlan(null);
    setUserProfile(profile);
    setCompletionStatus({});
    try {
      const plan = await generatePlan(profile);
      setWeeklyPlan(plan);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred. Please try again.';
      if (errorMessage.toLowerCase().includes('api key')) {
        handleApiKeyInvalid();
      } else {
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiKeyInvalid]);

  const handleToggleCompletion = useCallback((dayIndex: number, itemType: 'exercise' | 'meal', itemIndex: number) => {
    const key = `${dayIndex}-${itemType}-${itemIndex}`;
    setCompletionStatus(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);
  
  const handleReset = useCallback(() => {
    setUserProfile(null);
    setWeeklyPlan(null);
    setError(null);
    setIsLoading(false);
    setCompletionStatus({});
  }, []);

  const handleSavePlan = useCallback(() => {
    if (!weeklyPlan || !userProfile) return;

    const jsonString = JSON.stringify({userProfile, weeklyPlan}, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness-plan-${userProfile.goal.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [weeklyPlan, userProfile]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("File content is not valid text.");
        }
        const data = JSON.parse(text);
        if (data.userProfile && data.weeklyPlan) {
          setUserProfile(data.userProfile);
          setWeeklyPlan(data.weeklyPlan);
          setCompletionStatus({});
          setError(null);
          setGeneratorMode('weekly'); // Switch to weekly plan view on successful import
        } else {
          throw new Error("Invalid plan file format.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to read or parse the plan file.");
      }
    };
    reader.onerror = () => {
        setError("Error reading the selected file.");
    };
    reader.readAsText(file);
    // Reset file input value to allow re-uploading the same file
    event.target.value = '';
  };


  const progressData = useMemo(() => {
    if (!weeklyPlan) return { weeklyProgress: [], streak: 0, rewards: [] };

    const weeklyProgress = weeklyPlan.days.map((day, dayIndex) => {
      const totalExercises = day.workoutPlan.warmUp.length + day.workoutPlan.workout.length + day.workoutPlan.coolDown.length;
      const completedExercises = [
        ...day.workoutPlan.warmUp.map((_, i) => completionStatus[`${dayIndex}-exercise-${i}`]),
        ...day.workoutPlan.workout.map((_, i) => completionStatus[`${dayIndex}-exercise-${day.workoutPlan.warmUp.length + i}`]),
        ...day.workoutPlan.coolDown.map((_, i) => completionStatus[`${dayIndex}-exercise-${day.workoutPlan.warmUp.length + day.workoutPlan.workout.length + i}`])
      ].filter(Boolean).length;
      return { name: `Day ${dayIndex + 1}`, completed: completedExercises, total: totalExercises };
    });

    let streak = 0;
    let currentStreak = 0;
    for (let i = 0; i < weeklyProgress.length; i++) {
        if (weeklyProgress[i].completed > 0 && weeklyProgress[i].completed === weeklyProgress[i].total) {
            currentStreak++;
        } else {
            if (currentStreak > streak) {
                streak = currentStreak;
            }
            currentStreak = 0;
        }
    }
    if (currentStreak > streak) {
      streak = currentStreak;
    }
    
    let activeStreak = 0;
    for (let i = 0; i < weeklyProgress.length; i++) {
        const day = weeklyProgress[i];
        if (day.completed === day.total && day.total > 0) {
            activeStreak++;
        } else {
            break; 
        }
    }


    const rewards = [];
    if(activeStreak >= 3) rewards.push("🔥 3-Day Streak!");
    if(activeStreak >= 5) rewards.push("⭐ Completed 5 days workout streak");
    if(activeStreak >= 7) rewards.push("🏆 Full Week Champion!");

    return { weeklyProgress, streak: activeStreak, rewards };
  }, [weeklyPlan, completionStatus]);

  const hasPlan = weeklyPlan && userProfile;

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      {!apiKey ? (
        <ApiKeyModal onSubmit={handleApiKeySubmit} />
      ) : (
        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <FitnessIcon className="h-10 w-10 text-emerald-400" />
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                AI Fitness Planner
              </h1>
            </div>
            {(
              <div className="flex items-center gap-3">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                  <button
                      onClick={handleImportClick}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                      aria-label="Import a saved plan"
                  >
                      Import Plan
                  </button>
                  {hasPlan && (
                      <button
                          onClick={handleSavePlan}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                      >
                          Save Plan
                      </button>
                  )}
                  <button
                      onClick={handleReset}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                      Start Over
                  </button>
              </div>
            )}
          </header>

          <main>
            {!hasPlan && !isLoading && (
              <div>
                <div className="flex justify-center mb-8 gap-2 p-1 bg-slate-800 rounded-lg max-w-sm mx-auto">
                    <button onClick={() => setGeneratorMode('weekly')} className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${generatorMode === 'weekly' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700'}`}>Weekly Plan</button>
                    <button onClick={() => setGeneratorMode('bodyPart')} className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${generatorMode === 'bodyPart' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700'}`}>Single Day Workout</button>
                </div>
                {generatorMode === 'weekly' ? <ProfileForm onSubmit={handleProfileSubmit} /> : <BodyPartWorkoutGenerator onApiKeyInvalid={handleApiKeyInvalid} />}
              </div>
            )}
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-emerald-500"></div>
                <p className="mt-6 text-xl text-emerald-300">Generating your personalized plan...</p>
                <p className="mt-2 text-sm text-gray-400">This might take a moment. Great things are coming!</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative text-center" role="alert">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {hasPlan && !isLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <PlanDisplay 
                    plan={weeklyPlan} 
                    completionStatus={completionStatus} 
                    onToggleCompletion={handleToggleCompletion}
                  />
                </div>
                <div className="lg:col-span-1">
                  <ProgressTracker 
                    profile={userProfile}
                    progressData={progressData.weeklyProgress}
                    streak={progressData.streak}
                    rewards={progressData.rewards}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
