export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  goal: 'Weight Loss' | 'Muscle Gain' | 'Maintenance' | 'Stamina' | 'Flexibility' | 'Rehab';
  healthConditions: string;
  timeAvailable: number; // minutes per day
  intensity: 'Beginner' | 'Intermediate' | 'Advanced';
  diet: 'Veg' | 'Non-Veg' | 'Vegan' | 'Eggetarian' | 'Custom';
  region: string;
}

export interface BodyPartProfile {
    bodyPart: 'Chest' | 'Back' | 'Legs' | 'Arms' | 'Shoulders' | 'Core';
    intensity: 'Beginner' | 'Intermediate' | 'Advanced';
    timeAvailable: number; // minutes
}

export interface Exercise {
  name: string;
  repsOrDuration: string;
  intensity: string;
}

export interface WorkoutPlan {
  warmUp: Exercise[];
  workout: Exercise[];
  coolDown: Exercise[];
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DietPlan {
  breakfast: Meal;
  midMeal: Meal;
  lunch: Meal;
  snack: Meal;
  dinner: Meal;
}

export interface DailyPlan {
  day: string;
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  motivationalTip: string;
  hydrationReminder: string;
}

export interface WeeklyPlan {
  days: DailyPlan[];
}

export interface CompletionStatus {
  [key: string]: boolean;
}
