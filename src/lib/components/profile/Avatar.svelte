<script lang="ts">
    import logo from '$lib/assets/reflections_logo.webp';
    import { supabase } from '$lib/supabaseClient';

    export let url: string | null;

    let constructedUrl: string | null;

    async function downloadImage(url: string) {
        const { data, error } = await supabase.storage.from('avatars').download(url);
        if (error) {
            throw error;
        }

        constructedUrl = URL.createObjectURL(data);
    }

    $: if (url) {
        downloadImage(url);
    } else {
        constructedUrl = null;
    }
</script>

{#if constructedUrl}
    <img class="inline-block h-10 w-10 rounded-full" src={constructedUrl} alt="" />
{:else}
    <img class="inline-block h-10 w-10 rounded-full" src={logo} alt="" />
{/if}
