import { supabase } from '$lib/supabaseClient';

export async function getProfileByUserId(userId: string) {
    const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error && status !== 406) {
        throw error;
    }

    return data;
}

async function upsertProfileIfNeeded() {

}