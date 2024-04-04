import TodoController from "./todoController";
import DOMController from "./DOMController";

// The purpose of this module is to integrate DOMController and TodoController 
// while preventing them from becoming too closely coupled.

// It also implements higher level app logic, that does not belong in either of
// these modules

export default class AppController {
    #todoController = new TodoController();
    #domController = new DOMController();
    #projectsContainer = document.querySelector('#projectsContainer')
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
        this.#domController.selectProject(project);
        this.reloadTodos(project);
    }

    addProject(name) {
        if(this.#todoController.getProject(name)) {
            return;
        }
        const newProject = this.#todoController.addProject(name);
        this.loadProject(newProject);
    }

    createProjectCreator() {
        const CREATOR_ID = 'projectCreator';

        const projectCreator = this.#domController.createCreatorTemplate
        (CREATOR_ID, 'Create a new project');
        const creatorContent = projectCreator.querySelector(`#${CREATOR_ID}Content`);

        const projectNameField = this.#domController.createCreatorField
        ('text', 'projectName', 'Name:');
        creatorContent.appendChild(projectNameField);

        const createOption = projectCreator.querySelector(`#${CREATOR_ID}Create`);
        createOption.addEventListener('click', (event) => {
            event.preventDefault();
            const projectName = projectNameField.querySelector('#projectNameInput').value;
            this.addProject(projectName);
            projectCreator.close();
        });

        return projectCreator;
    }

    openProjectCreator() {
        const projectCreator = document.querySelector('#projectCreator');
        projectCreator.showModal();
    }

    activateProject(projectItem) {
        const projectButton = projectItem.querySelector('.project-button');
        const projectName = projectButton.querySelector('.project-name').textContent;
        projectButton.addEventListener('click', this.selectProject.bind(this, projectName));
    }

    activateProjects() {
        const addProjectButton = this.#projectsContainer.querySelector('#addProjectButton');
        const projectItems = this.#projectsContainer.querySelectorAll('.project-item');

        addProjectButton.addEventListener('click', this.openProjectCreator)

        projectItems.forEach(projectItem => {
            this.activateProject(projectItem);
        });
    }

    loadProject(project) {
        const newProjectItem = this.#domController.createProjectListItem(project);
        this.#projectsContainer.querySelector('#projectListContainer').appendChild(newProjectItem);
        this.activateProject(newProjectItem);
    }

    loadProjects() {
        const projectCreator = this.createProjectCreator();
        const projectListHeader = this.#domController.createProjectListHeader();

        const projects = AppController.convertObjectToArray(this.#todoController.projects);
        const projectList = this.#domController.createProjectList(projects, this.#selectedProject);

        this.#projectsContainer.appendChild(projectCreator);
        this.#projectsContainer.appendChild(projectListHeader);
        this.#projectsContainer.appendChild(projectList);

        this.activateProjects();
    }

    unloadProjects() {
        this.#projectsContainer.innerHTML = '';
    }

    reloadProjects() {
        this.unloadProjects();
        this.loadProjects();
    }

    // Todos

    loadTodos(project = this.#selectedProject) {
        const todosContainer = document.querySelector('#todosContainer');

        const todoListHeader = this.#domController.createTodoListHeader(project);

        const todos = AppController.convertObjectToArray(project.todos);
        const todoList = this.#domController.createTodoList(todos);

        todosContainer.appendChild(todoListHeader);
        todosContainer.appendChild(todoList);
    }

    unloadTodos() {
        const todosContainer = document.querySelector('#todosContainer');
        todosContainer.innerHTML = '';
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