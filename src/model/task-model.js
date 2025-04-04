export default class TaskModel {
    #tasks = [];
  
    constructor(tasks) {
      this.#tasks = tasks;
    }
  
    getTasks() {
      return this.#tasks;
    }
  }