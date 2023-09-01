import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const supabaseUrl = 
const supabaseAnonKey = 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
