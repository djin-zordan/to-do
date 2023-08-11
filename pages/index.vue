<template>
    <v-container class="h-screen d-flex align-center">
        <v-row justify="center">
            <v-col cols="6" class="rounded elevation-2 pa-0">
                <v-card variant="tonal" class="rounded-b-0 text-h1 d-flex align-center justify-space-between" text="To-do list">
                    <v-card-actions>
                        <v-menu v-model="menu" :close-on-content-click="false" location="start">

                            <template v-slot:activator="{ props }">
                                <v-btn icon="$plus" v-bind="props"/>
                            </template>

                            <v-card :min-width="300">
                                <v-list>
                                    <v-list-item>
                                        <v-text-field
                                            v-model="newTask"
                                            label="Task"
                                            variant="outlined"
                                            class="mt-2"
                                            :rules="[rules.size]"
                                            placeholder="Do laundry"
                                        />
                                    </v-list-item>
                                </v-list>

                                <v-card-actions class="mb-3">
                                    <v-spacer/>

                                    <v-btn variant="text" @click="cancel" text="Cancel"/>
                                    <v-btn color="primary" variant="text" @click="addNew" text="Add"/>
                                </v-card-actions>

                            </v-card>
                        </v-menu>
                    </v-card-actions>
                </v-card>
                <v-list :max-height="300" class="overflow-auto">
                    <v-list-item v-if="list?.length == 0">
                        <v-card class="w-100" text="Without tasks!"/>
                    </v-list-item>
                    <v-list-item v-for="item in list" class="pr-0">
                        <v-card class="w-100 d-flex justify-space-between align-center" :class="{'text-grey-lighten-1': item.isDone}">
                           
                            <v-card-text :class="{'text-decoration-line-through': item.isDone}">
                                {{item.task}}
                            </v-card-text>

                            <v-card-actions class="pr-3">
                                <v-checkbox label="Done" @click="updateStatus(item.id)" v-model="item.isDone" hide-details />
                            </v-card-actions>
                           
                            <v-dialog fullscreen :scrim="false" transition="dialog-bottom-transition" v-model="editDialog">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" icon="$edit" @click="editedTask = item"/>
                                </template>

                                <v-card>
                                    <v-toolbar dark class="bg-grey-darken-2">
                                        <v-btn icon="$close" dark @click="editDialog = false" />
                                        <v-toolbar-title>Edit Task</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-toolbar-items>
                                            <v-btn variant="text" @click="updateTask">
                                                Save
                                            </v-btn>
                                        </v-toolbar-items>
                                    </v-toolbar>
                                    
                                    <v-list>
                                        <v-list-item>
                                            <v-text-field
                                                v-model="editedTask!.task"
                                                label="Task"
                                                variant="outlined"
                                                class="mt-2"
                                                :rules="[rules.size]"
                                            />
                                        </v-list-item>
                                    </v-list>

                                </v-card>
                            </v-dialog>
                        </v-card>
                    </v-list-item>

                    <v-snackbar v-model="snackbar" :timeout="timeout" :color="snackBarColor">
                        {{ snackBarText }}
                        <template v-slot:actions>
                            <v-btn variant="text" @click="snackbar = false" text="Close" />
                        </template>
                    </v-snackbar>
                </v-list>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
    import { createClient } from '@supabase/supabase-js'
    
    interface Task {
        id: number,
        task: string,
        isDone: boolean
    }
    
    const runtimeConfig = useRuntimeConfig()
    const supabase = createClient(runtimeConfig.public.supabaseURL, runtimeConfig.public.supabaseKey)
    let { data: items, error } = await supabase
        .from('tasks')
        .select()
        .order('id', { ascending: true });
    
    const snackBarColor = ref<string>("");
    const snackBarText = ref<string>("");
    const snackbar = ref<boolean>(false);
    const timeout = ref<number>(2000);
    const editedTask = ref<Task>();
    const editDialog = ref<boolean>(false);
    const menu = ref<boolean>(false);
    const list = ref<Array<Task>>(items as Task[]);
    const newTask = ref<string>("");
    const rules = ({
        size: (value: string) => {
            if (value.length === 0) {
                return "Required";
            } else if(value.length > 50) {
                return "Task must have less than 50 chars";
            } else {
                return true;
            }
        }
    })

    function setSnackBar(isSuccess: boolean){
        if(isSuccess) {
            snackBarColor.value = "success";
            snackBarText.value = "Operation executed with success";
            snackbar.value = true;
        } else {
            snackbar.value = true;
            snackBarText.value = "Operation with error";
            snackBarColor.value = "error";
        }
    }

    async function updateStatus(id: number) {
        const item = list.value.filter((listItem) => {
            return listItem.id === id;
        })
        const { error } = await supabase
            .from('tasks')
            .update({ isDone: !item[0].isDone })
            .eq('id', item[0].id)
    }

    async function updateTask() {
        const { error } = await supabase
        .from('tasks')
        .update({ task: editedTask.value?.task })
        .eq('id', editedTask.value?.id)
        
        if(error) {
            setSnackBar(false);
        } else {
            setSnackBar(true);
            editDialog.value = false;
            list.value.map((listItem) => {
                if(listItem.id === editedTask.value?.id) listItem.task = editedTask.value.task;
            })
        }
    }

    function cancel() {
        menu.value = false;
        newTask.value = "";
    }

    async function addNew () {
        if(newTask.value.length > 0 && newTask.value.length <= 50) {
            const { data: newItem, error } = await supabase
                .from('tasks')
                .insert([
                    { task: newTask.value },
                ])
                .select();

                
            if(error) {
                setSnackBar(false);
            } else {
                setSnackBar(true);
            }
            
            if(newItem && newItem[0]) {
                list.value.push(newItem[0] as Task);
            }
            cancel();
        }
    }
</script>