import * as SecureStore from 'expo-secure-store'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key)
  },
}

const supabaseUrl = "https://iwjnycngtfhluxibxjmd.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3am55Y25ndGZobHV4aWJ4am1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk5ODk4MTgsImV4cCI6MTk5NTU2NTgxOH0.90phy6l_GPfDt8_3nHFZmEnQqN6PMDke_o_LRW2YpN4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})