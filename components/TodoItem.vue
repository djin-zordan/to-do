<template>
    <v-card class="w-100 d-flex justify-space-between align-center" elevation="0">                           
        <v-card-text :class="{'text-decoration-line-through': task.isDone, 'text-grey-lighten-1': task.isDone}">
            {{task.task}}
        </v-card-text>

        <v-card-actions>
            <v-checkbox label="Done" @click="updateStatus" v-model="task.isDone" hide-details :class="{'text-grey-lighten-1': task.isDone}" />
            
            <v-dialog fullscreen :scrim="false" transition="dialog-bottom-transition" v-model="editDialog">
                <template v-slot:activator="{ props }">
                    <v-btn color="info" v-bind="props" icon="mdi-pencil" elevation="0"/>
                </template>

                <v-card>
                    <v-form @submit.prevent @submit="updateTask">
                        <v-toolbar dark color="primary">
                            <v-btn icon="mdi-close" dark @click="cancel" />
                            <v-toolbar-title>Edit Task</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-items>
                                <v-btn variant="text" type="submit">
                                    Save
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>
                        
                        <v-list>
                            <v-list-item>
                                <v-text-field
                                    v-model="editedTask"
                                    label="Task"
                                    variant="outlined"
                                    class="mt-2"
                                    :rules="[taskType.test('task', editedTask)]"
                                />
                            </v-list-item>
                        </v-list>
                    </v-form>
                </v-card>
            </v-dialog>

            <v-btn class="ma-0 pa-0" color="error" icon="mdi-delete" @click="deleteDialog = true"/>
        </v-card-actions>
                    
        <v-dialog v-model="deleteDialog" width="auto">
            <v-card text="Are you sure you want to delete it?">
                <v-card-actions class="d-flex algin-center justify-center">
                    <v-btn @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn color="error" @click="deleteTask">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    
    </v-card>
</template>

<script lang="ts" setup>
    import { taskType } from "../interfaces/Task";
    import { useTasks } from "../composables/UseTasks";
    import { z } from "zod";
    import { snackbar } from "../composables/Snackbar";

    const emit = defineEmits(['deleteItem']);
    const { task } = defineProps<{
        task: z.infer<typeof taskType.class>
    }>();

    const editedTask = ref<string>(task.task);
    const editDialog = ref<boolean>(false);
    const deleteDialog = ref<boolean>(false);
    const useTask = await useTasks();

    async function updateStatus() {
        const error = await useTask.perform.update(task , task.isDone, 'isDone')
        
        if(error) console.log(error)
    }

    async function updateTask() {
        if(taskType.validate(editedTask.value)){
            const error = await useTask.perform.update(task , editedTask.value, 'task')
            
            if(error) {
                console.log(error);
                snackbar.setValues("Failed to add", "error", "mdi-close");
            } else {
                snackbar.setValues("Added successfully", "success", "mdi-check");
                editDialog.value = false;
                task.task = editedTask.value
            }
        }
    }
    
    async function deleteTask() {
        const error = await useTask.perform.delete(task);
        
        if(error) {
            snackbar.setValues("Failed to delete", "error", "mdi-close");
            console.log(error);
        } else {
            snackbar.setValues("Deleted successfully", "success", "mdi-check");
            deleteDialog.value = false;
            emit('deleteItem');
        }
    }

    function cancel() {
        editDialog.value = false;
        editedTask.value = task.task;
    }
</script>