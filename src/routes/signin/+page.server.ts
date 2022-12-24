import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, fail } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';
import type { Actions } from '@sveltejs/kit';

export const authActions: Actions = {
    default: async (event) => {
        const { request, cookies, url } = event;
        const { session, supabaseClient } = await getSupabase(event);
        const formData = await request.formData();

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            if (error instanceof AuthApiError && error.status === 400) {
                return fail(400, {
                    error: 'Invalid credentials.',
                    values: {
                        email
                    }
                });
            }
            return fail(500, {
                error: 'Server error. Try again later.',
                values: {
                    email
                }
            });
        }

        throw redirect(303, '/');
    },
};