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

  // Новый метод для обновления статуса задачи при перетаскивании
  updateTaskStatus(taskId, newStatus, targetTaskId = null, position = 'append') {
    // Найти задачу, которую нужно обновить
    const taskToUpdate = this.#tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    // Создаем новый массив без перемещаемой задачи
    let updatedTasks = this.#tasks.filter((task) => task.id !== taskId);
    
    // Обновляем статус задачи
    taskToUpdate.status = newStatus;
    
    if (targetTaskId === null || position === 'append') {
      // Просто добавляем в конец списка
      updatedTasks.push(taskToUpdate);
    } else {
      // Находим индекс целевой задачи
      const targetIndex = updatedTasks.findIndex((task) => task.id === targetTaskId);
      
      if (targetIndex !== -1) {
        // Вставляем задачу в нужную позицию
        if (position === 'before') {
          updatedTasks.splice(targetIndex, 0, taskToUpdate);
        } else if (position === 'after') {
          updatedTasks.splice(targetIndex + 1, 0, taskToUpdate);
        }
      } else {
        // Если целевая задача не найдена, добавляем в конец
        updatedTasks.push(taskToUpdate);
      }
    }
    
    this.#tasks = updatedTasks;
    this._notify();
  }
}