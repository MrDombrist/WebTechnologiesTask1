import TaskListComponent from '../view/task-list-component.js';
import {render} from '../framework/render.js';
import {TaskStatus, TaskStatusLabels} from '../const.js';
import TaskComponent from '../view/task-component.js';
import EmptyListComponent from '../view/empty-list-component.js';
import ClearButtonComponent from '../view/clear-button-component.js';

export default class TasksBoardPresenter {
  #taskboardContainer = null;
  #taskModel = null;
  #boardTasks = [];
  #taskListComponents = {};
  #clearButtonComponent = null;
  #draggedTask = null;

  constructor(taskboardContainer, taskModel) {
    this.#taskboardContainer = taskboardContainer;
    this.#taskModel = taskModel;
    
    // Подписываемся на изменения в модели
    this.#taskModel.addObserver(this.#handleModelChange);
  }
  
  get tasks() {
    return this.#boardTasks;
  }

  init() {
    this.#boardTasks = [...this.#taskModel.tasks];
    this.#renderBoard();
  }
  
  // Метод для создания новой задачи
  createTask(title) {
    // Импортируем функцию генерации ID
    import('../utils.js').then(({generateID}) => {
      const newTask = {
        id: generateID(),
        title,
        status: TaskStatus.BACKLOG
      };
      
      this.#taskModel.addTask(newTask);
    });
  }
  
  // Обработчик события изменения модели
  #handleModelChange = (tasks) => {
    this.#boardTasks = [...tasks];
    this.#clearBoard();
    this.#renderBoard();
  }
  
  // Новый обработчик начала перетаскивания
  #handleDragStart = (task) => {
    this.#draggedTask = task;
  }
  
  // Новый обработчик события drop
  #handleTaskDrop = (taskId, newStatus, targetTaskId, position) => {
    this.#taskModel.updateTaskStatus(taskId, newStatus, targetTaskId, position);
  }
  
  // Очистка доски
  #clearBoard() {
    this.#taskboardContainer.innerHTML = '';
    Object.values(this.#taskListComponents).forEach((component) => {
      component.removeElement();
    });
    this.#taskListComponents = {};
  }
  
  // Отрисовка доски
  #renderBoard() {
    Object.values(TaskStatus).forEach((status) => {
      const tasks = this.#boardTasks.filter(task => task.status === status);
      const taskListComponent = new TaskListComponent(
        TaskStatusLabels[status],
        status,
        tasks,
        this.#handleTaskDrop,  // Передаем новый обработчик drop
        this.#handleDragStart  // Передаем новый обработчик dragStart
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
    
    this.#clearButtonComponent = new ClearButtonComponent(() => {
      this.#taskModel.clearTrash();
    }, !hasTrashTasks);
    
    render(this.#clearButtonComponent, container);
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent(task, this.#handleDragStart);
    render(taskComponent, container);
  }
}