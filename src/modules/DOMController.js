import { formatDistanceToNow, lightFormat } from "date-fns";

export default class DOMController {
    #projectIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z"/></svg>';
    #projectSelectedIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7a2 2 0 0 1 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5"/></svg>';
    #projectOptionAddSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M13 19c0 .34.04.67.09 1H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h8a2 2 0 0 1 2 2v5.81c-.88-.51-1.9-.81-3-.81c-3.31 0-6 2.69-6 6m7-1v-3h-2v3h-3v2h3v3h2v-3h3v-2z" /></svg>';
    #projectOptionDeleteSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg>';
    #projectOptionEditSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/></svg>';

    #specialIconInboxSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M19 15h-4a3 3 0 0 1-3 3a3 3 0 0 1-3-3H5V5h14m0-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2"/></svg>';
    #specialIconTodaySVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1"/></svg>';
    #specialIconWeekSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M9 10H7v2h2zm4 0h-2v2h2zm4 0h-2v2h2zm2-7h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 16H5V8h14z"/></svg>';

    #todoCheckEmptySVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>';
    #todoCheckFilledSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="m10 17l-5-5l1.41-1.42L10 14.17l7.59-7.59L19 8m-7-6A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>';
    #todoOptionAddSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M17 13h-4v4h-2v-4H7v-2h4V7h2v4h4m-5-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>';
    #todoOptionDeleteSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg>';
    #todoOptionEditSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/></svg>';

    // Projects

    createProjectListHeader(id = 'projectListHeader') {
        const projectListHeader = document.createElement('h2');
        projectListHeader.id = id;
        projectListHeader.classList.add('option-container');

        projectListHeader.innerHTML = `
            <span>Projects</span> 
            <ul class="options">
                <li class="option" id="addProjectButton">
                    ${this.#projectOptionAddSVG}
                </li>
            </ul> 
        `;

        return projectListHeader;
    }

    createProjectListItem(project, isSelected = false) {
        const projectListItem = document.createElement('li');
        projectListItem.dataset.id = project.name;

        projectListItem.classList.add('project-item');
        if (isSelected) {
            projectListItem.classList.add('selected');
        }

        projectListItem.innerHTML = `
            <button class="project-button">
                <div class="project-icon">
                    ${isSelected ? this.#projectSelectedIconSVG : this.#projectIconSVG}
                </div>
                <span class="project-name">${project.name}</span>
            </button>
            <ul class="project-options options">
                <li class="option deleteProjectButton">
                    ${this.#projectOptionDeleteSVG}
                </li>
                <li class="option editProjectButton">
                    ${this.#projectOptionEditSVG}
                </li>
            </ul> 
        `;

        return projectListItem;
    }

    createProjectList(projects = [], selectedProject = null, id = 'projectList') {
        const projectList = document.createElement('ul');
        projectList.id = id;
        projectList.classList.add('project-list');

        projects.forEach(project => {
            const isSelected = selectedProject?.name === project.name;
            const projectListItem = this.createProjectListItem(project, isSelected);
            projectList.appendChild(projectListItem);
        }); 

        return projectList;
    }

    selectProject(project) {
        const oldSelectedProject = document.querySelector('.selected');
        if(oldSelectedProject) {
            oldSelectedProject.classList.remove('selected');
            if(!oldSelectedProject.classList.contains('special-item')) {
                oldSelectedProject.querySelector('.project-icon').innerHTML = this.#projectIconSVG;
            }
        }

        const newSelectedProject = document.querySelector(`[data-id="${project.name}"]`);
        newSelectedProject.classList.add('selected');
        if(!project.isSpecial) {
            newSelectedProject.querySelector('.project-icon').innerHTML = this.#projectSelectedIconSVG;
        }
    }

    createSpecialListItem(special, isSelected = false) {
        const specialListItem = document.createElement('li');
        specialListItem.dataset.id = special;

        specialListItem.classList.add('special-item');
        if (isSelected) {
            specialListItem.classList.add('selected');
        }

        specialListItem.innerHTML = `
            <button class="special-button">
                <div class="special-icon">
                        ${
                            special === 'Inbox' ?
                                `${this.#specialIconInboxSVG}`

                            : special === 'Today' ?
                                `${this.#specialIconTodaySVG}`

                            : special === 'This week'?
                                `${this.#specialIconWeekSVG}`

                            : ''
                        }
                </div>
                <span class="special-name">${special}</span>
            </button>
        `;

        return specialListItem; 
    }

    createSpecialList(specials = [], selectedProject = null, id = 'specialList') {
        const specialList = document.createElement('ul');
        specialList.id = id;
        specialList.classList.add('special-list');

        specials.forEach(special => {
            const isSelected = selectedProject?.name === special;
            const projectListItem = this.createSpecialListItem(special, isSelected);
            specialList.appendChild(projectListItem);
        }); 

        return specialList;
    }

    // Todos

    createTodoListHeader(project, id = 'todoListHeaderContainer') {
        const todoListHeaderContainer = document.createElement('div');
        todoListHeaderContainer.id = id;
        todoListHeaderContainer.classList.add('header');

        todoListHeaderContainer.innerHTML = `
            <h1 class="project-name option-container">
                ${project.name}
                <ul class="options">
                ${
                    project.isDynamic
                    ? ''
                    : `<li class="option" id="addTodoButton">${this.#todoOptionAddSVG}</li>`
                }
                </ul>
            </h1>
        `;

        return todoListHeaderContainer;
    }

    createTodoCard(todo) {
        const todoCard = document.createElement('li');
        const dueDate = new Date(todo.dueDate);
        const currentDate = new Date();
        const isOverdue = (dueDate.getTime() - currentDate.getTime()) < 0;

        todoCard.dataset.id = todo.title;
        todoCard.dataset.parentProject = todo.parentProject;

        todoCard.classList.add('todo-card');
        if(todo.isCompleted) {
            todoCard.classList.add('completed');
        } else if(isOverdue) {
            todoCard.classList.add('overdue');
        }

        todoCard.innerHTML = `
            <div class="todo-checkbox priority-${todo.priority}"> 
                ${todo.isCompleted ? this.#todoCheckFilledSVG : this.#todoCheckEmptySVG}
            </div>
            <div class="todo-title">
                ${todo.title} 
            </div>
            <div class="todo-description">
                ${todo.description} 
            </div>
            <div class="todo-due-date">
                ${
                    todo.isCompleted
                    ? ''
                    : !todo.dueDate
                    ? ''
                    : isOverdue
                    ? 'overdue!' 
                    : formatDistanceToNow(dueDate)
                } 
            </div>
            <ul class="todo-options">
                <li class="todo-option editTodoButton">
                    ${this.#todoOptionEditSVG} 
                </li>
                <li class="todo-option deleteTodoButton">
                    ${this.#todoOptionDeleteSVG} 
                </li>
            </ul>
       `;
       return todoCard;
    }

    createTodoList(todos = [], id = 'todoListContainer') {
        const todoListContainer = document.createElement('ul');
        todoListContainer.id = id;
        todoListContainer.classList.add('todo-list');

        todos.forEach(todo => {
            const todoCard = this.createTodoCard(todo);
            todoListContainer.appendChild(todoCard);
        }); 

        return todoListContainer;
    }

    createTodoDetails(todo) {
        const todoDetails = document.createElement('li');
        todoDetails.classList.add('todo-details');

        todoDetails.innerHTML = `
            <div class="detail-item">
                <div class="detail-name">Title:</div>
                <div class="detail-value">${todo.title}</div>
            </div>
            ${
                todo.description
                ? '<div class="detail-item">'
                    + '<div class="detail-name">Description:</div>' 
                    + `<textarea readonly class="detail-value text-box" rows=5>${todo.description}</textarea>`
                + '</div>'
                : ''
            }
            ${
                todo.dueDate
                ? '<div class="detail-item">'
                    + '<div class="detail-name">Due date:</div>' 
                    + `<div class="detail-value">${lightFormat(todo.dueDate, 'yyyy-MM-dd HH:mm')}</div>`
                + '</div>'
                : ''
            }
            ${
                todo.priority
                ? '<div class="detail-item">'
                    + '<div class="detail-name">Priority:</div>' 
                    + `<div class="detail-value">${todo.priority}</div>`
                + '</div>'
                : ''
            }
            <div class="detail-item">
                <div class="detail-name">Completion:</div>
                <div class="detail-value">${todo.isCompleted}</div>
            </div>
            ${
                todo.completionDate
                ? '<div class="detail-item">'
                    + '<div class="detail-name">Completion date:</div>' 
                    + `<div class="detail-value">${lightFormat(todo.completionDate, 'yyyy-MM-dd HH:mm')}</div>`
                + '</div>'
                : ''
            }
       `;
       return todoDetails;
    }

    // Creator

    createCreatorTemplate(creatorID, title) {
        const creator = document.createElement('dialog');
        creator.id = creatorID;
        creator.classList.add('creator-dialog');

        creator.innerHTML = `
            <form class="creator-form" id="${creatorID}Form">
                <div class="creator-header" id="${creatorID}Header">
                    ${title}
                </div>
                <div class="creator-content" id="${creatorID}Content"></div>
                <div class="creator-options" id="${creatorID}Options">
                    <button class="creator-option" id=${creatorID}Create>Create</button>
                    <button class="creator-option" id=${creatorID}Cancel>Cancel</button>
                </div>
            </form>
        `;

        const cancelOption = creator.querySelector(`#${creatorID}Cancel`);
        cancelOption.addEventListener('click', (event) => {
            event.preventDefault();
            this.closeCreatorTemplate(creator);
        });

        return creator;
    }

    closeCreatorTemplate(creator) {
        creator.close(); 
    }

    createCreatorField(type, name, label, attributes = {}) {
        const id = name + 'Input';
        const field = document.createElement('div');
        field.classList.add('creator-field');

        const fieldLabel = document.createElement('label');
        fieldLabel.for = id;
        fieldLabel.textContent = label; 

        field.appendChild(fieldLabel);

        let fieldInput;
        switch(type) {
            case 'textarea': {
                fieldInput = document.createElement('textarea');
                fieldInput.cols = 50;
                fieldInput.rows = 5;
                break;
            }
            case 'select': {
                fieldInput = document.createElement('select');
                attributes.options.forEach(option => {
                    const inputOption = document.createElement('option');
                    inputOption.value = option;
                    inputOption.innerText = option;
                    fieldInput.appendChild(inputOption);
                });
                break;
            }
            default: {
                fieldInput = document.createElement('input');
                fieldInput.type = type;
                break;
            }
        }

        fieldInput.id = id;
        fieldInput.name = name;

        field.appendChild(fieldInput);

        return field;
    }
}