import Observable from '../framework/observable.js';
import { UserAction, UpdateType } from '../const.js';
import { generateID } from '../utils.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardtasks = [];

  constructor({tasksApiService}) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  get tasks() {
    return this.#boardtasks;
  }

  async init() {
    try {
      const tasks = await this.#tasksApiService.tasks;
      this.#boardtasks = tasks;
    } catch(err) {
      this.#boardtasks = [];
      console.error('Ошибка при загрузке задач:', err);
    }
    this._notify(UpdateType.INIT);
  }

  async addTask(title) {
    const newTask = {
      title,
      status: 'backlog',
      id: generateID(),
    };
    
    try {
      const createdTask = await this.#tasksApiService.addTask(newTask);
      this.#boardtasks.push(createdTask);
      this._notify(UserAction.ADD_TASK, createdTask);
      return createdTask;
    } catch (err) {
      console.error('Ошибка при добавлении задачи на сервер:', err);
      throw err;
    }
  }
  
  async updateTaskStatus(taskId, newStatus, targetTaskId = null, position = 'append') {
    const taskIndex = this.#boardtasks.findIndex((task) => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error(`Не удалось найти задачу с ID: ${taskId}`);
    }
    
    const updatedTask = {
      ...this.#boardtasks[taskIndex],
      status: newStatus
    };
    
    try {
      const response = await this.#tasksApiService.updateTask(updatedTask);
      
      // Создаем новый массив без перемещаемой задачи
      let updatedTasks = this.#boardtasks.filter((task) => task.id !== taskId);
      
      if (targetTaskId === null || position === 'append') {
        // Просто добавляем в конец списка
        updatedTasks.push(response);
      } else {
        // Находим индекс целевой задачи
        const targetIndex = updatedTasks.findIndex((task) => task.id === targetTaskId);
        
        if (targetIndex !== -1) {
          // Вставляем задачу в нужную позицию
          if (position === 'before') {
            updatedTasks.splice(targetIndex, 0, response);
          } else if (position === 'after') {
            updatedTasks.splice(targetIndex + 1, 0, response);
          }
        } else {
          // Если целевая задача не найдена, добавляем в конец
          updatedTasks.push(response);
        }
      }
      
      this.#boardtasks = updatedTasks;
      this._notify(UserAction.UPDATE_TASK, response);
      return response;
    } catch (err) {
      console.error('Ошибка при обновлении задачи на сервере:', err);
      throw err;
    }
  }
  
  async clearBasketTasks() {
    try {
      const trashTasks = this.#boardtasks.filter((task) => task.status === 'trash');
      
      // Параллельное удаление всех задач с сервера
      await Promise.all(
        trashTasks.map((task) => this.#tasksApiService.deleteTask(task.id))
      );
      
      // Обновляем локальную копию задач
      this.#boardtasks = this.#boardtasks.filter((task) => task.status !== 'trash');
      
      this._notify(UserAction.DELETE_TASK);
      return true;
    } catch (err) {
      console.error('Ошибка при удалении задач из корзины:', err);
      throw err;
    }
  }
}