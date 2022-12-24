import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';
import { getUserFromSession } from '$lib/util/services/user.service';

export const load: LayoutServerLoad = async (event) => {
    const session = await getServerSession(event);
    
    return {
        session: session,
    };
};

export type LayoutLoadData = {
    session: Session,
}