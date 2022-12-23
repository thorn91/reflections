import { supabase } from '$lib/supabaseClient';
import type { Database } from '$lib/types/supabase';

export async function getProfileByUserId(userId: string) {
    const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (!data || error && status !== 406) {
        throw error;
    }

    return data;
}

export function mustUpdateProfile(profile: Profile) {
    return !profile?.username;
}

export type Profile = Database['public']['Tables']['profiles']['Row'];