<script lang="ts">
    import { onMount } from 'svelte';
    import type { AuthSession } from '@supabase/supabase-js';

    export let session: AuthSession;    
</script>

<div class="m-16">Hello World</div>
