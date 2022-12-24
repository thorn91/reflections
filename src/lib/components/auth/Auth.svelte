<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import logo from '$lib/assets/reflections_logo.webp';
    import { redirect } from '@sveltejs/kit';
    import { goto } from '$app/navigation';
    import { getCurrentUserProfile } from '$lib/util/services/profile.service';
    import type { Session } from '@supabase/supabase-js';
    import { isAlreadySignedUp } from '$lib/util/services/user.service';

    let isLoading = false;
    let isSigningUp = true;
    let hasSentPasswordRecovery = false;

    let email: string;
    let firstname: string;
    let lastname: string;
    let password: string;

    const handleMagicLinkLogin = async () => {
        try {
            isLoading = true;
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            alert('Check your email for the login link!');
            goto('/signin', { replaceState: true, invalidateAll: true });
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            isLoading = false;
        }
    };

    const handleUsernamePasswordLogin = async () => {
        try {
            isLoading = true;
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            goto('/signin', { replaceState: true, invalidateAll: true });
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            isLoading = false;
        }
    };

    const handleUsernamePasswordSignUp = async () => {
        try {
            const isEmailSignedUp = await isAlreadySignedUp(email);

            if (isEmailSignedUp) {
                alert('Email already exists, please sign in');
                isSigningUp = false;
                return;
            }

            isLoading = true;
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            alert('Check your email for the authentication link!');
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            isLoading = false;
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            return;
        }

        try {
            isLoading = true;
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            hasSentPasswordRecovery = true;
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            isLoading = false;
        }
    };

    function setIsSigningIn() {
        isSigningUp = false;
        isLoading = false;
    }

    function setIsSigningUp() {
        isSigningUp = true;
        isLoading = false;
    }
</script>

<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img
            class="mx-auto h-12 w-auto rounded-full border-gray-800 border-2 border-solid"
            src={logo}
            alt="Your Company"
        />
        <h1 class="mt-3 text-center text-4xl font-bold tracking-normal text-gray-800">
            ReflectIOns
        </h1>
    </div>

    <div id="formContainer" class="mt-24 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-between text-lg mb-4 text-gray-800">
            <h1
                on:click={setIsSigningUp}
                on:keydown={setIsSigningUp}
                class={isSigningUp ? 'text-indigo-600 underline underline-offset-4' : ''}
            >
                Sign up
            </h1>
            <h1
                on:click={setIsSigningIn}
                on:keydown={setIsSigningIn}
                class={!isSigningUp ? 'text-indigo-600 underline underline-offset-4' : ''}
            >
                Sign in
            </h1>
        </div>
        <div class="bg-gray-300 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {#if isSigningUp}
                <form class="space-y-6" on:submit|preventDefault={handleUsernamePasswordSignUp}>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700"
                            >Email address</label
                        >
                        <div class="mt-1">
                            <input
                                bind:value={email}
                                id="email"
                                name="email"
                                type="email"
                                autocomplete="email"
                                required
                                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div class="flex justify-between mt-3 text-sm font-medium text-gray-700">
                            <label for="email" class="block">Password</label>
                        </div>
                        <div class="mt-1">
                            <input
                                bind:value={password}
                                id="password"
                                name="password"
                                type="password"
                                autocomplete="password"
                                required
                                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >{isLoading ? 'Loading...' : 'Sign up'}</button
                        >
                    </div>
                </form>
            {:else}
                <form class="space-y-6" on:submit|preventDefault={handleUsernamePasswordLogin}>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700"
                            >Email address</label
                        >
                        <div class="mt-1">
                            <input
                                bind:value={email}
                                id="email"
                                name="email"
                                type="email"
                                autocomplete="email"
                                required
                                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div class="flex justify-between mt-3 text-sm font-medium text-gray-700">
                            <label for="email" class="block">Password</label>
                            <button
                                on:click|preventDefault={handleResetPassword}
                                class="text-xs place-self-end hover:text-indigo-500 hover:cursor-pointer"
                                >reset password</button
                            >
                        </div>
                        <div class="mt-1">
                            <input
                                bind:value={password}
                                id="password"
                                name="password"
                                type="password"
                                autocomplete="password"
                                required
                                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >{isLoading ? 'Loading...' : 'Sign in'}</button
                        >
                    </div>
                </form>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    #formContainer {
        div:first-child > h1 {
            @apply hover:text-indigo-500 cursor-pointer;
        }
    }
</style>
