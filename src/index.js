import 'normalize.css';
import './style.css';
import TodoController from './modules/todoController.js';

window.todoController = new TodoController();
window.project = todoController.addProject('Programming');
window.todo = project.addTodo('Create To-do app', 'Check out Odin for details', 'now', 1234);

console.log(window.todoController.getProject('Programming'));
console.log(window.project.getTodo('Create To-do app'));

console.log('completing todo');
window.todo.complete();

console.log(window.todoController.getProject('Programming'));
console.log(window.project.getTodo('Create To-do app'));

console.log('deleting todo');
window.project.deleteTodo('Create To-do app');

console.log(window.todoController.getProject('Programming'));
console.log(window.project.getTodo('Create To-do app'));

console.log('deleting project');
window.todoController.deleteProject('Programming');

console.log(window.todoController.getProject('Programming'));
console.log(window.project.getTodo('Create To-do app'));