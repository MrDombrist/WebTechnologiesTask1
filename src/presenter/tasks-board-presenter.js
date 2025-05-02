import TaskListComponent from '../view/task-list-component.js';
import {render} from '../framework/render.js';
import {TaskStatus, TaskStatusLabels, UserAction, UpdateType} from '../const.js';
import TaskComponent from '../view/task-component.js';
import EmptyListComponent from '../view/empty-list-component.js';
import ClearButtonComponent from '../view/clear-button-component.js';
import LoadingViewComponent from '../view/loading-view-component.js';

export default class TasksBoardPresenter {
  #taskboardContainer = null;
  #tasksModel = null;
  #boardTasks = [];
  #taskListComponents = {};
  #clearButtonComponent = null;
  #draggedTask = null;
  #isLoading = true;
  #loadingComponent = new LoadingViewComponent();

  constructor(taskboardContainer, tasksModel) {
    this.#taskboardContainer = taskboardContainer;
    this.#tasksModel = tasksModel;
    
    // Подписываемся на изменения в модели
    this.#tasksModel.addObserver(this.#handleModelEvent);
  }
  
  get tasks() {
    return this.#boardTasks;
  }

  async init() {
    this.#renderLoading();
    await this.#tasksModel.init();
  }
  
  #handleModelEvent = (eventType, payload) => {
    switch (eventType) {
      case UserAction.ADD_TASK:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UserAction.UPDATE_TASK:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UserAction.DELETE_TASK:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#boardTasks = [...this.#tasksModel.tasks];
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };
  
  // Метод для создания новой задачи
  async createTask(title) {
    try {
      await this.#tasksModel.addTask(title);
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  }
  
  // Новый обработчик начала перетаскивания
  #handleDragStart = (task) => {
    this.#draggedTask = task;
  }
  
  // Новый обработчик события drop
  #handleTaskDrop = async (taskId, newStatus, targetTaskId, position) => {
    try {
      await this.#tasksModel.updateTaskStatus(taskId, newStatus, targetTaskId, position);
    } catch (err) {
      console.error('Ошибка при перемещении задачи:', err);
    }
  }
  
  // Отображение компонента загрузки
  #renderLoading() {
    render(this.#loadingComponent, this.#taskboardContainer);
  }
  
  // Очистка доски
  #clearBoard() {
    if (this.#isLoading) {
      this.#loadingComponent.removeElement();
    }
    
    this.#taskboardContainer.innerHTML = '';
    Object.values(this.#taskListComponents).forEach((component) => {
      component.removeElement();
    });
    this.#taskListComponents = {};
  }
  
  // Отрисовка доски
  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    Object.values(TaskStatus).forEach((status) => {
      const tasks = this.#boardTasks.filter(task => task.status === status);
      const taskListComponent = new TaskListComponent(
        TaskStatusLabels[status],
        status,
        tasks,
        this.#handleTaskDrop,
        this.#handleDragStart
      );

      this.#taskListComponents[status] = taskListComponent;

      render(taskListComponent, this.#taskboardContainer);
    
      // Добавляем кнопку очистки только для статуса TRASH
      if (status === TaskStatus.TRASH) {
        const clearButtonContainer = taskListComponent.getClearButtonContainer();
        if (clearButtonContainer) {
          this.#renderClearButton(clearButtonContainer, tasks.length > 0);
        }
      }
    });
  }

  #renderClearButton(container, hasTrashTasks) {
    if (!container) return;
    
    // Если кнопка уже существует, удаляем ее
    if (this.#clearButtonComponent) {
      this.#clearButtonComponent.removeElement();
    }
    
    this.#clearButtonComponent = new ClearButtonComponent(async () => {
      try {
        await this.#tasksModel.clearBasketTasks();
      } catch (err) {
        console.error('Ошибка при очистке корзины:', err);
      }
    }, !hasTrashTasks);
    
    render(this.#clearButtonComponent, container);
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent(task, this.#handleDragStart);
    render(taskComponent, container);
  }
}