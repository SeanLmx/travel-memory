// Import necessary dependencies
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'

// Define the Account component
export default function Account({ session }: { session: Session }) {
    // State variables for loading status and user profile information
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [website, setWebsite] = useState('')
    const [avatar_url, setAvatarUrl] = useState('')

    // Effect hook to fetch user profile when session changes
    useEffect(() => {
        if (session) getProfile()
    }, [session])

    // Function to fetch user profile from Supabase
    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on session')

            // Query the profiles table for the current user's data
            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', session?.user.id)
                .single()
            
            if (error && status !== 406) throw error

            // Update state with fetched profile data
            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    // Function to update user profile in Supabase
    async function updateProfile({ username, website, avatar_url }: { username: string, website: string, avatar_url: string }) {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on session')

            // Prepare the update object
            const updates = {
                id: session?.user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date(),
            }

            // Upsert the profile data
            const { error } = await supabase.from('profiles').upsert(updates)
            if (error) throw error
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    // Render the component
    return (
        <View style={styles.container}>
            {/* Email input field (non-editable) */}
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input label="Email" value={session?.user?.email}/>
            </View>
            {/* Username input field */}
            <View style={styles.verticallySpaced}>
                <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)}/>
            </View>
            {/* Website input field */}
            <View style={styles.verticallySpaced}>
                <Input label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)}/>
            </View>

            {/* Update profile button */}
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button title={loading ? 'Loading...' : 'Update'} onPress={() => updateProfile({ username, website, avatar_url })} disabled={loading}/>
            </View>

            {/* Sign out button */}
            <View style={styles.verticallySpaced}>
                <Button title="Sign Out" onPress={() => supabase.auth.signOut()}/>
            </View>
        </View>
    )
}

// Styles for the component
const styles = StyleSheet.create({
    container: {
      marginTop: 40,
      padding: 12,
    },
    verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 20,
    },
})