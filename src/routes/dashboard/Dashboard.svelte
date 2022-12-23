<script lang="ts">
	import { onMount } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';
	import { getProfileByUserId } from '$lib/util/account.service';

	export let session: AuthSession;

	const user = session.user;
	let loading = false;

	onMount(async () => {
		await loadProfile();
	});

	async function loadProfile() {
        loading = true;
		try {
			const data = await getProfileByUserId(user.id);
		} catch (error) {
			console.error(error);
		} finally {
            loading = false;
        }
	}
</script>
<div class="m-16">Hello World</div>
