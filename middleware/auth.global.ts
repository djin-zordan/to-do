import { createClient } from '@supabase/supabase-js';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const runtimeConfig = useRuntimeConfig();
    const supabase = createClient(runtimeConfig.public.supabaseURL, runtimeConfig.public.supabaseKey);
    const { data: { user } } = await supabase.auth.getUser();

    if(to.path !== "/" && user?.aud !== "authenticated") return navigateTo("/");
})