import { AbstractComponent } from '../framework/view/abstract-component.js';

function createFormAddTaskComponentTemplate() {
    return(
        `
        <div class="new-task">
            <h2 class="new-task__title">Новая задача</h2>
            <div class="new-task__form">
                <input type="text" class="new-task__input" placeholder="Название задачи...">
                <button class="new-task__button">+ Добавить</button>
            </div>
        </div>
        `
    );
}

export default class FormAddTaskComponent extends AbstractComponent {
    get template() {
      return createFormAddTaskComponentTemplate();
    }
}