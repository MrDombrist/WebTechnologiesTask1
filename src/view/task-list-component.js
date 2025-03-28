import { createElement, render } from '../framework/render.js';
import TaskComponent from './task-component.js';

function createTaskListTemplate(title, type) {
  return `
    <div class="task-list">
      <h3 class="task-list__title task-list__title--${type}">${title}</h3>
      <ul class="task-list__items"></ul>
      ${type === 'trash' ? '<button class="clear-button">✕ Очистить</button>' : ''}
    </div>
  `;
}

export default class TaskListComponent {
  constructor(title, type, tasks) {
    this.title = title;
    this.type = type;
    this.tasks = tasks;
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
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}