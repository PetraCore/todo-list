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
        const deletedTodo = this.getTodo(todoTitle);
        delete this.todos[todoTitle];
        return deletedTodo;
    }

    editTodo(
        todoTitle,
        newTitle = null,
        newDescription = null,
        newDueDate = null,
        newPriority = null
    ) {
        let todo = this.getTodo(todoTitle);

        if(newTitle) {
            todo.title = newTitle;

            this.todos[newTitle] = todo;
            delete this.todos[todoTitle];

            todo = this.getTodo(newTitle);
        }
        
        if(newDescription) {
            todo.description = newDescription;
        }
        if(newDueDate) {
            todo.dueDate = newDueDate;
        }
        if(newPriority) {
            todo.priority = newPriority;
        }

        return todo;
    }
}