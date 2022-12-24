import { readable, writable } from "svelte/store";
import { supabase } from "./supabaseClient";
import type { Profile } from "./util/services/profile.service";

export const currUserProfile = writable<Profile>();