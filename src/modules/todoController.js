import Project from "./project.js";

export default class TodoController {
    constructor() {
        this.projects = {};
    }

    addProject(name) {
        const newProject = new Project(name);
        this.projects[name] = newProject;
        return newProject;
    }

    getProject(projectName) {
        return this.projects[projectName];
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
}