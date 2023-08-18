import { z } from "zod";

const User = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

function test(item: keyof typeof User.shape, value: any) {
    const resp = User.shape[item].safeParse(value);

    if(resp.success) return true;
    
    return resp.error.issues[0].message;
}

function validate(object: z.infer<typeof User>) {
    const resp = User.safeParse(object);

    if(resp.success) return true;
    
    return false;
}

const userType = {
    class: User,
    test: test,
    validate: validate
}

export {
    userType
}