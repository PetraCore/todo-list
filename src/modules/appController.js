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

    // Internal tools

    static convertObjectToArray(object) {
        const OBJECT_INDEX = 1;
        return Object.entries(object).map((entry) => entry[OBJECT_INDEX]);  
    }

    // Projects

    selectProject(project) {
        if(typeof project !== 'object' && typeof project !== 'string') {
            return;
        }

        if (typeof project === 'string') {
            project = this.#todoController.getProject(project);
        }

        this.#selectedProject = project;
        this.#domController.selectProjectElement(project);
        this.reloadTodos(project);
    }

    addProject(name) {
        this.#todoController.addProject(name);
    }

    activateProjectsButtons() {
        const projectsContainer = document.querySelector('#projectsContainer');
        const projectButtons = projectsContainer.querySelectorAll('.project-button');

        projectButtons.forEach(projectButton => {
            const projectName = projectButton.querySelector('.project-name').textContent;
            projectButton.addEventListener('click', this.selectProject.bind(this, projectName));
        });
    }
    
    unloadProjects() {
        const projectsContainer = document.querySelector('#projectsContainer');
        projectsContainer.innerHTML = '';
    }

    loadProjects() {
        const projectsContainer = document.querySelector('#projectsContainer');

        const projectListHeaderElement = this.#domController.createProjectListHeaderElement();

        const projects = AppController.convertObjectToArray(this.#todoController.projects);
        const projectListElement = this.#domController.createProjectListElement(projects, this.#selectedProject);

        projectsContainer.appendChild(projectListHeaderElement);
        projectsContainer.appendChild(projectListElement);

        this.activateProjectsButtons();
    }

    reloadProjects() {
        this.clearProjects();
        this.loadProjects();
    }

    // Todos

    unloadTodos() {
        const todosContainer = document.querySelector('#todosContainer');
        todosContainer.innerHTML = '';
    }

    loadTodos(project = this.#selectedProject) {
        const todosContainer = document.querySelector('#todosContainer');

        const todoListHeaderElement = this.#domController.createTodoListHeaderElement(project);

        const todos = AppController.convertObjectToArray(project.todos);
        const todoListElement = this.#domController.createTodoListElement(todos);

        todosContainer.appendChild(todoListHeaderElement);
        todosContainer.appendChild(todoListElement);
    }

    reloadTodos(project = this.#selectedProject) {
        this.unloadTodos();
        this.loadTodos(project);
    }

    // App miscellaneous

    loadSampleData() {
        const chores = this.#todoController.addProject('Chores');
        const programming = this.#todoController.addProject('Programming');
        const sport = this.#todoController.addProject('Sport');

        chores.addTodo('Buy groceries', 'pierogies, 1 jar of pickles, 2 loafs of bread, 2 sticks of butter', 'Tomorrow', 1);
        chores.addTodo('Vacuum the apartment', '', 'Today', 2);

        programming.addTodo('Procrastinate', 'The key to success! (... not really)', 'Today', 3).complete();
        programming.addTodo('Create Todo app', '', 'Yesterday', 1);
        programming.addTodo('Finish TOP curriculum', 'Someday...', '', 2);

        sport.addTodo('Run 3km', 'I hate running but it keeps me feet', 'Saturday', 2);

        this.#selectedProject = programming;
    }

    initializeApp() {
        this.loadSampleData();
        this.loadProjects();
        this.loadTodos();
    }
}