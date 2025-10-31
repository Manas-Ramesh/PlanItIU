'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface Profile {
  id: string
  user_id: string
  email: string | null
  full_name: string | null
  created_at: string
  updated_at: string
}

export default function ProfileManagement({ userId }: { userId: string }) {
  const { signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error

      if (data) {
        setProfile(data)
        setFullName(data.full_name || '')
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!profile) return

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('user_id', userId)

      if (error) throw error

      await fetchProfile()
      setEditing(false)
    } catch (error: any) {
      console.error('Error updating profile:', error.message)
      alert('Failed to update profile: ' + error.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return <div className="text-gray-600">Loading profile...</div>
  }

  if (!profile) {
    return <div className="text-red-600">Profile not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded font-mono">
              {profile.user_id}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              This user_id is stored in your profile and can be used for other tables/features.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{profile.email || 'Not set'}</p>
          </div>

          {editing ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setFullName(profile.full_name || '')
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{profile.full_name || 'Not set'}</p>
              <button
                onClick={() => setEditing(true)}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
              >
                Edit
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Created At</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(profile.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

