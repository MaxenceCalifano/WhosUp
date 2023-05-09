import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: Request) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const SUPABASE_URL = "https://iwjnycngtfhluxibxjmd.supabase.co";
    const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3am55Y25ndGZobHV4aWJ4am1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3OTk4OTgxOCwiZXhwIjoxOTk1NTY1ODE4fQ.kQvDw-X-Wg1ODuqRuGEwRp71xZ2ezoa1wrFBiDcVgd0";

    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      SUPABASE_URL,
      // Supabase API ANON KEY - env var exported by default.
      SERVICE_KEY,
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      //  { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    /*     // Now we can get the session or user object
        const {
          data: { user },
        } = await supabaseClient.auth.getUser() */

    // And we can run queries in the context of our authenticated user
    // Get parameters
    const { minimalLatitude, maximalLatitude, minimalLongitude, maximalLongitude } = await req.json()

    const getRandom = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const delta = 0.006

    const { data, error } = await supabaseClient
      .from('activities')
      .select()
      .lte("location -> latitude", maximalLatitude)
      .gte("location -> latitude", minimalLatitude)
      .lte("location -> longitude", maximalLongitude)
      .gte("location -> longitude", minimalLongitude)

    data.forEach(element => {
      element.location.latitude = getRandom(element.location.latitude - delta, element.location.latitude + delta)
      element.location.longitude = getRandom(element.location.longitude - delta, element.location.longitude + delta)
    });
    if (error) throw error
    // Prendre chacun des éléments de data et modifier latitude et longitude de manière aléatoire dans une plage comprise entre x et y

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})