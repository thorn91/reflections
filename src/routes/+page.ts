import { supabase } from '$lib/supabaseClient';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad, RequestEvent } from './$types';
import type { Database } from '$lib/types/supabase';
import { getCurrentUserProfile, getProfileByUserId, mustUpdateProfile } from '$lib/util/services/profile.service';
import { currUser } from '$lib/stores';

/**
 * If the user is logged in but does not have a complete profile, we will need to redirect 
 * them to update it.
 */
export async function load<PageLoad>(event: RequestEvent) {
    const { session } = await getSupabase(event);

    if (!session) {
        throw redirect(302, '/1');
    }

    const profile = await getProfileByUserId(session.user.id);

    if (mustUpdateProfile(profile)) {
        throw redirect(301, '/profile/update');
    }
}
