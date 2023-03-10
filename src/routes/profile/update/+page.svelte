<script lang="ts">
    import { deleteProfileAvatar, upsertProfile } from '$lib/util/services/profile.service';
    import type { PageData } from './$types';
    import { supabase } from '$lib/supabaseClient';
    import Avatar from '$lib/components/profile/Avatar.svelte';
    import { currUserProfile } from '$lib/stores';

    export let data: PageData;
    let { profile } = data;

    let files: FileList;
    let fileInput: HTMLInputElement;
    let personalErrorMsg = '';

    currUserProfile.subscribe(prof => (profile = prof));

    async function updatePublicProfile() {
        await upsertProfile(profile);
    }

    async function updatePersonalInformation() {
        personalErrorMsg = '';

        if (!profile.email || !profile.first_name || !profile.last_name) {
            personalErrorMsg = 'Please fill all out fields before saving.';
            return;
        }

        await upsertProfile(profile);
    }

    async function updateAvatar() {
        if (!files && !fileInput.files) {
            return;
        }

        if (!files && fileInput.files) {
            files = fileInput.files;
        }

        const file = files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${profile.id}.${fileExt}`;

        if (profile.avatar_url) {
            await removeAvatar();
        }

        let { error } = await supabase.storage.from('avatars').upload(filePath, file);

        if (error) {
            throw error;
        }

        profile.avatar_url = filePath;
        await updatePublicProfile();
    }

    async function removeAvatar() {
        deleteProfileAvatar(profile);
    }

    const removeErrorMsg = () => personalErrorMsg = '';
</script>

<div>
    <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
            <div class="px-4 sm:px-0">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Public Profile</h3>
            </div>
        </div>
        <div class="mt-5 md:col-span-2 md:mt-0">
            <form action="#" on:submit|preventDefault={updatePublicProfile}>
                <div class="shadow sm:overflow-hidden sm:rounded-md">
                    <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
                        <div class="grid grid-cols-3 gap-6">
                            <div class="col-span-3 sm:col-span-2">
                                <label
                                    for="company-website"
                                    class="block text-sm font-medium text-gray-700">Website</label
                                >
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <span
                                        class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"
                                        >http://</span
                                    >
                                    <input
                                        type="text"
                                        name="company-website"
                                        id="company-website"
                                        class="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="www.example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label for="about" class="block text-sm font-medium text-gray-700"
                                >About</label
                            >
                            <div class="mt-1">
                                <textarea
                                    bind:value={profile.about}
                                    id="about"
                                    name="about"
                                    rows="3"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <p class="block text-sm font-medium text-gray-700">Photo</p>
                            <div class="mt-1 flex items-center">
                                <Avatar bind:url={profile.avatar_url} />
                                <input
                                    class="hidden"
                                    id="file-to-upload"
                                    type="file"
                                    accept=".png,.jpg"
                                    on:change={updateAvatar}
                                    bind:this={fileInput}
                                    bind:files
                                />
                                <button
                                    on:click={() => fileInput.click()}
                                    type="button"
                                    class="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >Change</button
                                >
                                <button
                                    on:click={removeAvatar}
                                    type="button"
                                    class="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >Remove</button
                                >
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <button
                            type="submit"
                            class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >Save</button
                        >
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="hidden sm:block" aria-hidden="true">
    <div class="py-5">
        <div class="border-t border-gray-200" />
    </div>
</div>

<div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
            <div class="px-4 sm:px-0">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                {#if personalErrorMsg !== ''}
                    <h4 class="text-md font-medium leading-6 text-red-900">{personalErrorMsg}</h4>
                {/if}
            </div>
        </div>
        <div class="mt-5 md:col-span-2 md:mt-0">
            <form on:submit|preventDefault={updatePersonalInformation}>
                <div class="overflow-hidden shadow sm:rounded-md">
                    <div class="bg-white px-4 py-5 sm:p-6">
                        <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-6 sm:col-span-3">
                                <label
                                    for="first-name"
                                    class="block text-sm font-medium text-gray-700"
                                    >First name</label
                                >
                                <input
                                    bind:value={profile.first_name}
                                    on:change={removeErrorMsg}
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autocomplete="given-name"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div class="col-span-6 sm:col-span-3">
                                <label
                                    for="last-name"
                                    class="block text-sm font-medium text-gray-700">Last name</label
                                >
                                <input
                                    bind:value={profile.last_name}
                                    on:change={removeErrorMsg}
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    autocomplete="family-name"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div class="col-span-6 sm:col-span-4">
                                <label
                                    for="email-address"
                                    class="block text-sm font-medium text-gray-700"
                                    >Email address</label
                                >
                                <input
                                    bind:value={profile.email}
                                    on:change={removeErrorMsg}
                                    type="text"
                                    name="email-address"
                                    id="email-address"
                                    autocomplete="email"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <button
                            type="submit"
                            class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >Save</button
                        >
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="hidden sm:block" aria-hidden="true">
    <div class="py-5">
        <div class="border-t border-gray-200" />
    </div>
</div>

<div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
            <div class="px-4 sm:px-0">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                <p class="mt-1 text-sm text-gray-600">
                    Decide which communications you'd like to receive and how.
                </p>
            </div>
        </div>
        <div class="mt-5 md:col-span-2 md:mt-0">
            <form action="#" method="POST">
                <div class="overflow-hidden shadow sm:rounded-md">
                    <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
                        <fieldset>
                            <legend class="sr-only">By Email</legend>
                            <div class="text-base font-medium text-gray-900" aria-hidden="true">
                                By Email
                            </div>
                            <div class="mt-4 space-y-4">
                                <div class="flex items-start">
                                    <div class="flex h-5 items-center">
                                        <input
                                            id="comments"
                                            name="comments"
                                            type="checkbox"
                                            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div class="ml-3 text-sm">
                                        <label for="comments" class="font-medium text-gray-700"
                                            >Comments</label
                                        >
                                        <p class="text-gray-500">
                                            Get notified when someones posts a comment on a posting.
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <div class="flex h-5 items-center">
                                        <input
                                            id="candidates"
                                            name="candidates"
                                            type="checkbox"
                                            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div class="ml-3 text-sm">
                                        <label for="candidates" class="font-medium text-gray-700"
                                            >Candidates</label
                                        >
                                        <p class="text-gray-500">
                                            Get notified when a candidate applies for a job.
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-start">
                                    <div class="flex h-5 items-center">
                                        <input
                                            id="offers"
                                            name="offers"
                                            type="checkbox"
                                            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div class="ml-3 text-sm">
                                        <label for="offers" class="font-medium text-gray-700"
                                            >Offers</label
                                        >
                                        <p class="text-gray-500">
                                            Get notified when a candidate accepts or rejects an
                                            offer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend class="contents text-base font-medium text-gray-900"
                                >Push Notifications</legend
                            >
                            <p class="text-sm text-gray-500">
                                These are delivered via SMS to your mobile phone.
                            </p>
                            <div class="mt-4 space-y-4">
                                <div class="flex items-center">
                                    <input
                                        id="push-everything"
                                        name="push-notifications"
                                        type="radio"
                                        class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                        for="push-everything"
                                        class="ml-3 block text-sm font-medium text-gray-700"
                                        >Everything</label
                                    >
                                </div>
                                <div class="flex items-center">
                                    <input
                                        id="push-email"
                                        name="push-notifications"
                                        type="radio"
                                        class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                        for="push-email"
                                        class="ml-3 block text-sm font-medium text-gray-700"
                                        >Same as email</label
                                    >
                                </div>
                                <div class="flex items-center">
                                    <input
                                        id="push-nothing"
                                        name="push-notifications"
                                        type="radio"
                                        class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                        for="push-nothing"
                                        class="ml-3 block text-sm font-medium text-gray-700"
                                        >No push notifications</label
                                    >
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <button
                            type="submit"
                            class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >Save</button
                        >
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
