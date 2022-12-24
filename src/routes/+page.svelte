<script>
	import { page } from '$app/stores';
	import Auth from '../lib/components/auth/Auth.svelte';
	import Dashboard from './dashboard/Dashboard.svelte';
</script>

<svelte:head>
	<title>Reflections</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	<Auth />
{:else}
	<Dashboard session={$page.data.session} />
{/if}
