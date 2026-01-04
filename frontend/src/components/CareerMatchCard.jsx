import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Award, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import DecisionInsightsModal from './DecisionInsightsModal';

const CareerMatchCard = ({ careerDecision, onViewInsights }) => {
    const [showModal, setShowModal] = useState(false);

    if (!careerDecision) {
        return null;
    }

    const {
        career,
        confidence = 0,
        skill_match_percentage = 0,
        market_readiness = 0,
        industry_demand = 'stable',
    } = careerDecision;

    // Get demand color and icon
    const getDemandStyles = (demand) => {
        switch (demand) {
            case 'trending':
                return {
                    color: 'text-green-600 dark:text-green-400',
                    bg: 'bg-green-100 dark:bg-green-500/20',
                    label: 'High Demand',
                };
            case 'stable':
                return {
                    color: 'text-blue-600 dark:text-blue-400',
                    bg: 'bg-blue-100 dark:bg-blue-500/20',
                    label: 'Stable',
                };
            default:
                return {
                    color: 'text-gray-600 dark:text-gray-400',
                    bg: 'bg-gray-100 dark:bg-gray-500/20',
                    label: 'Emerging',
                };
        }
    };

    const demandStyles = getDemandStyles(industry_demand);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <Card className="glass-card premium-card border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Gradient Background Accent */}
                    <div className="absolute inset-0 gradient-career opacity-5"></div>

                    <CardContent className="relative p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* Left Section - Career Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                                        <Briefcase className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Recommended Career Path
                                        </p>
                                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                            {career}
                                        </h2>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                                    {/* Confidence */}
                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                AI Confidence
                                            </p>
                                        </div>
                                        <div className="relative h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${confidence}%` }}
                                                transition={{ duration: 1, delay: 0.3 }}
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                            />
                                        </div>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                                            {confidence}%
                                        </p>
                                    </div>

                                    {/* Skill Match */}
                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                Skill Match
                                            </p>
                                        </div>
                                        <div className="relative h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill_match_percentage}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                            />
                                        </div>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                                            {skill_match_percentage}%
                                        </p>
                                    </div>

                                    {/* Market Readiness */}
                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                Job Ready
                                            </p>
                                        </div>
                                        <div className="relative h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${market_readiness}%` }}
                                                transition={{ duration: 1, delay: 0.7 }}
                                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                            />
                                        </div>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                                            {market_readiness}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section - Actions */}
                            <div className="flex flex-col items-center gap-4">
                                {/* Industry Demand Badge */}
                                <div className={`${demandStyles.bg} px-6 py-3 rounded-full`}>
                                    <p className={`text-sm font-bold ${demandStyles.color} flex items-center gap-2`}>
                                        <TrendingUp className="w-4 h-4" />
                                        {demandStyles.label}
                                    </p>
                                </div>

                                {/* View Insights Button */}
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                >
                                    <span>Why This Career?</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Decision Insights Modal */}
            <DecisionInsightsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                careerDecision={careerDecision}
            />
        </>
    );
};

export default CareerMatchCard;
