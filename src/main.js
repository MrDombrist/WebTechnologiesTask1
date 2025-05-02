import HeaderComponent from './view/header-component.js';
import {render, RenderPosition} from './framework/render.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TasksBoardPresenter from './presenter/tasks-board-presenter.js';
import TasksModel from './model/task-model.js';
import TasksApiService from './tasks-api-service.js';

const END_POINT = 'https://6814ccc8225ff1af162a24cf.mockapi.io/';

const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const taskboardContainer = document.querySelector('.taskboard');

const tasksApiService = new TasksApiService(END_POINT);
const tasksModel = new TasksModel({tasksApiService});
const tasksBoardPresenter = new TasksBoardPresenter(taskboardContainer, tasksModel);

// Инициализируем презентер
tasksBoardPresenter.init();

// Создаем форму добавления задачи с передачей callback для создания задачи
const formAddTaskComponent = new FormAddTaskComponent((title) => {
  tasksBoardPresenter.createTask(title);
});

render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(formAddTaskComponent, formContainer);