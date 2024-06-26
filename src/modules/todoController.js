import Project from "./project.js";

export default class TodoController {
    constructor() {
        this.projects = {};
    }

    getProject(projectName) {
        return this.projects[projectName];
    }

    getProjectsArray() {
        const projectsArray = [];
        for (const projectID in this.projects) {
            projectsArray.push(this.projects[projectID]);
        }
        return projectsArray;
    }

    getAllTodosArray() {
        let todosArray = [];
        const projects = this.getProjectsArray();
        projects.forEach((project) => {
            todosArray = todosArray.concat(project.getTodosArray());
        });
        return todosArray;
    }
    
    addProject(name) {
        if (this.getProject(name)) {
            console.error(`Cannot add project: Project with this name ("${name}") already exists!`);
            return;
        }

        const newProject = new Project(name);
        this.projects[name] = newProject;
        return newProject;
    }

    deleteProject(projectName) {
        let deletedProject = this.getProject(projectName);
        delete this.projects[projectName];
        return deletedProject;
    }

    editProject(projectName, newName) {
        if(this.getProject(newName)) {
            console.error(`Cannot edit project: Project with this name ("${newName}") already exists!`);
            return;
        }

        let project = this.getProject(projectName);
        project.name = newName;

        this.projects[newName] = project;
        delete this.projects[projectName];

        project = this.getProject(newName);

        return project;
    }

    loadProjectsFromJSON(projectsJSON) {
        const projects = JSON.parse(projectsJSON);

        for (const projectID in projects) {
            const loadedProject = projects[projectID];

            let newProject = this.getProject(loadedProject.name);
            if (!newProject) {
                newProject = this.addProject(loadedProject.name);
            }

            const todos = loadedProject.todos;
            for (const todoID in todos) {
                const todo = todos[todoID];
                newProject.addTodo(
                    todo.title,
                    todo.description,
                    todo.dueDate,
                    todo.priority,
                    todo.isCompleted,
                    todo.completionDate
                );
            }
        }
    }
}