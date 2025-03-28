import {createElement} from '../framework/render.js';

function createFormAddTaskComponentTemplate(){
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
    )
}

export default class FormAddTaskComponent {
    getTemplate() {
      return createFormAddTaskComponentTemplate();
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
  