import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskComponentTemplate({id, title}) {
  return `<li class="task-list__item" draggable="true" data-task-id="${id}">${title}</li>`;
}

export default class TaskComponent extends AbstractComponent {
  #task = null;
  #dragStartHandler = null;

  constructor(task, dragStartHandler) {
    super();
    this.#task = task;
    this.#dragStartHandler = dragStartHandler;
    this._setInnerHandlers();
  }

  get template() {
    return createTaskComponentTemplate(this.#task);
  }

  _setInnerHandlers() {
    this.element.addEventListener('dragstart', this.#onDragStart);
    this.element.addEventListener('dragend', this.#onDragEnd);
  }

  #onDragStart = (evt) => {
    evt.dataTransfer.setData('text/plain', this.#task.id);
    // Добавляем класс для стилизации перетаскиваемого элемента
    this.element.classList.add('dragging');
    
    if (this.#dragStartHandler) {
      this.#dragStartHandler(this.#task);
    }
  }

  #onDragEnd = () => {
    // Удаляем класс при завершении перетаскивания
    this.element.classList.remove('dragging');
  }
}