import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, Zap, TrendingUp, Gauge } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const ProgressTracker = ({ progress, phases }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  if (!progress) return null;

  const { completed_phases, total_phases, streak_days, last_activity_date } = progress;
  const percentage = total_phases > 0 ? Math.round((completed_phases / total_phases) * 100) : 0;

  // Calculate learning pace
  const getLearningPace = () => {
    if (!last_activity_date) return { label: 'Just Started', color: 'blue', icon: Zap };

    const daysSinceStart = Math.max(1, Math.floor((new Date() - new Date(last_activity_date)) / (1000 * 60 * 60 * 24)));
    const phasesPerWeek = (completed_phases / daysSinceStart) * 7;

    if (phasesPerWeek >= 1.5) return { label: 'Fast', color: 'green', icon: TrendingUp };
    if (phasesPerWeek >= 0.5) return { label: 'On Track', color: 'blue', icon: Gauge };
    return { label: 'Take Your Time', color: 'orange', icon: Zap };
  };

  const pace = getLearningPace();
  const PaceIcon = pace.icon;

  // Find the first non-completed phase
  const currentPhase = phases?.find(phase => phase.status !== 'completed');
  const nextPhase = phases?.find((phase, index) => {
    const phaseIndex = phases.indexOf(currentPhase);
    return index === phaseIndex + 1;
  });

  // Trigger confetti on 100% completion
  useEffect(() => {
    if (percentage === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [percentage]);

  const getPaceColor = (color) => {
    const colors = {
      green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20',
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20',
      orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/20',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex"
        >
          <Card className="glass-card hover-lift shadow-lg border border-gray-200 dark:border-zinc-800 rounded-xl w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-900 dark:bg-white rounded-xl shadow-lg flex-shrink-0">
                  <Flame className="w-8 h-8 text-white dark:text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Current Streak</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {streak_days} Days
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex"
        >
          <Card className="glass-card hover-lift shadow-lg border border-gray-200 dark:border-zinc-800 rounded-xl w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg flex-shrink-0">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Overall Progress</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</h3>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full bg-blue-600 dark:bg-blue-500 shadow-lg"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Pace Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex"
        >
          <Card className="glass-card hover-lift shadow-lg border border-gray-200 dark:border-zinc-800 rounded-xl w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl flex-shrink-0 bg-gray-900 dark:bg-white`}>
                  <PaceIcon className="w-8 h-8 text-white dark:text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Learning Pace</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{pace.label}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Last Active Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex"
        >
          <Card className="glass-card hover-lift shadow-lg border border-gray-200 dark:border-zinc-800 rounded-xl w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-900 dark:bg-white rounded-xl shadow-lg flex-shrink-0">
                  <Calendar className="w-8 h-8 text-white dark:text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Last Active</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    {last_activity_date ? new Date(last_activity_date).toLocaleDateString() : 'Today'}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Confetti Effect on Completion */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;

