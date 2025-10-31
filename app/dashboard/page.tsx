import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import ProfileManagement from '@/components/ProfileManagement'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
          <p className="text-gray-600 mb-8">
            Welcome! Your user_id is stored in your profile and ready to be used for other features.
          </p>
          <ProfileManagement userId={session.user.id} />
        </div>
      </div>
    </div>
  )
}

