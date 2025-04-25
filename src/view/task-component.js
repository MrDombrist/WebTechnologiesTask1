import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskComponentTemplate({title}) {
  return `<li class="task-list__item">${title}</li>`;
}

export default class TaskComponent extends AbstractComponent {
  #task = null;

  constructor(task) {
    super();
    this.#task = task;
  }

  get template() {
    return createTaskComponentTemplate(this.#task);
  }
}