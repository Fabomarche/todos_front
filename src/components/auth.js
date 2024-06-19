// Componentes relacionados con la autenticación
export const registerUsername = document.getElementById("register-username");
export const registerPassword = document.getElementById("register-password");
export const loginUsername = document.getElementById("login-username");
export const loginPassword = document.getElementById("login-password");
export const registerForm = document.querySelector('.register');
export const loginForm = document.querySelector('.login');
export const todoDiv = document.querySelector('.todo');
export const userGreeting = document.getElementById("user-greeting");
export const header = document.querySelector(".header");

export const updateHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        userGreeting.textContent = `Welcome, ${user.username}!`;
        header.style.display = 'flex';
    } else {
        userGreeting.textContent = '';
        header.style.display = 'none';
    }
}

export const islogged = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        todoDiv.style.display = 'block';
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
    } else {
        todoDiv.style.display = 'none';
        registerForm.style.display = 'block';
    }
    updateHeader();
}


export const showLogin = () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
}


export const showRegister = () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}