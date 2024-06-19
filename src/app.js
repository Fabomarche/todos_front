import * as todosApi from './api/todosApi.js';
import * as usersApi from './api/usersApi.js';
import * as todoList from './components/todoList.js';
import * as auth from './components/auth.js';
import { getUserId } from './utils/storage.js';

window.onload = usersApi.islogged;
todoList.listContainer.addEventListener("click", todosApi.handleListClick);

window.register = usersApi.register;
window.login = usersApi.login;
window.logout = usersApi.logout;
window.showRegister = auth.showRegister;
window.showLogin = auth.showLogin;
window.showAllTodos = todosApi.showAllTodos;
window.addTask = todosApi.addTask;