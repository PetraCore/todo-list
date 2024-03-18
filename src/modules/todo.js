export default class Todo {
    constructor(title, description, dueDate, priority) { 
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completion = false;
        this.completionDate = null; 
    }

    complete() {
        this.completion = true;
        this.completionDate = 'WIP';
    }
}