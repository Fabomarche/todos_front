const inputBox = document.getElementById("input-box")
const listContainer = document.getElementById("list-container")

const registerUsername = document.getElementById("register-username");
const registerPassword = document.getElementById("register-password");

const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const registerForm = document.querySelector('.register');
const loginForm = document.querySelector('.login');

const todoDiv = document.querySelector('.todo');

const userGreeting = document.getElementById("user-greeting");
const header = document.querySelector(".header")

const updateHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        userGreeting.textContent = `Welcome, ${user.username}!`;
        header.style.display = 'flex';
    } else {
        userGreeting.textContent = '';
        header.style.display = 'none';
    }
}




const islogged = () => {
    
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            todoDiv.style.display = 'block';
            loginForm.style.display = 'none';
            registerForm.style.display = 'none';
            updateHeader();
        } else {
            todoDiv.style.display = 'none';
            registerForm.style.display = 'block';

        }
   updateHeader();
}


window.onload = islogged;

const logout = () => {
    localStorage.removeItem('user');
    updateHeader();
    islogged();
}

const showLogin = () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
}

const showRegister = () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}

showRegister()


const register = () => {
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

const login = () => {
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
            alert("Invalid user or password")
        }else{
            console.log('User logged in:', data);
            localStorage.setItem('user', JSON.stringify(data));
            islogged()
        }
    })
    .catch((error) => {
        console.error('Error logging in:', error);

    });

    loginUsername.value = "";
    loginPassword.value = "";

    
}



/////////////////TODOS

const showAllTodos = () => {

    fetch('http://localhost:8080/todos', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(task => {
            let li = document.createElement("li");
            li.innerHTML = task.title;
            li.setAttribute('data-id', task._id);

            let deleteX = document.createElement("span");
            deleteX.innerHTML = "\u00d7";
            deleteX.classList.add("delete-button");
            li.appendChild(deleteX);

            let edit = document.createElement("span");
            edit.innerText = "edit";
            edit.classList.add("edit-button");
            li.append(edit);

            listContainer.appendChild(li);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


const addTask = () => {
    if(inputBox.value === ''){
        alert("You must write the task")
    }else{
        fetch('http://localhost:8080/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: inputBox.value }),
        })
        .then(response => response.json())
        .then(data => {
            let li= document.createElement("li")
            li.innerHTML = data.title
            li.setAttribute('data-id', data._id)
            listContainer.appendChild(li)
            
            let deleteX = document.createElement("span")
            deleteX.innerHTML = "\u00d7"
            deleteX.classList.add("delete-button")
            li.appendChild(deleteX)

            let edit = document.createElement("span")
            edit.innerText = "edit"
            edit.classList.add("edit-button")
            li.append(edit)
        })
        .catch((error) => {
            console.error('Error creating todo:', error);
        });
    }

    inputBox.value=""
}


listContainer.addEventListener("click", e => {
    if(e.target.classList.contains("delete-button")){
        const taskId = e.target.parentElement.getAttribute('data-id');
  
        fetch(`http://localhost:8080/todos/${taskId}` , {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(() => {
            e.target.parentElement.remove();
        })
        .catch((error) => {
            console.error('Error deleting todo:', error);
        });

        e.target.parentElement.remove()
    
    }else if(e.target.classList.contains("edit-button")){
        const li = e.target.parentElement;
        const taskId = li.getAttribute('data-id');
        const currentTitle = li.childNodes[0].nodeValue.trim();

        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentTitle;
        input.classList.add("row")
        li.childNodes[0].nodeValue = '';
        li.insertBefore(input, li.firstChild);

        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const newTitle = input.value;
                fetch(`http://localhost:8080/todos/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: newTitle }),
                })
                .then(response => response.json())
                .then(() => {
                    li.removeChild(input);
                    li.childNodes[0].nodeValue = newTitle + ' ';
                })
                .catch((error) => {
                    console.error('Error updating todo:', error);
                });
            }
        });

    }else if(e.target.tagName === "LI"){
        const li = e.target;
        const taskId = li.getAttribute('data-id');
        const completed = !li.classList.contains("checked");

        fetch(`http://localhost:8080/todos/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: completed }),
        })
        .then(response => response.json())
        .then(() => {
            li.classList.toggle("checked");
        })
        .catch((error) => {
            console.error('Error updating todo:', error);
        });
    }
}, false)





showAllTodos()