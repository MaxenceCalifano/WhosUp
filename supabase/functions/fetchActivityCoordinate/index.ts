import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: Request) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const SUPABASE_URL = "https://iwjnycngtfhluxibxjmd.supabase.co";
    const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3am55Y25ndGZobHV4aWJ4am1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk5ODk4MTgsImV4cCI6MTk5NTU2NTgxOH0.90phy6l_GPfDt8_3nHFZmEnQqN6PMDke_o_LRW2YpN4";

    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      SUPABASE_URL,
      // Supabase API ANON KEY - env var exported by default.
      SERVICE_KEY,
      // Create client with Auth context of the user that called the function.
      // This way row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    // And we can run queries in the context of our authenticated user
    // Get parameters
    const { activityId } = await req.json()

    const getRandom = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }
    // How much we'll modify the coords
    const delta = 0.006

    const { data, error } = await supabaseClient
      .from('activities')
      .select(`*,
              applicants(user_id, is_validated)`)
      .eq('uid', activityId)

    if (data) {

      //Check if the user is an applicant
      const isUserIsApplicant = data[0].applicants.filter(elem => elem.user_id === user.id)
      console.log("🚀 ~ file: index.ts:44 ~ serve ~ isUserIsApplicant:", isUserIsApplicant)
      if (isUserIsApplicant.length > 0) {
        if (!isUserIsApplicant[0].is_validated) {
          //User is not validated
          data[0].location.latitude = getRandom(data[0].location.latitude - delta, data[0].location.latitude + delta)
          data[0].location.longitude = getRandom(data[0].location.longitude - delta, data[0].location.longitude + delta)
        }
      }
      if (isUserIsApplicant.length === 0) {
        //User has not ask to participate
        data[0].location.latitude = getRandom(data[0].location.latitude - delta, data[0].location.latitude + delta)
        data[0].location.longitude = getRandom(data[0].location.longitude - delta, data[0].location.longitude + delta)
      }


      // Est ce que l'utilisateur a demandé à participer ? Si oui, est-il validé, et donc autorisé à voir les coord ?
      // Est ce qu'il est dans le tableau des applicants ? s'il y est pas ont donne les coords obfusqué
      // S'il y est, est-il validé ? Si oui on donne les coord, si non on donne les coord obfusqués
    }

    if (error) throw error

    return new Response(JSON.stringify({ data: data[0].location }), {
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