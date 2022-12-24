import { page } from '$app/stores';
import { currUserProfile } from '$lib/stores';
import { supabase } from '$lib/supabaseClient';
import type { Database } from '$lib/types/supabase';
import type { RequestEvent } from '.svelte-kit/types/src/routes/$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';
import type { LoadEvent, ServerLoad, ServerLoadEvent } from '@sveltejs/kit';
import { get } from 'svelte/store';

export async function getCurrentUserProfile(session: Session) {
    let profile = get(currUserProfile);

    if (profile) {
        return profile;
    }

    const user = session.user;

    profile = await getProfileByUserId(user.id);
    setCurrentProfileStore(profile);
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
    setCurrentProfileStore(data);
    return data;
}

export async function upsertProfile(profile: Profile) {
    const { data, error, status } = await supabase
        .from('profiles')
        .upsert(profile)
        .eq('id', profile.id)
        .select();

    if (error && status !== 201) {
        throw error;
    }
    setCurrentProfileStore(profile);
    return data;
}

export async function deleteProfileAvatar(profile: Profile) {
    if (!profile.avatar_url) {
        return profile;
    }

    const { data, error } = await supabase.storage.from('avatars').remove([profile.avatar_url]);
    if (error) throw error;

    profile.avatar_url = '';
    upsertProfile(profile);
    return profile;
}

export function mustUpdateProfile(profile: Profile) {
    return !profile || !profile.created_at || !profile?.username;
}

const setCurrentProfileStore = (profile: Profile) => currUserProfile.set(profile);

export type Profile = Database['public']['Tables']['profiles']['Row'];