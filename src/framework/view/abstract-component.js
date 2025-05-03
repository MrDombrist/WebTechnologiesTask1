import { createElement } from "../render.js";

export class AbstractComponent {
   #element = null;
   
   constructor() {
       if (new.target === AbstractComponent) {
         throw new Error('Can\'t instantiate AbstractComponent, only concrete one.');
       }
   }

   get element() {
     if (!this.#element) {
       this.#element = createElement(this.template);
     }

     return this.#element;
   }
   
   get template() {
     throw new Error('Abstract method not implemented: get template');
   }

   removeElement() {
     if (this.#element) {
       // Удаляем элемент из DOM, если он там присутствует
       if (this.#element.parentElement) {
         this.#element.remove();
       }
       this.#element = null;
     }
   }
}