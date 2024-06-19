import { updateHeader, islogged, showLogin } from '../components/auth.js';
import { listContainer } from '../components/todoList.js';

export const register = () => {
    const registerUsername = document.getElementById("register-username");
    const registerPassword = document.getElementById("register-password");

    fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: registerUsername.value, password: registerPassword.value }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.error){
            alert(data.error)
        }else{
            console.log('User registered:', data);
            alert("User created")
            showLogin()
        }
    })
    .catch((error) => {
        console.error('Error registering user:', error);
    });

    registerUsername.value = "";
    registerPassword.value = "";
}

export const login = () => {
    const loginUsername = document.getElementById("login-username");
    const loginPassword = document.getElementById("login-password");

    fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: loginUsername.value, password: loginPassword.value }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.error){
            alert(data.error)
        }else{
            console.log('User logged in:', data);
            localStorage.setItem('user', JSON.stringify(data));
            islogged()
            showAllTodos()
        }
    })
    .catch((error) => {
        console.error('Error logging in:', error);
    });

    loginUsername.value = "";
    loginPassword.value = "";
}

export const logout = () => {
    localStorage.removeItem('user');
    listContainer.innerHTML = ''
    updateHeader();
    islogged();
}
