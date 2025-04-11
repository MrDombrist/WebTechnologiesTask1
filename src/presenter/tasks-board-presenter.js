import TaskListComponent from '../view/task-list-component.js';
import {render} from '../framework/render.js';
import {TaskStatus, TaskStatusLabels} from '../const.js';
import TaskComponent from '../view/task-component.js';
import EmptyListComponent from '../view/empty-list-component.js'; // Добавлен новый импорт
import ClearButtonComponent from '../view/clear-button-component.js';

export default class TasksBoardPresenter {
  #taskboardContainer = null;
  #taskModel = null;
  #boardTasks = [];

  constructor(taskboardContainer, taskModel) {
    this.#taskboardContainer = taskboardContainer;
    this.#taskModel = taskModel;
  }

  init() {
    this.#boardTasks = [...this.#taskModel.tasks];
  
    Object.values(TaskStatus).forEach((status) => {
      const tasks = this.#boardTasks.filter(task => task.status === status);
      const taskListComponent = new TaskListComponent(
        TaskStatusLabels[status],
        status,
        tasks
      );
      render(taskListComponent, this.#taskboardContainer);
  
      // Используем taskListComponent.element вместо taskListElement
      if (status === TaskStatus.TRASH) {
        const clearButtonContainer = taskListComponent.element.querySelector('.clear-button-container');
        this.#renderClearButton(clearButtonContainer);
      }
    });
  }

  // Новая выделенная функция для рендеринга списка
  #renderTasksList(status, title, tasks) {
    const taskListComponent = new TaskListComponent(title, status, tasks);
    render(taskListComponent, this.#taskboardContainer);
    return taskListComponent.element;
  }

  // Новая выделенная функция для кнопки
  #renderClearButton(container) {
    if (!container) return;
    const clearButtonComponent = new ClearButtonComponent();
    render(clearButtonComponent, container);
  }

  // Новая функция для заглушки
  #renderPlaceholder(container) {
    const placeholderComponent = new EmptyListComponent();
    render(placeholderComponent, container);
  }

  // Существующая функция рендеринга задачи
  #renderTask(task, container) {
    const taskComponent = new TaskComponent(task);
    render(taskComponent, container);
  }
}