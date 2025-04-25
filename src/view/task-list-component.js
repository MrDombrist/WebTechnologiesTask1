import { render } from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';
import TaskComponent from './task-component.js';
import ClearButtonComponent from './clear-button-component.js';
import EmptyListComponent from './empty-list-component.js'; // Новый импорт
import { TaskStatus } from '../const.js';

function createTaskListTemplate(title, type) {
  return `
    <div class="task-list">
      <h3 class="task-list__title task-list__title--${type}">${title}</h3>
      <ul class="task-list__items"></ul>
      ${type === TaskStatus.TRASH ? '<div class="clear-button-container"></div>' : ''}
    </div>
  `;
}

export default class TaskListComponent extends AbstractComponent {
  #title = null;
  #type = null;
  #tasks = null;
  #tasksRendered = false; // Флаг, чтобы отслеживать, были ли задачи уже отрендерены

  constructor(title, type, tasks) {
    super();
    this.#title = title;
    this.#type = type;
    this.#tasks = tasks;
  }

  get template() {
    return createTaskListTemplate(this.#title, this.#type);
  }

  get element() {
    const element = super.element;
    
    // Задачи рендерятся только один раз
    if (!this.#tasksRendered && element) {
      this.#tasksRendered = true;
      const listElement = element.querySelector('.task-list__items');
      
      if (this.#tasks.length === 0) {
        render(new EmptyListComponent(), listElement);
      } else {
        this.#tasks.forEach(task => {
          render(new TaskComponent(task), listElement);
        });
      }
    }
    
    return element;
  }
  
  getTasksContainer() {
    return this.element.querySelector('.task-list__items');
  }
  
  getClearButtonContainer() {
    return this.element.querySelector('.clear-button-container');
  }
}
