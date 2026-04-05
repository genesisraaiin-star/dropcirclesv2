'use server';

import { createClient } from '@/lib/supabase'; 
import { redirect } from 'next/navigation';

export async function setupProfile(formData: FormData) {
  const supabase = createClient();
  
  // 1. Verify the user is securely logged in
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('You must be logged in to set up your profile.');
  }

  // 2. Extract the data from your frontend form
  const name = formData.get('name') as string;
  const genre = formData.get('genre') as string;
  const city = formData.get('city') as string;

  // 3. Inject the profile into the 'artists' table
  // We use upsert() here just in case they accidentally hit the back button later
  const { error } = await supabase
    .from('artists')
    .upsert({
      user_id: user.id, // This is the crucial link to Supabase Auth!
      name: name,
      genre: genre || null, // Optional fields
      city: city || null,
    });

  if (error) {
    console.error('Failed to save profile:', error.message);
    throw new Error('Could not save your profile.');
  }

  // 4. Success! Redirect them to the Stripe "Vault is ready" screen
  // (Update this path if your Stripe connection screen is somewhere else!)
  redirect('/dashboard'); 
}