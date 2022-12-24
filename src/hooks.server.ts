import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import '$lib/supabaseClient';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const handle: Handle = async ({ event, resolve }) => {
    const { session } = await getSupabase(event);

    if (!session) {
        redirect(301, '/login');
    }

    return resolve(event);
};