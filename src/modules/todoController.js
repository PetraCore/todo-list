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
}