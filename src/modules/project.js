import Todo from './todo.js';

export default class Project {
    constructor(name) {
        this.name = name;
        this.todos = {};
    }

    addTodo(title, description, dueDate, priority) {
        const newTodo = new Todo(title, description, dueDate, priority);
        this.todos[title] = newTodo;
        return newTodo;
    }

    getTodo(todoTitle) {
        return this.todos[todoTitle];
    }

    deleteTodo(todoTitle) {
        let deletedTodo = this.getTodo(todoTitle);
        delete this.todos[todoTitle];
        return deletedTodo;
    }
}