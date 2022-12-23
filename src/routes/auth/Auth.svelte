<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import logo from '$lib/assets/reflections_logo.webp';

	let loading = false;
	let email: string;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithOtp({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<img class="mx-auto h-12 w-auto rounded-full" src={logo} alt="Your Company" />
		<h1 class="mt-3 text-center text-4xl font-bold tracking-normal text-gray-50">
			ReflectIOns
		</h1>
	</div>

	<div class="mt-24 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<form class="space-y-6" on:submit|preventDefault={handleLogin}>
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
				</div>
				<div>
					<button
						type="submit"
						disabled={loading}
						class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>{loading ? 'Loading...' : 'Sign in'}</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
