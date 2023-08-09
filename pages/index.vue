<script setup>
    import { ref, reactive } from 'vue'

    const menu = ref(false);
    const newTask = ref("");
    const list = reactive([]);
    
    function cancel() {
        menu.value = false;
        newTask.value = "";
    }

    function addNew () {
        if(newTask.value.length > 0){
            list.push({task: newTask.value, isDone: false});
        }
        cancel();
    }
</script>

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
                                        <v-text-field v-model="newTask" label="Task" variant="outlined" class="mt-2" placeholder="Do laundry"/>
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
                    <v-list-item v-for="item in list">
                        <v-card class="w-100 d-flex justify-space-between align-center" :class="{'text-grey-lighten-1': item.isDone}">
                            <v-card-text :class="{'text-decoration-line-through': item.isDone}" class="pt-0">
                                {{item.task}}
                            </v-card-text>
                            <v-card-actions class="pa-0">
                                <v-checkbox label="Done" v-model="item.isDone" />
                            </v-card-actions>
                        </v-card>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </v-container>
</template>