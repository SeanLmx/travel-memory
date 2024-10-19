import { useState } from 'react' // Import useState hook from react for state management
import { AppState, Alert, StyleSheet, View } from 'react-native' // Import AppState and Alert from react-native for app state management and alert messages
import { supabase } from '../lib/supabase' // Import supabase for authentication management
import { Button, Input } from '@rneui/themed'

// Listen for changes in the app state to manage auto-refresh of authentication tokens
AppState.addEventListener('change', (state) => {
  // If the app is active, start auto-refresh of authentication tokens
  if (state === 'active') {
    supabase.auth.startAutoRefresh() // Start auto-refresh of authentication tokens when the app is active
  } 
  // If the app is not active, stop auto-refresh of authentication tokens
  else {
    supabase.auth.stopAutoRefresh() // Stop auto-refresh of authentication tokens when the app is not active
  }
})

export default function Auth() {
    const [email, setEmail] = useState('') // State for email input
    const [password, setPassword] = useState('') // State for password input
    const [loading, setLoading] = useState(false) // State for loading indicator

    // Function to sign in with email
    async function signInWithEmail() {
        setLoading(true) // Set loading to true to indicate the start of the sign-in process
        const { error } = await supabase.auth.signInWithPassword({
            email: email, // Use the email state for sign-in
            password: password, // Use the password state for sign-in
        })

        if (error) {
            Alert.alert(error.message) // Show an alert with the error message if sign-in fails
        }

        setLoading(false) // Set loading to false to indicate the end of the sign-in process
    }

    async function signUpWithEmail() {
        setLoading(true) // Set loading to true to indicate the start of the sign-up process
        const { data: { session }, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            Alert.alert(error.message) // Show an alert with the error message if sign-up fails
        }

        if (!session) {
            Alert.alert('Check your email for the confirmation link') // Show an alert with a message to check email for confirmation link
        }

        setLoading(false) // Set loading to false to indicate the end of the sign-up process
    }

    return (
        <View style={styles.container}>
            {/* Email input field */}
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                />
            </View>
            {/* Password input field */}
            <View style={styles.verticallySpaced}>
                <Input
                    label="Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    textContentType="password"
                    autoCapitalize="none"
                    placeholder="Password"
                />
            </View>
            {/* Sign in button */}
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()}/>
            </View>
            {/* Sign up button */}
            <View style={styles.verticallySpaced}>
                <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()}/>
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