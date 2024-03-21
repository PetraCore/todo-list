export default class DOMController {
    #projectSelectedIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M19 20H4a2 2 0 0 1-2-2V6c0-1.11.89-2 2-2h6l2 2h7a2 2 0 0 1 2 2H4v10l2.14-8h17.07l-2.28 8.5c-.23.87-1.01 1.5-1.93 1.5"/></svg>';
    #projectIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z"/></svg>';

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
}