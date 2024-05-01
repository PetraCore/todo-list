import Todo from './todo.js';

export default class Project {
    constructor(name) {
        this.name = name;
        this.todos = {};
    }

    addTodo(
        title,
        description,
        dueDate,
        priority,
        isCompleted = false,
        completionDate = null
    ) {
        if (this.getTodo(title)) {
            console.error(`Cannot add todo: Todo with this title ("${title}") already exists!`);
            return;
        }

        const newTodo = new Todo(title, description, dueDate, priority, isCompleted, completionDate);
        newTodo.parentProject = this.name;
        this.todos[title] = newTodo;

        return newTodo;
    }

    getTodo(todoTitle) {
        return this.todos[todoTitle];
    }

    getTodosArray() {
        const todosArray = [];
        for (const todoID in this.todos) {
            todosArray.push(this.todos[todoID]);
        }
        return todosArray;
    }

    deleteTodo(todoTitle) {
        const deletedTodo = this.getTodo(todoTitle);
        delete this.todos[todoTitle];
        return deletedTodo;
    }

    editTodo(
        todoTitle,
        newProperties 
    ) {
        if(typeof newProperties !== 'object') {
            console.error(`Cannot edit todo: no properties specified!`);
            return;
        }

        let todo = this.getTodo(todoTitle);

        if(todoTitle !== newProperties.title) {
            if(this.getTodo(newProperties.title)) {
                console.error(`Cannot edit todo: todo with this title ("${newProperties.title}") already exists!`);
                return;
            }

            if(newProperties.title) {
                todo.title = newProperties.title;

                this.todos[newProperties.title] = todo;
                delete this.todos[todoTitle];

                todo = this.getTodo(newProperties.title);
            }
        }

        if(newProperties.description) {
            todo.description = newProperties.description;
        }
        if(newProperties.dueDate) {
            todo.dueDate = newProperties.dueDate;
        }
        if(newProperties.priority) {
            todo.priority = newProperties.priority;
        }

        return todo;
    }
}