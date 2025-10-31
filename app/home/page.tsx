import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import UserHomePage from '@/components/UserHomePage'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return <UserHomePage userId={session.user.id} />
}

