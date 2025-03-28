import HeaderComponent from './view/header-component.js';
import {render, RenderPosition} from './framework/render.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import TaskListComponent from './view/task-list-component.js';

const bodyContainer = document.querySelector('.board-app');
const formContainer =document.querySelector('.add-task');
const taskboardContainer = document.querySelector('.taskboard');

render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new FormAddTaskComponent(), formContainer);

const listsData = [
    {
      title: 'Бэклог',
      type: 'backlog',
      tasks: ['Выучить JS', 'Выучить React', 'Сделать домашку']
    },
    {
      title: 'В процессе',
      type: 'inprogress',
      tasks: ['Выпить смузи', 'Полить воды']
    },
    {
      title: 'Готово',
      type: 'done',
      tasks: ['Помыться маме', 'Погладить кота']
    },
    {
      title: 'Корзина',
      type: 'trash',
      tasks: ['Сходить погулять', 'Прочитать Войну и Мир']
    }
  ];

  
listsData.forEach(list => {
    const taskListComponent = new TaskListComponent(
      list.title,
      list.type,
      list.tasks
    );
    render(taskListComponent, taskboardContainer);
});
