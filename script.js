const inputBox = document.getElementById("input-box")
const listContainer = document.getElementById("list-container")

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