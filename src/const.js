export const TaskStatus = {
    BACKLOG: 'backlog',
    INPROGRESS: 'inprogress',
    DONE: 'done',
    TRASH: 'trash'
  };
  
  export const TaskStatusLabels = {
    [TaskStatus.BACKLOG]: 'Бэклог',
    [TaskStatus.INPROGRESS]: 'В процессе',
    [TaskStatus.DONE]: 'Готово',
    [TaskStatus.TRASH]: 'Корзина'
  };

  export const UserAction = {
    UPDATE_TASK: 'UPDATE_TASK',
    ADD_TASK: 'ADD_TASK',
    DELETE_TASK: 'DELETE_TASK'
  };
  
  export const UpdateType = {
    PATCH: 'PATCH',
    MINOR: 'MINOR',
    MAJOR: 'MAJOR',
    INIT: 'INIT'
  };
