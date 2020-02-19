"use stict";

const userForm = new UserForm;

userForm.loginFormCallback = loginForm => {
    ApiConnector.login(loginForm, (result) => {
        if(!result.success){
            userForm.setLoginErrorMessage(result.data);
            return;
        } else {            
            location.reload();
        }        
    })
}

userForm.registerFormCallback = registerForm => {
    ApiConnector.register(registerForm, (result) => {
        if(!result.success){
            userForm.setRegisterErrorMessage(result.data);
            return;
        } else {
            location.reload();
        }
    })
}