import { getCurrentUserProfile } from "$lib/util/services/profile.service";
import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import type { RequestEvent } from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load<PageLoad>(event: RequestEvent) {
    const { session } = await getSupabase(event);
    const profile = await getCurrentUserProfile(session!);

    return {
        profile: profile,
    };
}
