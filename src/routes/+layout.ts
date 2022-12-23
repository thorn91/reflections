import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';

export const load: LayoutLoad = async (event) => {
    const { session } = await getSupabase(event);
    return { 
        session 
    };
};

export type LayoutLoadData = {
    session: Session,
}