import { createElement, render } from '../framework/render.js';
import TaskComponent from './task-component.js';
import ClearButtonComponent from './clear-button-component.js';
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

export default class TaskListComponent {
  constructor(title, type, tasks) {
    this.title = title;
    this.type = type;
    this.tasks = tasks;
    this.clearButtonComponent = null;
  }

  getTemplate() {
    return createTaskListTemplate(this.title, this.type);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      
      const listElement = this.element.querySelector('.task-list__items');
      this.tasks.forEach(task => {
        const taskComponent = new TaskComponent(task);
        render(taskComponent, listElement);
      });

      // Добавляем кнопку очистки для корзины
      if (this.type === TaskStatus.TRASH) {
        const clearButtonContainer = this.element.querySelector('.clear-button-container');
        this.clearButtonComponent = new ClearButtonComponent();
        render(this.clearButtonComponent, clearButtonContainer);
      }
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}