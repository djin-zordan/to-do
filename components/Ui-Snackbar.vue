<template>
    <v-snackbar v-model="snackbar.values.active" :timeout="snackbar.values.timeout" :color="snackbar.values.color">
        <v-icon v-if="snackbar.values.icon" :icon="snackbar.values.icon"/>
        {{ snackbar.values.message }}
        <template v-slot:actions>
            <v-btn variant="text" @click="snackbar.close" text="Close" />
        </template>
    </v-snackbar>
</template>

<script>
    import { snackbar } from '../composables/Snackbar';
</script>