import TaskListComponent from '../view/task-list-component.js';
import {render, RenderPosition} from '../framework/render.js';
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
    // Обновляем локальную копию задач из модели
    this.#boardTasks = [...this.#tasksModel.tasks];
    
    switch (eventType) {
      case UserAction.ADD_TASK:
        // При добавлении задачи полностью перерисовываем доску
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UserAction.UPDATE_TASK:
        // При любом обновлении задачи перерисовываем все секции
        // Это гарантирует, что ничего не пропадет
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UserAction.DELETE_TASK:
        // При удалении задачи перерисовываем все секции
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
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
  
  // Обработчик начала перетаскивания
  #handleDragStart = (task) => {
    this.#draggedTask = {...task}; // Создаем копию для сравнения
  }
  
  // Обработчик события drop
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
    
    // Удаляем все компоненты из памяти перед очисткой DOM
    Object.values(this.#taskListComponents).forEach((component) => {
      if (component && typeof component.removeElement === 'function') {
        component.removeElement();
      }
    });
    
    // Очищаем DOM
    this.#taskboardContainer.innerHTML = '';
    
    // Очищаем ссылки на компоненты
    this.#taskListComponents = {};
    if (this.#clearButtonComponent) {
      this.#clearButtonComponent.removeElement();
      this.#clearButtonComponent = null;
    }
  }
  
  // Отрисовка доски
  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    // Отрисовываем все списки задач
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
}