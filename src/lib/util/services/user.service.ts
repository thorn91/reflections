import { supabase } from "$lib/supabaseClient";

export async function isAlreadySignedUp(email: string) {
    const { data, error, status } = await supabase
        .from('profiles')
        .select('*', { count: "exact" })
        .eq('email', email);

    if (!data || error && status !== 200) {
        throw error;
    }

    return data?.length > 0;
}