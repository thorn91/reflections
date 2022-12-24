import { supabase } from '$lib/supabaseClient';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad, RequestEvent } from './$types';
import type { Database } from '$lib/types/supabase';
import { getProfileByUserId } from '$lib/util/services/profile.service';

export async function load<PageLoad>(event: RequestEvent) {
    const { session } = await getSupabase(event);

    if (!session) {
        throw redirect(301, '/login');
    }

    const profile = await getProfileByUserId(session?.user?.id!);
}
