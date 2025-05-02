import { AbstractComponent } from '../framework/view/abstract-component.js';

function createLoadingTemplate() {
  return `
    <div class="loading">
      <p>Загрузка данных...</p>
      <div class="loading-spinner"></div>
    </div>
  `;
}

export default class LoadingViewComponent extends AbstractComponent {
  get template() {
    return createLoadingTemplate();
  }
}