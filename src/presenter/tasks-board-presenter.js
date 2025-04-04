import TaskListComponent from '../view/task-list-component.js';
import {render} from '../framework/render.js';
import {TaskStatus, TaskStatusLabels} from '../const.js';

export default class TasksBoardPresenter {
  #taskboardContainer = null;
  #taskModel = null;
  #boardTasks = [];

  constructor(taskboardContainer, taskModel) {
    this.#taskboardContainer = taskboardContainer;
    this.#taskModel = taskModel;
  }

  init() {
    this.#boardTasks = [...this.#taskModel.getTasks()];
    
    // Группировка задач по статусам
    const tasksByStatus = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.INPROGRESS]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.TRASH]: []
    };

    this.#boardTasks.forEach((task) => {
      if (tasksByStatus[task.status]) {
        tasksByStatus[task.status].push(task);
      }
    });

    // Отрисовка списков задач с соответствующими задачами
    Object.entries(tasksByStatus).forEach(([status, tasks]) => {
      const taskListComponent = new TaskListComponent(
        TaskStatusLabels[status],
        status,
        tasks
      );
      render(taskListComponent, this.#taskboardContainer);
    });
  }
}