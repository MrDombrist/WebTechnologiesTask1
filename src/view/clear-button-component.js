import { AbstractComponent } from '../framework/view/abstract-component.js';

function createClearButtonTemplate(isDisabled = false) {
  return `<button class="clear-button" ${isDisabled ? 'disabled' : ''}>✕ Очистить</button>`;
}

export default class ClearButtonComponent extends AbstractComponent {
  #isDisabled = false;
  #handleClearButtonClick = null;
  
  constructor(handleClearButtonClick, isDisabled = false) {
    super();
    this.#handleClearButtonClick = handleClearButtonClick;
    this.#isDisabled = isDisabled;
    this._setInnerHandlers();
  }
  
  get template() {
    return createClearButtonTemplate(this.#isDisabled);
  }
  
  _setInnerHandlers() {
    this.element.addEventListener('click', this.#clearButtonClickHandler);
  }
  
  #clearButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClearButtonClick();
  }
  
  setDisabled(isDisabled) {
    this.#isDisabled = isDisabled;
    this.element.disabled = isDisabled;
  }
}