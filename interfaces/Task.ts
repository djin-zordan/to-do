import { z } from "zod";

const Task = z.object({
    id: z.number(),
    task: z.string().max(50).min(1),
    isDone: z.boolean(),
    userid: z.string().uuid()
});

function test(item: keyof typeof Task.shape, value: any) {
    const resp = Task.shape[item].safeParse(value);

    if(resp.success) return true;
    
    return resp.error.issues[0].message;
}

function validate(value: string) {
    const resp = Task.shape.task.safeParse(value);

    if(resp.success) return true;
    
    return false;
}

const taskType = {
    class: Task,
    test: test,
    validate: validate
}

export {
    taskType
}