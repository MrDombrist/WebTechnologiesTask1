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
  #clearButtonComponent = null;

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
    if (!super.element) {
      return super.element;
    }
    
    const listElement = super.element.querySelector('.task-list__items');
    
    // НОВАЯ ЛОГИКА: Проверка на пустые задачи
    if (this.#tasks.length === 0) {
      render(new EmptyListComponent(), listElement);
    } else {
      this.#tasks.forEach(task => {
        render(new TaskComponent(task), listElement);
      });
    }

    if (this.#type === TaskStatus.TRASH) {
      const clearButtonContainer = super.element.querySelector('.clear-button-container');
      this.#clearButtonComponent = new ClearButtonComponent();
      render(this.#clearButtonComponent, clearButtonContainer);
    }
    
    return super.element;
  }
}