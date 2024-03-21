import TodoController from "./todoController";
import DOMController from "./DOMController";

// The purpose of this module is to integrate DOMController and TodoController 
// while preventing them from becoming too closely coupled.

// It also implements higher level app logic, that does not belong in either of
// these modules

export default class AppController {
    #todoController = new TodoController();
    #domController = new DOMController();
    #selectedProject = null;

    static convertObjectToArray(object) {
        const OBJECT_INDEX = 1;
        return Object.entries(object).map((entry) => entry[OBJECT_INDEX]);  
    }

    addProject(name) {
        this.#todoController.addProject(name);
    }

    loadProjects() {
        const projectsContainer = document.querySelector('#projectsContainer');
        const projects = AppController.convertObjectToArray(this.#todoController.projects);
        const projectListElement = this.#domController.createProjectListElement(projects, this.#selectedProject);
        projectsContainer.appendChild(projectListElement);
    }

    loadSampleData() {
        const chores = this.#todoController.addProject('Chores');
        const programming = this.#todoController.addProject('Programming');
        const sport = this.#todoController.addProject('Sport');

        chores.addTodo('Buy groceries', 'pierogies, 1 jar of pickles, 2 loafs of bread, 2 sticks of butter', 'tomorrow', 1);
        chores.addTodo('Vacuum the apartment', '', 'today', 2);

        programming.addTodo('Create Todo app', '', 'yesterday', 3);
        programming.addTodo('Finish TOP curriculum', 'Someday...', '', 3);

        sport.addTodo('Run 3km', 'I hate running but it keeps me feet', 'saturday', 2);

        this.#selectedProject = programming;
    }

    initializeApp() {
        this.loadSampleData();
        this.loadProjects();
    }
}