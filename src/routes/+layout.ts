import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Session, User } from '@supabase/supabase-js';
import { getCurrentUserProfile, getProfileByUserId } from '$lib/util/services/profile.service';
import type { Profile } from '$lib/util/services/profile.service';
import { redirect } from '@sveltejs/kit';

export const load: LayoutLoad = async (event) => {
    const { session } = await getSupabase(event);
    let profile: Profile | undefined = undefined;

    if (session) {
        profile = await getCurrentUserProfile(session);
    }

    return {
        session,
        profile,
    };
};
