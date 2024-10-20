import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import Account from '../components/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'

export default function Index() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Initialize session and set up auth state listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe()
  }, [])

  const renderContent = () => {
    if (session && session.user) {
      return <Account key={session.user.id} session={session} />
    }
    return <Auth />
  }

  return (
    <View>
      {renderContent()}
    </View>
  )
}
