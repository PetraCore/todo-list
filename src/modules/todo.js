export default class Todo {
    constructor(
        title,
        description,
        dueDate,
        priority,
        isCompleted = false,
        completionDate = null
    ) { 
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;

        if(!isCompleted) {
            return;
        }
        this.isCompleted = true;

        if(Object.prototype.toString.call(completionDate) === '[object Date]') {
            this.completionDate = completionDate;
        }
    }

    toggleCompletion() {
        if(this.isCompleted) {
            this.isCompleted = false;
            this.completionDate = null;
        } else {
            this.isCompleted = true;
            this.completionDate = new Date();
        }
    }
}