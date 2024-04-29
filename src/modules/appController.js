import TodoController from "./todoController";
import DOMController from "./DOMController";
import { add, lightFormat } from "date-fns";

// The purpose of this module is to integrate DOMController and TodoController 
// while preventing them from becoming too closely coupled.

// It also implements higher level app logic, that does not belong in either of
// these modules

export default class AppController {
    #todoController = new TodoController();
    #domController = new DOMController();
    #projectsContainer = document.querySelector('#projectsContainer');
    #specialsContainer = document.querySelector('#specialsContainer');
    #todosContainer = document.querySelector('#todosContainer');
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

        if (!project.isSpecial || !project.isDynamic) {
            this.reloadTodos(project);
            return;
        }

        switch(project.name) {
            case 'Today': {
                this.reloadTodos(project, 1);
                break;
            }

            case 'This week': {
                this.reloadTodos(project, 7);
                break;
            }
        }

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
        const creatorHeader = projectCreator.querySelector(`#${CREATOR_ID}Header`);
        const createOption = projectCreator.querySelector(`#${CREATOR_ID}Create`);

        createOption.dataset.mode = mode;

        if(mode === 'edit') {
            creatorHeader.textContent = 'Edit project';

            const projectButton = event.currentTarget.parentElement.parentElement;
            const originalName = projectButton.dataset.id;

            projectCreator.querySelector('#projectNameInput').value = originalName;
            createOption.dataset.originalName = originalName;
            createOption.textContent = 'Edit';

        } else {
            creatorHeader.textContent = 'Create a new project';
            projectCreator.querySelector('#projectNameInput').value = '';
            createOption.textContent = 'Create';
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
        this.#projectsContainer.querySelector('#projectList').appendChild(newProjectItem);
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
        const filteredProjects = projects.filter((project) => !project.isSpecial);
        const projectList = this.#domController.createProjectList(filteredProjects, this.#selectedProject);

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

    activateSpecial(specialItem) {
        const specialButton = specialItem.querySelector('.special-button');
        const specialName = specialButton.querySelector('.special-name').textContent;
        let specialProject;

        switch(specialName) {
            case 'Inbox': {
                specialProject = this.#todoController.getProject(specialName);
                specialProject.isDynamic = false;
                break;
            }

            case 'Today':
            case 'This week': {
                specialProject = { 
                    name: specialName,
                    isDynamic: true
                };
                break;
            }
        }

        specialProject.isSpecial = true;
        
        specialButton.addEventListener('click', this.selectProject.bind(this, specialProject));
    }

    activateSpecials() {
        const specialItems = this.#specialsContainer.querySelectorAll('.special-item');
        specialItems.forEach(specialItem => {
            this.activateSpecial(specialItem);
        });
    }

    loadSpecials() {
        const specials = ['Inbox', 'Today', 'This week'];

        this.#todoController.addProject('Inbox');

        const specialList = this.#domController.createSpecialList(
            specials,
            this.#selectedProject,
            'specialList'
        );
        this.#specialsContainer.appendChild(specialList);
        this.activateSpecials();
    }

    // Todos

    addTodo(todo) {
        const newTodo = this.#selectedProject.addTodo(
            todo.title,
            todo.description,
            todo.dueDate,
            todo.priority
        );
        if(newTodo) {
            this.loadTodo(newTodo);
        }
    }

    editTodo(todoTitle, newTodo) {
        const todoCard = this.#todosContainer.querySelector(`[data-id="${todoTitle}"]`);
        const parentProject = this.#todoController.getProject(todoCard.dataset.parentProject);

        const editedTodo = parentProject.editTodo(todoTitle, newTodo);
        if(editedTodo) {
            this.updateTodo(todoTitle, editedTodo);
        }
    }

    deleteTodo(todoTitle, event) {
        event.stopPropagation();

        const todoCard = this.#todosContainer.querySelector(`[data-id="${todoTitle}"]`);
        const parentProject = this.#todoController.getProject(todoCard.dataset.parentProject);
        const todo = parentProject.getTodo(todoTitle);

        if(!todo) {
            console.error(
                `Cannot delete todo: Could not find todo "${todoTitle}" in selected project"`
            );
            return;
        }
        parentProject.deleteTodo(todoTitle);

        if (todoCard.dataset.isShowingDetails === 'true') {
            this.unloadTodoDetails(todoCard);
        }
        todoCard.remove();
    }

    toggleTodoCompletion(todoTitle, event) {
        event.stopPropagation()

        const todoCard = this.#todosContainer.querySelector(`[data-id="${todoTitle}"]`);
        const parentProject = this.#todoController.getProject(todoCard.dataset.parentProject);
        const todo = parentProject.getTodo(todoTitle);

        todo.toggleCompletion();
        this.updateTodo(todoTitle, todo);
    }

    handleTodoCreator(event) {
        event.preventDefault();

        const todoCreator = document.querySelector('#todoCreator');

        const todoTitle = todoCreator.querySelector('#todoTitleInput').value;
        const todoDescription = todoCreator.querySelector('#todoDescriptionInput').value;
        const todoDueDate = todoCreator.querySelector('#todoDueDateInput').value;
        const todoPriority = todoCreator.querySelector('#todoPriorityInput').value;

        const todo = {
            title: todoTitle,
            description: todoDescription,
            dueDate: todoDueDate,
            priority: todoPriority
        };

        const mode = event.currentTarget.dataset.mode;
        switch(mode) {
            case 'add': {
                this.addTodo(todo);
                break;
            }
            case 'edit': {
                const originalTitle = event.currentTarget.dataset.originalTitle;
                this.editTodo(originalTitle, todo);
                break;
            }
        }

        todoCreator.close();
    }

    createTodoCreator() {
        const CREATOR_ID = 'todoCreator';

        const todoCreator = this.#domController.createCreatorTemplate(
            CREATOR_ID, 'Create a new todo'
        );
        const creatorContent = todoCreator.querySelector(`#${CREATOR_ID}Content`);

        const todoTitleField = this.#domController.createCreatorField(
            'text', 'todoTitle', 'Title:'
        );
        const todoDescriptionField = this.#domController.createCreatorField(
            'textarea', 'todoDescription', 'Description:'
        );
        const todoDueDateField = this.#domController.createCreatorField(
            'date', 'todoDueDate', 'Due date:'
        );
        const todoPriorityField = this.#domController.createCreatorField(
            'select', 'todoPriority', 'Priority:',
            {options: ['low', 'medium', 'high']}
        );

        creatorContent.appendChild(todoTitleField);
        creatorContent.appendChild(todoDescriptionField);
        creatorContent.appendChild(todoDueDateField);
        creatorContent.appendChild(todoPriorityField);

        const createOption = todoCreator.querySelector(`#${CREATOR_ID}Create`);
        createOption.dataset.mode = 'add';

        createOption.addEventListener(
            'click',
            this.handleTodoCreator.bind(this)
        );

        return todoCreator;
    }

    openTodoCreator(mode = 'add', event) {
        event.stopPropagation();

        const CREATOR_ID = 'todoCreator';
        const todoCreator = document.querySelector(`#${CREATOR_ID}`);
        const creatorHeader = todoCreator.querySelector(`#${CREATOR_ID}Header`);
        const createOption = todoCreator.querySelector(`#${CREATOR_ID}Create`);

        createOption.dataset.mode = mode;

        if(mode === 'edit') {
            creatorHeader.textContent = 'Edit todo';

            const todoCard = event.currentTarget.parentElement.parentElement;
            const originalTitle = todoCard.dataset.id;

            const parentProject = this.#todoController.getProject(todoCard.dataset.parentProject);
            const originalTodo = parentProject.getTodo(originalTitle);

            todoCreator.querySelector('#todoTitleInput').value = originalTodo.title;
            todoCreator.querySelector('#todoDescriptionInput').value =  originalTodo.description;
            todoCreator.querySelector('#todoDueDateInput').value = originalTodo.dueDate;
            todoCreator.querySelector('#todoPriorityInput').value = originalTodo.priority;

            createOption.dataset.originalTitle = originalTitle;
            createOption.textContent = 'Edit';

        } else {
            creatorHeader.textContent = 'Create a new todo';

            const currentDate = new Date();
            const tomorrow = lightFormat(add(currentDate, {days: 1}), 'yyyy-MM-dd');

            todoCreator.querySelector('#todoTitleInput').value = '';
            todoCreator.querySelector('#todoDescriptionInput').value = '';
            todoCreator.querySelector('#todoDueDateInput').value = tomorrow;
            todoCreator.querySelector('#todoPriorityInput').value = 'medium';

            createOption.textContent = 'Create';
        }

        todoCreator.showModal();
    }

    loadTodoDetails(todoCard) {
        const todoTitle = todoCard.dataset.id;
        const parentProject = this.#todoController.getProject(todoCard.dataset.parentProject);
        const todo = parentProject.getTodo(todoTitle);
        const todoDetails = this.#domController.createTodoDetails(todo);

        todoCard.dataset.isShowingDetails = true;
        todoCard.after(todoDetails);
    }

    unloadTodoDetails(todoCard) {
        const sibling = todoCard.nextElementSibling;
        if (sibling.classList.contains('todo-details')) {
            todoCard.dataset.isShowingDetails = false;
            sibling.remove();
        } else {
            console.error('Cannot unload todo details: Could not find matching element');
        }
    }

    reloadTodoDetails(todoCard) {
        this.unloadTodoDetails(todoCard);
        this.loadTodoDetails(todoCard);
    }

    toggleTodoDetails(todoCard) {
        // Since data is stored as an html attribute it is converted to string
        if (todoCard.dataset.isShowingDetails === 'true') {
            this.unloadTodoDetails(todoCard);
        } else if (todoCard.dataset.isShowingDetails === 'false') {
            this.loadTodoDetails(todoCard);
        } else {
            console.error('Cannot toggle todo details: incorrect isShowingDetails parameter value');
        }
    }

    loadTodo(todo) {
        const newTodoCard = this.#domController.createTodoCard(todo);
        this.#todosContainer.querySelector('#todoListContainer').appendChild(newTodoCard);
        this.activateTodo(newTodoCard);
    }

    updateTodo(todoTitle, updatedTodo) {
        const todoCard = this.#todosContainer.querySelector(`[data-id="${todoTitle}"]`);
        const updatedTodoCard = this.#domController.createTodoCard(updatedTodo);
        todoCard.replaceWith(updatedTodoCard);

        this.activateTodo(updatedTodoCard);

        if(todoCard.dataset.isShowingDetails === 'true') {
            this.reloadTodoDetails(updatedTodoCard);
        }
    }

    filterTodos(todos, timeDistance = null) {
        return todos.filter((todo) => {
            if(todo.isCompleted) {
                return false;
            }
            if(!timeDistance) {
                return true;
            }

            const currentDate = new Date();
            const dueDate = new Date(todo.dueDate);
            const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
            const timeLeftInDays = (dueDate.getTime() - currentDate.getTime()) / MILLISECONDS_PER_DAY;

            return timeLeftInDays <= timeDistance;
        });
    }

    loadTodos(project = this.#selectedProject, timeDistance = null) {
        const todoCreator = this.createTodoCreator();
        const todoListHeader = this.#domController.createTodoListHeader(project);

        const todos = project.isDynamic 
        ?   this.#todoController.getAllTodosArray()  
        :   AppController.convertObjectToArray(project.todos);

        let todoList;

        if(timeDistance) {
            const filteredTodos = this.filterTodos(todos, timeDistance);
            todoList = this.#domController.createTodoList(filteredTodos);

        } else {
            todoList = this.#domController.createTodoList(todos);
        }

        this.#todosContainer.appendChild(todoCreator);
        this.#todosContainer.appendChild(todoListHeader);
        this.#todosContainer.appendChild(todoList);

        this.activateTodos();
    }

    activateTodo(todoCard) {
        const todoCheckbox = todoCard.querySelector('.todo-checkbox');
        const deleteTodoButton = todoCard.querySelector('.deleteTodoButton');
        const editTodoButton = todoCard.querySelector('.editTodoButton');
        const todoTitle = todoCard.dataset.id;

        todoCard.dataset.isShowingDetails = false;

        todoCard.addEventListener('click', this.toggleTodoDetails.bind(this, todoCard));
        todoCheckbox.addEventListener('click', this.toggleTodoCompletion.bind(this, todoTitle));
        deleteTodoButton.addEventListener('click', this.deleteTodo.bind(this, todoTitle));
        editTodoButton.addEventListener('click', this.openTodoCreator.bind(this, 'edit'));
    }
    
    activateTodos() {
        const addTodoButton = this.#todosContainer.querySelector('#addTodoButton');
        const todoCards = this.#todosContainer.querySelectorAll('.todo-card');

        addTodoButton?.addEventListener('click', this.openTodoCreator.bind(this, 'add'));

        todoCards.forEach(todoCard => {
            this.activateTodo(todoCard);
        });
    }

    unloadTodos() {
        this.#todosContainer.innerHTML = '';
    }

    reloadTodos(project = this.#selectedProject, timeDistance = null) {
        this.unloadTodos();
        this.loadTodos(project, timeDistance);
    }

    // App miscellaneous

    loadSampleData() {
        const dateFormat = 'yyyy-MM-dd'
        const currentDate = new Date();

        const today = lightFormat(currentDate, dateFormat) ;
        const yesterday = lightFormat(add(currentDate, {days: -1}), dateFormat);
        const tomorrow = lightFormat(add(currentDate, {days: 1}), dateFormat);
        const inAWeek = lightFormat(add(currentDate, {weeks: 1}), dateFormat);
        const inAMonth = lightFormat(add(currentDate, {months: 1}), dateFormat);

        const chores = this.#todoController.addProject('Chores');
        const programming = this.#todoController.addProject('Programming');
        const sport = this.#todoController.addProject('Sport');
        const annoyingProject = this.#todoController.addProject('What do you mean I am supposed to be concise?');

        chores.addTodo('Buy groceries', 'pierogies, 1 jar of pickles, 2 loafs of bread, 2 sticks of butter', tomorrow, 'low');
        chores.addTodo('Vacuum the apartment', '', tomorrow, 'medium');

        programming.addTodo('Procrastinate', 'The key to success! (... not really)', today, 'high').toggleCompletion();
        programming.addTodo('Create Todo app', '', yesterday, 'low');
        programming.addTodo('Finish TOP curriculum', 'Someday...', '', 'medium');

        sport.addTodo('Run 3km', 'I hate running but it keeps me feet', inAWeek, 'medium');

        annoyingProject.addTodo('Practice screaming', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', inAMonth, 'medium');
        annoyingProject.addTodo('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'Practice screaming', inAMonth, 'medium');
        annoyingProject.addTodo('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', inAMonth, 'medium');

        this.#selectedProject = programming;
    }

    initializeApp() {
        this.loadSampleData();
        this.loadSpecials();
        this.loadProjects();
        this.loadTodos();
    }
}