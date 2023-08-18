type Color = "error" | "alert" | "success"; 

type Snackbar = {
    message: string,
    color: Color,
    timeout?: number,
    active?: boolean,
    icon?: string
}

let configs = reactive<Snackbar>({
    message: "Teste",
    color: "success",
    timeout: 2000,
    active: false,
    icon: ""
})

function setSnackbar(message: string, color: Color, icon?: string, timeout?: number) {
    configs.message = message;
    configs.color = color;
    configs.active = true;
    configs.timeout = timeout ? timeout : 2000;
    configs.icon = icon ? icon : "";
}

function disable() {
    configs.active = false;
}

let snackbar = {
    values: configs,
    setValues: setSnackbar,
    close: disable
}

export {
    snackbar
}