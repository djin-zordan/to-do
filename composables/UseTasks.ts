import { createClient } from '@supabase/supabase-js';
import { taskType } from '../interfaces/Task';
import { z } from 'zod';

export const useTasks = async () => {
    const runtimeConfig = useRuntimeConfig()
    const supabase = createClient(runtimeConfig.public.supabaseURL, runtimeConfig.public.supabaseKey)
    const { data: { user } } = await supabase.auth.getUser();
    const TABLE_NAME = 'tasks'
    
    async function performUpdate(task: z.infer<typeof taskType.class>, newValue: any, where:keyof z.infer<typeof taskType.class>) {
        const { error } = await supabase.from(TABLE_NAME).update({[where]: newValue}).eq('id', task.id)
        return error;
    }
    
    async function performInsert(task:Partial<z.infer<typeof taskType.class>>) {
        const { error } = await supabase.from(TABLE_NAME).insert([{...task, userid: user!.id}])
        return error;
    }
    
    async function performDelete(task:z.infer<typeof taskType.class>) {
        const { error } = await supabase.from(TABLE_NAME).delete().eq('id', task.id)
        return error;
    }
    
    async function performSelect() {
        const {data: items, error} = await supabase.from('tasks').select().order('id', { ascending: true });
        return items ? items : error;
    }

    const perform = {
        update: performUpdate,
        delete: performDelete,
        insert: performInsert,
        select: performSelect
    }

    return {
        perform
    }
}