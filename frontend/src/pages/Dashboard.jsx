import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import RoadmapView from '../components/RoadmapView'
import CareerMatchCard from '../components/CareerMatchCard'
import AdaptiveRecommendations from '../components/AdaptiveRecommendations';
import TimelineView from '../components/TimelineView'
import { FloatingHeader } from '../components/ui/floating-header'
import axios from 'axios'

const Dashboard = () => {
  const [profile, setProfile] = useState(null)
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showTimeline, setShowTimeline] = useState(true)
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    loadProfile()
    loadRoadmap()
  }, [])

  const loadProfile = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await axios.get(`${API_URL}/api/students/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data && !response.data.message) {
        setProfile(response.data)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const loadRoadmap = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await axios.get(`${API_URL}/api/career/roadmap`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data && !response.data.message) {
        setRoadmap(response.data)
      }
    } catch (error) {
      console.error('Error loading roadmap:', error)
    }
  }

  const generateRoadmap = async () => {
    if (!profile) {
      navigate('/profile')
      return
    }

    setLoading(true)
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await axios.post(`${API_URL}/api/career/roadmap`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRoadmap(response.data)
    } catch (error) {
      console.error('Error generating roadmap:', error)
      alert('Failed to generate roadmap')
    } finally {
      setLoading(false)
    }
  }

  const resetCareerPath = async () => {
    const confirmed = window.confirm(
      '⚠️ Are you sure you want to reset your career path?\n\n' +
      'This will:\n' +
      '• Delete your current roadmap\n' +
      '• Reset your progress to 0%\n' +
      '• Clear your streak\n\n' +
      'Your profile will be saved and you can generate a new roadmap immediately.'
    )

    if (!confirmed) return

    setLoading(true)
    try {
      const token = await auth.currentUser.getIdToken()
      await axios.delete(`${API_URL}/api/career/roadmap`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Clear roadmap state
      setRoadmap(null)

      // Show success message
      alert('✅ Career path reset successfully! You can now generate a new roadmap.')
    } catch (error) {
      console.error('Error resetting career path:', error)
      alert('❌ Failed to reset career path. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-black dark:via-zinc-900 dark:to-black">
      <FloatingHeader
        onLogout={handleLogout}
        userName={profile?.name}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Show Career Match Card if we have a decision */}
        {roadmap?.career_decision && (
          <CareerMatchCard careerDecision={roadmap.career_decision} />
        )}

        {/* Adaptive Recommendations */}
        {roadmap?.progress && roadmap?.learning_roadmap && (
          <AdaptiveRecommendations
            progress={roadmap.progress}
            roadmap={roadmap.learning_roadmap}
          />
        )}

        {/* Main Content Card */}
        <div className="glass-card rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-zinc-800">
          {/* Toggle View Button */}
          {roadmap?.learning_roadmap && (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors font-medium"
              >
                {showTimeline ? 'Show Classic View' : 'Show Timeline View'}
              </button>
            </div>
          )}

          {/* Conditional Rendering based on view */}
          {showTimeline && roadmap?.learning_roadmap ? (
            <TimelineView
              roadmap={roadmap.learning_roadmap}
              progress={roadmap.progress}
            />
          ) : (
            <RoadmapView
              roadmap={roadmap}
              onGenerate={generateRoadmap}
              onRefresh={loadRoadmap}
              onReset={resetCareerPath}
              loading={loading}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard

