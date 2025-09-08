import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WeeklyPlan, BodyPartProfile, WorkoutPlan } from '../types';

const getAiClient = () => {
    const apiKey = sessionStorage.getItem('gemini-api-key');
    if (!apiKey) {
        throw new Error("API key not found. Please provide your Gemini API key.");
    }
    return new GoogleGenAI({ apiKey });
};

const exerciseSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        repsOrDuration: { type: Type.STRING },
        intensity: { type: Type.STRING },
    },
    required: ["name", "repsOrDuration", "intensity"]
};

const workoutPlanSchema = {
    type: Type.OBJECT,
    properties: {
        warmUp: { type: Type.ARRAY, items: exerciseSchema },
        workout: { type: Type.ARRAY, items: exerciseSchema },
        coolDown: { type: Type.ARRAY, items: exerciseSchema }
    },
    required: ["warmUp", "workout", "coolDown"]
};


const fullPlanSchema = {
    type: Type.OBJECT,
    properties: {
        days: {
            type: Type.ARRAY,
            description: "A list of 7 daily plans for the week.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "The day of the week (e.g., 'Day 1')." },
                    workoutPlan: workoutPlanSchema,
                    dietPlan: {
                        type: Type.OBJECT,
                        properties: {
                            breakfast: {
                                type: Type.OBJECT,
                                properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER } },
                                required: ["name", "calories", "protein", "carbs", "fats"]
                            },
                            midMeal: {
                                type: Type.OBJECT,
                                properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER } },
                                required: ["name", "calories", "protein", "carbs", "fats"]
                            },
                            lunch: {
                                type: Type.OBJECT,
                                properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER } },
                                required: ["name", "calories", "protein", "carbs", "fats"]
                            },
                            snack: {
                                type: Type.OBJECT,
                                properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER } },
                                required: ["name", "calories", "protein", "carbs", "fats"]
                            },
                            dinner: {
                                type: Type.OBJECT,
                                properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER } },
                                required: ["name", "calories", "protein", "carbs", "fats"]
                            }
                        },
                        required: ["breakfast", "midMeal", "lunch", "snack", "dinner"]
                    },
                    motivationalTip: { type: Type.STRING },
                    hydrationReminder: { type: Type.STRING }
                },
                required: ["day", "workoutPlan", "dietPlan", "motivationalTip", "hydrationReminder"]
            }
        }
    },
    required: ["days"]
};

export const generatePlan = async (profile: UserProfile): Promise<WeeklyPlan> => {
    const ai = getAiClient();
    const prompt = `
        You are an expert trainer and dietician.
        Based on the client’s profile below, generate a personalized 7-day fitness and diet plan.

        Client Profile:
        - Age: ${profile.age}
        - Gender: ${profile.gender}
        - Fitness Goal: ${profile.goal}
        - Health Conditions: ${profile.healthConditions || 'None'}
        - Available Workout Time: ${profile.timeAvailable} minutes per day
        - Intensity Level: ${profile.intensity}
        - Dietary Preference: ${profile.diet}
        - Client's Region for Diet Plan: ${profile.region}

        The plan must include:
        1. A daily workout schedule for 7 days, broken into Warm-up, Workout, and Cool-down. Each exercise needs a name, repetitions/duration (e.g., '12 reps', '30 seconds'), and an intensity tag.
        2. A daily diet plan for 7 days, with meal-wise breakdown (Breakfast, Mid-meal, Lunch, Snack, Dinner), tailored to the client's region. Include nutrition values (Calories, Protein, Carbs, Fats) for each meal.
        3. A unique motivational tip and a hydration reminder for each day.

        The response must be a single JSON object that strictly follows the provided schema. Do not include any introductory text or markdown formatting.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: fullPlanSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const planData = JSON.parse(jsonText);
        
        if (!planData.days || !Array.isArray(planData.days) || planData.days.length === 0) {
            throw new Error("Invalid plan structure received from API.");
        }

        return planData as WeeklyPlan;

    } catch (error) {
        console.error("Error generating plan with Gemini:", error);
        if (error instanceof Error && error.message.toLowerCase().includes('api key')) {
            throw new Error("Your Gemini API key appears to be invalid or has expired.");
        }
        throw new Error("Failed to generate a valid plan from the AI. Please check your inputs and try again.");
    }
};

export const generateBodyPartWorkout = async (profile: BodyPartProfile): Promise<WorkoutPlan> => {
    const ai = getAiClient();
    const prompt = `
        You are an expert gym trainer.
        Generate a single-day, gym-style workout plan based on the following client preferences.
        The workout should be structured with a suitable warm-up, a main workout, and a cool-down.

        Client Preferences:
        - Target Body Part: ${profile.bodyPart}
        - Intensity Level: ${profile.intensity}
        - Available Workout Time: ${profile.timeAvailable} minutes

        Instructions:
        - The main workout should consist of 4-6 exercises that effectively target the specified body part.
        - Include a brief, dynamic warm-up (2-3 exercises) and a static cool-down (2-3 exercises).
        - For each exercise, provide a name, repetitions/duration (e.g., '3 sets of 12 reps', '30 seconds'), and an intensity tag ('Beginner', 'Intermediate', or 'Advanced').
        - Ensure the total workout duration fits within the client's available time.

        The response must be a single JSON object that strictly follows the provided schema. Do not include any introductory text or markdown formatting.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: workoutPlanSchema,
            },
        });
        const jsonText = response.text.trim();
        const planData = JSON.parse(jsonText);

        if (!planData.warmUp || !planData.workout || !planData.coolDown) {
            throw new Error("Invalid workout plan structure received from API.");
        }

        return planData as WorkoutPlan;

    } catch (error) {
        console.error("Error generating body part workout:", error);
        if (error instanceof Error && error.message.toLowerCase().includes('api key')) {
            throw new Error("Your Gemini API key appears to be invalid or has expired.");
        }
        throw new Error("Failed to generate a valid workout from the AI. Please try again.");
    }
}
