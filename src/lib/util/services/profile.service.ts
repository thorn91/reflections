import { page } from '$app/stores';
import { currUserProfile } from '$lib/stores';
import { supabase } from '$lib/supabaseClient';
import type { Database } from '$lib/types/supabase';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { get } from 'svelte/store';

export async function getCurrentUserProfile() {
    let profile = get(currUserProfile);

    if (profile) {
        return profile;
    }

    const { user } = (await supabase.auth.getUser()).data;

    if (user === null) {
        throw new Error('User not found for current session');
    }

    profile = await getProfileByUserId(user.id);
    currUserProfile.set(profile);
    return profile;
}

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

export async function upsertProfile(profile: Profile) {
    const { data, error, status } = await supabase
        .from('profiles')
        .upsert(profile);

    if (!data || status !== 201) {
        throw error;
    }

    return data;
}

export function mustUpdateProfile(profile: Profile) {
    return !profile.created_at || !profile?.username;
}

export type Profile = Database['public']['Tables']['profiles']['Row'];