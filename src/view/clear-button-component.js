import { createElement } from '../framework/render.js';

function createClearButtonTemplate() {
  return `<button class="clear-button">✕ Очистить</button>`;
}

export default class ClearButtonComponent {
  getTemplate() {
    return createClearButtonTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}