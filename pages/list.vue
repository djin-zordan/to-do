<template>
    <v-container class="h-screen d-flex align-center">
        <v-row justify="center">
            <v-col cols="10" sm="6" class="rounded elevation-2 pa-0">
                <v-card variant="tonal" color="primary" class="rounded-b-0 text-h1 d-flex align-center justify-space-between" text="To-do list">
                    <v-card-actions>
                        <v-menu v-model="menu" :close-on-content-click="false" location="start">

                            <template v-slot:activator="{ props }">
                                <v-btn icon="mdi-plus" v-bind="props"/>
                            </template>

                            <v-card :min-width="300">
                                <v-form @submit.prevent @submit="addNew" ref="form">

                                    <v-list>
                                        <v-list-item>
                                            <v-text-field
                                                v-model="newTask"
                                                label="Task"
                                                variant="outlined"
                                                class="mt-2"
                                                :rules="[taskType.test('task', newTask)]"
                                                placeholder="Do the laundry"
                                            />
                                        </v-list-item>
                                    </v-list>
    
                                    <v-card-actions class="mb-3">
                                        <v-spacer/>
    
                                        <v-btn variant="text" @click="cancel" text="Cancel"/>
                                        <v-btn color="primary" variant="text" type="submit" text="Add"/>
                                    </v-card-actions>
                                </v-form>

                            </v-card>
                        </v-menu>
                    </v-card-actions>
                </v-card>
                <v-list :max-height="300" class="overflow-auto pa-0">
                    <v-list-item v-if="list?.length == 0">
                        <v-card class="w-100" text="Without tasks!"/>
                    </v-list-item>
                    <v-list-item v-for="item in list" class="ma-0 pa-0">
                        <todo-item :task="item" @show-snackbar="" @delete-item="updateList"></todo-item>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
    import { taskType } from "../interfaces/Task";
    import { useTasks } from "../composables/UseTasks";
    import { z } from "zod";
    import { snackbar } from "../composables/Snackbar";
    
    const list = ref<Array<z.infer<typeof taskType.class>>>();
    const useTask = await useTasks()
    
    onMounted (async () => {
        updateList();
    })

    const menu = ref<boolean>(false);
    const newTask = ref<string>("");

    function cancel() {
        menu.value = false;
        newTask.value = "";
    }

    async function addNew () {
        if(taskType.validate(newTask.value)) {
            const error = await useTask.perform.insert({task: newTask.value});
    
            if (error) {
                console.log(error)
                snackbar.setValues("Failed to add", "error", "mdi-close");
            } else {
                snackbar.setValues("Added successfully", "success", "mdi-done");
                updateList();
                cancel();
            }
        }
    }

    async function updateList() {
        const response = await useTask.perform.select();
        list.value = response as z.infer<typeof taskType.class>[];
    }
</script>