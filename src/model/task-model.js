export default class TaskModel {
    #tasks = [];
  
    constructor(tasks) {
      this.#tasks = tasks;
    }
  
    get tasks() {
      return this.#tasks;
    }
  }