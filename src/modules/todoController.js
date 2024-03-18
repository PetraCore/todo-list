import Project from "./project.js";

export default class TodoController {
    constructor() {
        this.projects = [];
    }

    addProject(name) {
        const newProject = new Project(name);
        this.projects.push(newProject);
        return newProject;
    }

    getProject(projectName) {
        return this.projects.find((project) => project.name === projectName);
    }

    deleteProject(projectName) {
        let deletedProject = null;
        this.projects = this.projects.filter(project => {
            if (project.name === projectName) {
                deletedProject = project;
                return false;
            }
            return true;
        });
        return deletedProject;
    }
}