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
        const newProject = this.#todoController.addProject(name);
        if(newProject) {
            this.loadProject(newProject);
        }
    }
    
    editProject(name, newName) {
        if(!this.#todoController.getProject(name)) {
            return;
        }
        const editedProject = this.#todoController.editProject(name, newName);
        if(editedProject) {
            this.updateProject(name, editedProject);
        }
    }

    deleteProject(name) {
        const project = this.#todoController.getProject(name);
        if (project === this.#selectedProject) {
            this.#selectedProject = null;
            this.unloadTodos();
        }
        this.#todoController.deleteProject(name);
        this.#projectsContainer.querySelector(`[data-id="${name}"]`).remove();
    }

    handleProjectCreator(event) {
        event.preventDefault();

        const projectCreator = document.querySelector('#projectCreator');
        const projectName = projectCreator.querySelector('#projectNameInput').value;

        const mode = event.currentTarget.dataset.mode;
        switch(mode) {
            case 'add': {
                this.addProject(projectName);
                break;
            }
            case 'edit': {
                const originalName = event.currentTarget.dataset.originalName;
                this.editProject(originalName, projectName);
                break;
            }
        }

        projectCreator.close();
    }

    createProjectCreator() {
        const CREATOR_ID = 'projectCreator';

        const projectCreator = this.#domController.createCreatorTemplate(
            CREATOR_ID, 'Create a new project'
        );
        const creatorContent = projectCreator.querySelector(`#${CREATOR_ID}Content`);

        const projectNameField = this.#domController.createCreatorField(
            'text', 'projectName', 'Name:'
        );
        creatorContent.appendChild(projectNameField);

        const createOption = projectCreator.querySelector(`#${CREATOR_ID}Create`);
        createOption.dataset.mode = 'add';

        createOption.addEventListener(
            'click',
            this.handleProjectCreator.bind(this)
        );

        return projectCreator;
    }

    openProjectCreator(mode = 'add', event) {
        const CREATOR_ID = 'projectCreator';
        const projectCreator = document.querySelector(`#${CREATOR_ID}`);
        const createOption = projectCreator.querySelector(`#${CREATOR_ID}Create`);

        const projectButton = event.currentTarget.parentElement.parentElement;
        createOption.dataset.mode = mode;

        if(mode === 'edit') {
            const originalName = projectButton.querySelector('.project-name').textContent;
            projectCreator.querySelector('#projectNameInput').value = originalName;
            createOption.dataset.originalName = originalName;
        }

        projectCreator.showModal();
    }

    activateProject(projectItem) {
        const projectButton = projectItem.querySelector('.project-button');
        const projectName = projectButton.querySelector('.project-name').textContent;
        const deleteProjectButton = projectItem.querySelector('.deleteProjectButton');
        const editProjectButton = projectItem.querySelector('.editProjectButton');
        
        projectButton.addEventListener('click', this.selectProject.bind(this, projectName));
        deleteProjectButton.addEventListener('click', this.deleteProject.bind(this, projectName));
        editProjectButton.addEventListener('click', this.openProjectCreator.bind(this, 'edit'));
    }

    activateProjects() {
        const addProjectButton = this.#projectsContainer.querySelector('#addProjectButton');
        const projectItems = this.#projectsContainer.querySelectorAll('.project-item');

        addProjectButton.addEventListener('click', this.openProjectCreator.bind(this, 'add'))

        projectItems.forEach(projectItem => {
            this.activateProject(projectItem);
        });
    }

    loadProject(project) {
        const newProjectItem = this.#domController.createProjectListItem(project);
        this.#projectsContainer.querySelector('#projectListContainer').appendChild(newProjectItem);
        this.activateProject(newProjectItem);
    }

    updateProject(projectName, editedProject) {
        const projectItem = this.#projectsContainer.querySelector(`[data-id="${projectName}"]`);
        const updatedProjectItem = this.#domController.createProjectListItem(editedProject);
        projectItem.replaceWith(updatedProjectItem);

        if(editedProject === this.#selectedProject) {
            this.selectProject(editedProject);
        }
        
        this.activateProject(updatedProjectItem);
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
        const annoyingProject1 = this.#todoController.addProject('What do you mean I am supposed to be concise?');
        const annoyingProject2 = this.#todoController.addProject('LookAtMeIDontUseSpacesImSoQuirky except now haha what am i doing im german btw how did you know');

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