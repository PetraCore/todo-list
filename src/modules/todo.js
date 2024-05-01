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
            this.isCompleted = false;
            return;
        }
        this.isCompleted = true;

        completionDate = new Date(Date.parse(completionDate));

        if(isNaN(completionDate)) {
            this.completionDate = null;
        } else {
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