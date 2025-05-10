import { render } from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';
import TaskComponent from './task-component.js';
import ClearButtonComponent from './clear-button-component.js';
import EmptyListComponent from './empty-list-component.js'; 
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
  #tasksRendered = false;
  #onDropHandler = null;
  #dragStartHandler = null;
  #currentDropTarget = null;
  #currentDropPosition = null;

  constructor(title, type, tasks, onDropHandler, dragStartHandler) {
    super();
    this.#title = title;
    this.#type = type;
    this.#tasks = tasks;
    this.#onDropHandler = onDropHandler;
    this.#dragStartHandler = dragStartHandler;
  }

  get template() {
    return createTaskListTemplate(this.#title, this.#type);
  }

  get element() {
    const element = super.element;
    
    if (!this.#tasksRendered && element) {
      this.#tasksRendered = true;
      this.#renderTasks();
      this._setInnerHandlers();
    }
    
    return element;
  }
  
  #renderTasks() {
    const listElement = this.getTasksContainer();
    
    if (this.#tasks.length === 0) {
      render(new EmptyListComponent(), listElement);
    } else {
      this.#tasks.forEach(task => {
        render(new TaskComponent(task, this.#dragStartHandler), listElement);
      });
    }
  }

  _setInnerHandlers() {
    if (this.element) {
      const listContainer = this.getTasksContainer();
      listContainer.addEventListener('dragover', this.#onDragOver);
      listContainer.addEventListener('dragenter', this.#onDragEnter);
      listContainer.addEventListener('dragleave', this.#onDragLeave);
      listContainer.addEventListener('drop', this.#onDrop);
    }
  }

  #onDragEnter = (evt) => {
    evt.preventDefault();
    evt.currentTarget.classList.add('drag-over');
  }

  #onDragLeave = (evt) => {
    if (evt.currentTarget.contains(evt.relatedTarget)) {
      return;
    }
    evt.currentTarget.classList.remove('drag-over');
    this.#clearDropStyles();
  }

  #onDragOver = (evt) => {
    evt.preventDefault();
    
    // Очищаем предыдущие стили
    this.#clearDropStyles();
    
    // Определяем новую целевую точку для сброса
    const targetElement = this.#getDropTarget(evt);
    if (targetElement) {
      const position = this.#getInsertPosition(targetElement, evt);
      this.#currentDropTarget = targetElement;
      this.#currentDropPosition = position;
      
      // Добавляем соответствующий класс
      targetElement.classList.add(`drop-${position}`);
    }
  }

  #clearDropStyles() {
    if (this.#currentDropTarget) {
      this.#currentDropTarget.classList.remove('drop-before', 'drop-after');
      this.#currentDropTarget = null;
    }
  }

  #onDrop = (evt) => {
    evt.preventDefault();
    
    const listContainer = evt.currentTarget;
    listContainer.classList.remove('drag-over');
    
    const taskId = evt.dataTransfer.getData('text/plain');
    
    // Определяем, куда именно перетаскивается элемент
    const targetElement = this.#getDropTarget(evt);
    const position = targetElement ? this.#getInsertPosition(targetElement, evt) : 'append';
    const targetTaskId = targetElement ? targetElement.dataset.taskId : null;
    
    // Очищаем стили
    this.#clearDropStyles();
    
    if (this.#onDropHandler) {
      this.#onDropHandler(taskId, this.#type, targetTaskId, position);
    }
  }

  #getDropTarget(evt) {
    let targetElement = evt.target;
    // Ищем ближайший элемент li.task-list__item
    while (targetElement && !targetElement.classList.contains('task-list__item')) {
      if (targetElement === this.getTasksContainer()) {
        return null;
      }
      targetElement = targetElement.parentElement;
    }
    return targetElement;
  }

  #getInsertPosition(targetElement, evt) {
    if (!targetElement) {
      return 'append';
    }

    const rect = targetElement.getBoundingClientRect();
    const mouseY = evt.clientY;
    const threshold = rect.top + rect.height / 2;

    return mouseY < threshold ? 'before' : 'after';
  }
  
  getTasksContainer() {
    return this.element.querySelector('.task-list__items');
  }
  
  getClearButtonContainer() {
    return this.element.querySelector('.clear-button-container');
  }
}