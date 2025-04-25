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
  #taskListComponents = {};

  constructor(taskboardContainer, taskModel) {
    this.#taskboardContainer = taskboardContainer;
    this.#taskModel = taskModel;
  }

  init() {
    this.#boardTasks = [...this.#taskModel.tasks];
    
    // Очистите контейнер перед добавлением новых элементов
    this.#taskboardContainer.innerHTML = '';
    
    Object.values(TaskStatus).forEach((status) => {
      const tasks = this.#boardTasks.filter(task => task.status === status);
      const taskListComponent = new TaskListComponent(
        TaskStatusLabels[status],
        status,
        tasks
      );

      this.#taskListComponents[status] = taskListComponent;

      render(taskListComponent, this.#taskboardContainer);
    
      // Добавляем кнопку очистки только для статуса TRASH
      if (status === TaskStatus.TRASH) {
        const clearButtonContainer = taskListComponent.getClearButtonContainer();
        if (clearButtonContainer) {
          this.#renderClearButton(clearButtonContainer);
        }
      }
    });
  }


  #renderClearButton(container) {
    if (!container) return;
    
    // Проверяем, что контейнер пустой или не содержит уже кнопку очистки
    if (!container.querySelector('.clear-button')) {
      const clearButtonComponent = new ClearButtonComponent();
      render(clearButtonComponent, container);
    }
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent(task);
    render(taskComponent, container);
  }
}