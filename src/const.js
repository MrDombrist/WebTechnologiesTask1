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