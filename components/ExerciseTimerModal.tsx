import React, { useState, useEffect, useMemo } from 'react';
import type { Exercise } from '../types';

const parseDurationInSeconds = (durationStr: string): number | null => {
    if (!durationStr) return null;
    const secondsMatch = durationStr.match(/(\d+)\s*sec(ond)?s?/i);
    if (secondsMatch) return parseInt(secondsMatch[1], 10);

    const minutesMatch = durationStr.match(/(\d+)\s*min(ute)?s?/i);
    if (minutesMatch) return parseInt(minutesMatch[1], 10) * 60;
    
    return null;
};

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

interface ExerciseTimerModalProps {
    exercise: Exercise;
    isOpen: boolean;
    onClose: () => void;
}

const ExerciseTimerModal: React.FC<ExerciseTimerModalProps> = ({ exercise, isOpen, onClose }) => {
    const initialDuration = useMemo(() => parseDurationInSeconds(exercise.repsOrDuration), [exercise.repsOrDuration]);
    const [timeLeft, setTimeLeft] = useState<number | null>(initialDuration);
    const [isActive, setIsActive] = useState(false);
    const [showContent, setShowContent] = useState(false);

    // Effect to handle modal fade-in animation
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setShowContent(true), 10);
            return () => {
                clearTimeout(timer);
                setShowContent(false);
            };
        }
    }, [isOpen]);

    // Reset timer state when exercise changes
    useEffect(() => {
        setTimeLeft(initialDuration);
        setIsActive(false);
    }, [exercise, initialDuration]);

    // Main timer logic
    useEffect(() => {
        if (!isActive || timeLeft === null) {
            return;
        }

        if (timeLeft <= 0) {
            setIsActive(false);
            // Play a sound when timer finishes
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // High-pitched beep
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) {
                console.error("Could not play timer sound:", e);
            }
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);
    
    const handleReset = () => {
        setIsActive(false);
        setTimeLeft(initialDuration);
    };

    if (!isOpen) return null;

    return (
        <div 
            className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="timer-modal-title"
        >
            <div 
                className={`bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden transition-all duration-300 relative ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-3 right-3 bg-slate-900/50 text-white rounded-full p-2 hover:bg-slate-900/80 transition z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <div className="p-8 text-center">
                    <h2 id="timer-modal-title" className="text-3xl font-bold text-white">{exercise.name}</h2>
                    <p className="text-lg text-emerald-400 mt-1">{exercise.repsOrDuration}</p>
                    
                    {initialDuration !== null ? (
                        <div className="my-8">
                            <p className="text-7xl font-mono font-bold text-white tracking-widest">{formatTime(timeLeft ?? 0)}</p>
                            <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4">
                                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${((timeLeft ?? 0) / initialDuration) * 100}%` }}></div>
                            </div>
                        </div>
                    ) : (
                        <div className="my-8 py-12 text-gray-400">
                            This is a rep-based exercise. No timer needed.
                        </div>
                    )}

                    {initialDuration !== null && (
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={() => setIsActive(!isActive)}
                                className={`w-32 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 duration-300 ${isActive ? 'bg-orange-600 hover:bg-orange-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                            >
                                {isActive ? 'Pause' : 'Start'}
                            </button>
                            <button 
                                onClick={handleReset}
                                className="w-32 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 duration-300"
                            >
                                Reset
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExerciseTimerModal;
