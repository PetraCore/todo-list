export default class Todo {
    constructor(title, description, dueDate, priority) { 
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isCompleted = false;
        this.completionDate = null; 
    }

    complete() {
        this.isCompleted = true;
        this.completionDate = 'WIP';
    }
}