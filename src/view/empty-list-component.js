import { AbstractComponent } from '../framework/view/abstract-component.js';

function createEmptyListTemplate() {
  return `
    <div class="empty-list">
      <p>Задач нет</p>
    </div>
  `;
}

export default class EmptyListComponent extends AbstractComponent {
  get template() {
    return createEmptyListTemplate();
  }
}