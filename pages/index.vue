<template>
    <v-container class="bg-light-blue-lighten-5 h-screen d-flex align-center" fluid>
        <v-row justify="center">
            <v-col cols="10" class="rounded elevation-2 pa-0">
                <v-list class="rounded pa-10">
                    <v-window v-model="step">
                        <v-window-item value="signin">
                            <v-list-item class="d-flex direction-column align-center justify-center">
                                <v-card title="Welcome back" subtitle="Please enter your details" class="text-center"/>
                                </v-list-item>
                                <v-list-item>
                                    <v-form @submit.prevent @submit="signIn">
                                        <v-text-field
                                            label="Email"
                                            type="email"
                                            variant="outlined"
                                            class="pt-3"
                                            prepend-inner-icon="mdi-email"
                                            v-model="user.email"
                                            :rules="[userType.test('email', user.email)]"/>
                                        
                                        <v-text-field
                                            label="Password"
                                            type="password"
                                            variant="outlined"
                                            class="pt-3"
                                            prepend-inner-icon="mdi-lock"
                                            v-model="user.password"
                                            :rules="[userType.test('password', user.password)]"/>
                                        
                                        <v-btn variant="tonal" type="submit" text="Login" color="secondary" block/>
                                    </v-form>
                                </v-list-item>
                                <v-list-item>
                                    <v-card>
                                        <v-card-actions>
                                            <v-card-text>
                                                Don't have an account yet?
                                            </v-card-text>
                                            <v-btn color="primary" text="Sign up" @click="changeScreen('signup')"/>
                                        </v-card-actions>
                                    </v-card>
                                </v-list-item>
                        </v-window-item>
                        <v-scale-transition hide-on-leave>
                            <v-window-item value="signup">
                                <v-list-item class="d-flex direction-column align-center justify-center">
                                    <v-card title="Nice to meet you" subtitle="Please enter your details" class="text-center"/>
                                </v-list-item>
                                <v-list-item>
                                    <v-form @submit.prevent @submit="signUp">
                                        <v-text-field
                                            label="Email"
                                            type="email"
                                            variant="outlined"
                                            class="pt-3"
                                            prepend-inner-icon="mdi-email"
                                            v-model="user.email"
                                            :rules="[userType.test('email', user.email)]"/>
                                        
                                        <v-text-field
                                            label="Password"
                                            type="password"
                                            variant="outlined"
                                            class="pt-3"
                                            prepend-inner-icon="mdi-lock"
                                            v-model="user.password"
                                            :rules="[userType.test('password', user.password)]"/>
                                        
                                        <v-btn variant="tonal" type="submit" text="Sign up" color="secondary" block/>
                                    </v-form>
                                </v-list-item>
                                <v-list-item>
                                    <v-card>
                                        <v-card-actions>
                                            <v-card-text>
                                                Already have an account?
                                            </v-card-text>
                                            <v-btn color="primary" text="Login" @click="changeScreen('signin')"/>
                                        </v-card-actions>
                                    </v-card>
                                </v-list-item>
                            </v-window-item>
                        </v-scale-transition>
                    </v-window>
                </v-list>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
    import { createClient } from '@supabase/supabase-js';
    import { userType  } from '../interfaces/User';
    import { z } from 'zod';
    import { snackbar } from '../composables/Snackbar';

    const step = ref<string>("singin");
    const runtimeConfig = useRuntimeConfig()
    const supabase = createClient(runtimeConfig.public.supabaseURL, runtimeConfig.public.supabaseKey)
    const user = ref<z.infer<typeof userType.class>>({email: "", password: ""});

    async function signIn() {
        if(userType.validate(user.value)){
            const { data, error } = await supabase.auth.signInWithPassword({
                email: user.value.email,
                password: user.value.password,
            })
    
            if (error) snackbar.setValues("Incorrect user or password", "error", "mdi-close");
            navigateTo("/list");
        }
    }
    
    async function signUp() {
        if(userType.validate(user.value)){
            const { data, error } = await supabase.auth.signUp({
                email: user.value.email,
                password: user.value.password,
            })
            
            if (error) snackbar.setValues("Failed to connect to server", "error", "mdi-close");
            navigateTo("/list");
        }
    }

    function changeScreen(screen: string) {
        step.value = screen;
        user.value.email = "";
        user.value.password = "";
    }

</script>

<style>
    .v-card-title {
        font-size: 2rem;
        font-weight: bold;
    }
    .v-card-subtitle {
        font-size: 1.1rem
    }
</style>