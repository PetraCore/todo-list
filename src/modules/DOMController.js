export default class DOMController {
    #projectSelectedIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7a2 2 0 0 1 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5"/></svg>';
    #projectIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z"/></svg>';
    #todoCheckEmptySVG = '<svg class="todo-check" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>';
    #todoCheckFilledSVG = '<svg class="todo-check checked" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="m10 17l-5-5l1.41-1.42L10 14.17l7.59-7.59L19 8m-7-6A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>';
    #todoOptionEditSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/></svg>';
    #todoOptionRemoveSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg>';
    #todoOptionAddSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M17 13h-4v4h-2v-4H7v-2h4V7h2v4h4m-5-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>';

    createProjectListElement(projects = [], selectedProject = null, id = 'projectListContainer') {
        const projectListContainer = document.createElement('ul');
        projectListContainer.id = id;
        projectListContainer.classList.add('project-list');

        let projectListContainerHTML = '';
        projects.forEach(project => {
            const isSelected = selectedProject.name === project.name;

            projectListContainerHTML += `
                <li class="project-item ${isSelected ? 'selected' : ''}">
                       <button class="project-button">
                        <div class="project-icon">
                            ${isSelected ? this.#projectSelectedIconSVG : this.#projectIconSVG}
                        </div>
                        <span class="project-name">${project.name}</span>
                     </button>
                </li>
            `;
        }); 

        projectListContainer.innerHTML = projectListContainerHTML;
        return projectListContainer;
    }

    createTodoListHeaderElement(project, id = 'todoListHeaderContainer') {
        const todoListHeaderContainer = document.createElement('div');
        todoListHeaderContainer.id = id;
        todoListHeaderContainer.classList.add('header');

        todoListHeaderContainer.innerHTML = `
            <h1 class="project-name option-container">
                ${project.name}
                <ul class="options">
                    <li class="option" id="addTodoBtn">
                        ${this.#todoOptionAddSVG}
                    </li>
                </ul>
            </h1>
        `;

        return todoListHeaderContainer;
    }

    createTodoListElement(todos = [], id = 'todoListContainer') {
        const todoListContainer = document.createElement('ul');
        todoListContainer.id = id;
        todoListContainer.classList.add('todo-list');

        let todoListContainerHTML = '';
        todos.forEach(todo => {
            todoListContainerHTML += `
                <li class="todo-card">
                    ${todo.isCompleted ? this.#todoCheckFilledSVG : this.#todoCheckEmptySVG}
                    <div class="todo-title">
                        ${todo.title} 
                    </div>
                    <div class="todo-due-date">
                        ${todo.dueDate} 
                    </div>
                    <ul class="todo-options">
                        <li class="todo-option">
                            ${this.#todoOptionEditSVG} 
                        </li>
                        <li class="todo-option">
                            ${this.#todoOptionRemoveSVG} 
                        </li>
                    </ul>
                </li>
            `;
        }); 

        todoListContainer.innerHTML = todoListContainerHTML;
        return todoListContainer;

    }
}