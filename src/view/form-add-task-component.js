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
    #handleTaskAdd = null;
    
    constructor(handleTaskAdd) {
        super();
        this.#handleTaskAdd = handleTaskAdd;
        this._setInnerHandlers();
    }
    
    get template() {
      return createFormAddTaskComponentTemplate();
    }
    
    _setInnerHandlers() {
        this.element.querySelector('.new-task__button').addEventListener('click', this.#formSubmitHandler);
        this.element.querySelector('.new-task__input').addEventListener('keydown', this.#inputKeydownHandler);
    }
    
    #formSubmitHandler = (evt) => {
        evt.preventDefault();
        const input = this.element.querySelector('.new-task__input');
        const title = input.value.trim();
        
        if (title) {
            this.#handleTaskAdd(title);
            input.value = '';
        }
    }
    
    #inputKeydownHandler = (evt) => {
        if (evt.key === 'Enter') {
            evt.preventDefault();
            this.#formSubmitHandler(evt);
        }
    }
}