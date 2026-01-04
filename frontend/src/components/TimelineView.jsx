import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import MilestoneCard from './MilestoneCard';

const TimelineView = ({ roadmap, progress, onMilestoneComplete }) => {
    const [expandedPhases, setExpandedPhases] = useState([0]); // First phase expanded by default

    if (!roadmap || !roadmap.roadmap) {
        return null;
    }

    const phases = roadmap.roadmap;
    const completedCount = progress?.completed_phases || 0;

    const togglePhase = (index) => {
        setExpandedPhases((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const getPhaseStatus = (index) => {
        if (index < completedCount) return 'completed';
        if (index === completedCount) return 'current';
        return 'upcoming';
    };

    const getPhaseStyles = (status) => {
        switch (status) {
            case 'completed':
                return {
                    border: 'border-green-300 dark:border-green-600',
                    bg: 'bg-green-50 dark:bg-green-500/10',
                    icon: 'bg-green-500 text-white',
                };
            case 'current':
                return {
                    border: 'border-indigo-300 dark:border-indigo-600',
                    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
                    icon: 'bg-indigo-500 text-white pulse-glow',
                };
            default:
                return {
                    border: 'border-gray-200 dark:border-zinc-700',
                    bg: 'bg-white dark:bg-zinc-800',
                    icon: 'bg-gray-300 dark:bg-zinc-700 text-gray-600 dark:text-gray-400',
                };
        }
    };

    const getDifficultyBadge = (difficulty) => {
        const badges = {
            beginner: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
            intermediate: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
            advanced: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
        };
        return badges[difficulty?.toLowerCase()] || badges.beginner;
    };

    return (
        <div className="space-y-6">
            {/* Timeline Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Learning Timeline
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {completedCount} of {phases.length} phases completed
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical Line - stops before last phase */}
                <div className="absolute left-6 top-0 w-0.5 bg-gray-200 dark:bg-zinc-700" style={{ height: 'calc(100% - 3rem)' }} />

                {/* Phases */}
                <div className="space-y-6">
                    {phases.map((phase, index) => {
                        const status = getPhaseStatus(index);
                        const styles = getPhaseStyles(status);
                        const isExpanded = expandedPhases.includes(index);

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="relative pl-12 sm:pl-14 md:pl-16"
                            >
                                {/* Timeline Icon */}
                                <div className={`absolute left-3 top-3 w-6 h-6 rounded-full ${styles.icon} flex items-center justify-center`}>
                                    {status === 'completed' ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                    ) : status === 'current' ? (
                                        <Circle className="w-4 h-4 fill-current" />
                                    ) : (
                                        <span className="text-xs font-bold">{index + 1}</span>
                                    )}
                                </div>

                                {/* Phase Card */}
                                <div
                                    className={`rounded-xl border-2 ${styles.border} ${styles.bg} overflow-hidden transition-all duration-300`}
                                >
                                    {/* Phase Header */}
                                    <button
                                        onClick={() => togglePhase(index)}
                                        className="w-full p-3 sm:p-4 md:p-5 text-left hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {phase.phase || phase.phase_name}
                                                    </h4>
                                                    {phase.difficulty && (
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getDifficultyBadge(
                                                                phase.difficulty
                                                            )}`}
                                                        >
                                                            {phase.difficulty}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{phase.duration}</span>
                                                    </div>
                                                    {phase.focus_skills && (
                                                        <span>
                                                            {phase.focus_skills.slice(0, 3).join(', ')}
                                                            {phase.focus_skills.length > 3 && ' ...'}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Prerequisites */}
                                                {phase.prerequisites && phase.prerequisites.length > 0 && (
                                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">Prerequisites: </span>
                                                        {phase.prerequisites.join(', ')}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </button>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-t border-gray-200 dark:border-zinc-700"
                                        >
                                            <div className="p-5 space-y-4">
                                                {/* Outcomes */}
                                                {phase.outcomes && phase.outcomes.length > 0 && (
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                            Learning Outcomes
                                                        </h5>
                                                        <ul className="space-y-1">
                                                            {phase.outcomes.map((outcome, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                                                    <span>{outcome}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Milestones */}
                                                {phase.milestones && phase.milestones.length > 0 && (
                                                    <div>
                                                        <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                                                            Milestones
                                                        </h5>
                                                        <div className="space-y-3">
                                                            {phase.milestones.map((milestone, mIdx) => (
                                                                <MilestoneCard
                                                                    key={mIdx}
                                                                    milestone={milestone}
                                                                    phaseIndex={index}
                                                                    milestoneIndex={mIdx}
                                                                    onComplete={onMilestoneComplete}
                                                                    isCompleted={status === 'completed'}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TimelineView;
