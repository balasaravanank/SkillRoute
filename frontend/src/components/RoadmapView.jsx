import { useState } from 'react'
import axios from 'axios'
import { auth } from '../firebase'
import ProgressTracker from './ProgressTracker'
import { CheckCircle2, Circle, RefreshCw, Sparkles, RotateCcw } from 'lucide-react'
import { Card, CardContent } from './ui/card'

const RoadmapView = ({ roadmap, onGenerate, onRefresh, onReset, loading }) => {
  const [updating, setUpdating] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const handlePhaseToggle = async (index, currentStatus) => {
    setUpdating(true)
    try {
      const token = await auth.currentUser.getIdToken()
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'

      await axios.post(`${API_URL}/api/progress/update`, {
        phase_index: index,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      onRefresh()
    } catch (error) {
      console.error('Error updating progress:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleAdaptRoadmap = async () => {
    setUpdating(true)
    try {
      const token = await auth.currentUser.getIdToken()
      await axios.post(`${API_URL}/api/progress/adapt`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onRefresh()
    } catch (error) {
      console.error('Error adapting roadmap:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-2xl border-dashed border-2 shadow-none bg-gray-50/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardContent className="flex flex-col items-center text-center py-16 px-4">
            <div className="mb-6 p-4 bg-white dark:bg-zinc-800 rounded-full shadow-sm dark:shadow-none">
              <Sparkles className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Generate a personalized career roadmap tailored to your skills, interests, and goals. We'll create a step-by-step plan just for you.
            </p>
            <button
              onClick={onGenerate}
              disabled={loading}
              className="inline-flex items-center px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium shadow-lg dark:shadow-white/10"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Your Roadmap...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Roadmap
                </>
              )}
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Progress Tracker */}
      {roadmap.progress && (
        <ProgressTracker
          progress={roadmap.progress}
          phases={roadmap.learning_roadmap?.roadmap}
        />
      )}

      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Career Roadmap
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Personalized path to achieve your career goals
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAdaptRoadmap}
            disabled={updating || loading}
            className="inline-flex items-center px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all disabled:opacity-50 text-sm font-medium shadow-md dark:shadow-white/10"
          >
            {updating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Adapt Roadmap
          </button>

          {onReset && (
            <button
              onClick={onReset}
              disabled={loading}
              className="inline-flex items-center px-5 py-2.5 bg-red-600 dark:bg-red-500 text-white rounded-full hover:bg-red-700 dark:hover:bg-red-600 transition-all disabled:opacity-50 text-sm font-medium shadow-md"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Career Path
            </button>
          )}
        </div>
      </div>

      {/* Career Decision Card */}
      {roadmap.career_decision && (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-900 border-2 border-indigo-100 dark:border-zinc-700 rounded-2xl p-8 shadow-lg dark:shadow-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 dark:bg-zinc-800 rounded-full -mr-32 -mt-32 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200 dark:bg-zinc-800 rounded-full -ml-24 -mb-24 opacity-20"></div>

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                🎯 Recommended Career Path
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-300">
                {roadmap.career_decision.confidence}% Match
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {roadmap.career_decision.career}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {roadmap.career_decision.reasoning}
            </p>
          </div>
        </div>
      )}

      {/* Learning Roadmap */}
      {roadmap.learning_roadmap && roadmap.learning_roadmap.roadmap && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">📚 Learning Path</h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-full border dark:border-zinc-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{roadmap.learning_roadmap.duration_months} months</span>
            </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-300 dark:bg-zinc-700"></div>

            <div className="space-y-6">
              {roadmap.learning_roadmap.roadmap.map((phase, index) => {
                const isCompleted = phase.status === 'completed';
                return (
                  <div
                    key={index}
                    className={`relative flex gap-6 group ${isCompleted ? 'opacity-75' : ''}`}
                  >
                    {/* Timeline node */}
                    <div className="relative z-10 flex-shrink-0">
                      <button
                        onClick={() => handlePhaseToggle(index, phase.status)}
                        disabled={updating}
                        className={`flex items-center justify-center h-16 w-16 rounded-full font-bold text-xl shadow-lg transition-all transform hover:scale-110 ${isCompleted
                          ? 'bg-green-500 dark:bg-green-600 text-white'
                          : 'bg-indigo-600 dark:bg-indigo-500 text-white'
                          }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : index + 1}
                      </button>
                    </div>

                    {/* Content card */}
                    <div className={`flex-1 bg-white dark:bg-zinc-900 border-2 rounded-2xl p-6 shadow-md dark:shadow-none transition-all ${isCompleted
                      ? 'border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-950/20'
                      : 'border-gray-200 dark:border-zinc-700 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600'
                      }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className={`text-xl font-bold ${isCompleted ? 'text-green-900 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                            {phase.phase}
                          </h4>
                          {isCompleted && (
                            <span className="px-2 py-0.5 rounded-full bg-green-200 dark:bg-green-800/50 text-green-800 dark:text-green-300 text-xs font-bold uppercase">
                              Completed
                            </span>
                          )}
                        </div>
                        {phase.duration && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white border dark:border-zinc-700">
                            {phase.duration}
                          </span>
                        )}
                      </div>

                      {phase.focus_skills && phase.focus_skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            Focus Skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {phase.focus_skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-zinc-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {phase.outcomes && phase.outcomes.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Learning Outcomes
                          </p>
                          <ul className="space-y-2">
                            {phase.outcomes.map((outcome, idx) => (
                              <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                                <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {outcome}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoadmapView
