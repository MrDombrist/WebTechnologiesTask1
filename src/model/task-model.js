export default class TaskModel {
  #tasks = [];
  #observers = [];
  
  constructor(tasks) {
    this.#tasks = tasks;
  }
  
  get tasks() {
    return this.#tasks;
  }
  
  // Методы для реализации паттерна Observer
  addObserver(observer) {
    this.#observers.push(observer);
  }
  
  removeObserver(observer) {
    this.#observers = this.#observers.filter((existingObserver) => existingObserver !== observer);
  }
  
  _notify() {
    this.#observers.forEach((observer) => observer(this.#tasks));
  }
  
  // Метод для добавления новой задачи
  addTask(task) {
    this.#tasks = [...this.#tasks, task];
    this._notify();
  }
  
  // Метод для очистки корзины
  clearTrash() {
    this.#tasks = this.#tasks.filter((task) => task.status !== 'trash');
    this._notify();
  }
}