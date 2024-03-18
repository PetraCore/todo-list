import Todo from './todo.js';

export default class Project {
    constructor(name) {
        this.name = name;
        this.todoList = [];
    }

    addTodo(title, description, dueDate, priority) {
        const newTodo = new Todo(title, description, dueDate, priority);
        this.todoList.push(newTodo);
        return newTodo;
    }

    getTodo(todoTitle) {
        return this.todoList.find((todo) => todo.title === todoTitle);
    }

    deleteTodo(todoTitle) {
        let deletedTodo = null;
        this.todoList = this.todoList.filter(todo => {
            if(todo.title === todoTitle) {
                deletedTodo = todo;
                return false;
            }
            return true;
        });
        return deletedTodo;
    }
}