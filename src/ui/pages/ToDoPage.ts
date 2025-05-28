import { expect, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ToDoPage extends BasePage {
  readonly pageUrl = '/todomvc/#/';
  readonly todoInput: Locator = this.page.locator('input.new-todo');
  readonly todoItem: Locator = this.page.getByTestId('todo-item');
  readonly deleteBtn: Locator = this.page.locator('.destroy');
  readonly toggle: Locator = this.page.locator('input.toggle');
  readonly todoCounter: Locator = this.page.getByTestId('todo-count');

  async open() {
    await this.page.goto(this.pageUrl);
  }

  async assertDefaultView() {
    await Promise.all([
      expect(this.page).toHaveURL(this.pageUrl),
      expect(this.todoInput).toBeVisible(),
      expect(this.todoItem).toHaveCount(0),
      expect(this.todoCounter).toBeHidden(),
    ]);
  }

  async createTodos(names: string[]) {
    for (const name of names) {
      await this.createTodo(name);
      await this.assertTodoIsPresent(name);
    }
  }

  async createTodo(name: string) {
    await this.todoInput.fill(name);
    await this.todoInput.press('Enter');
  }

  async assertTodoIsPresent(name: string) {
    await this.waitTodoIsCreatedInLocalStorage(name);
    const createdTodo = this.getTodo(name);
    await expect(createdTodo, `Todo with name ${name} not created`).toBeVisible();
  }

  async markTodoAsCompleted(name: string) {
    const todo = this.getTodo(name);
    const todoTogggle = todo.locator(this.toggle);
    await todoTogggle.check();
    await expect(todoTogggle).toBeChecked();
  }

  async assertTodoIsCompleted(name: string) {
    const todo = this.getTodo(name);
    await this.waitTodoIsCompletedInLocalStorage(name);
    await expect(todo, `Todo with name ${name} not completed`).toContainClass('completed');
  }

  async assertTodoCount(expectedCount: number) {
    await expect(this.todoItem).toHaveCount(expectedCount);
    await this.waitNumberOfTodosInLocalStorage(expectedCount);
  }

  async assertTodosCounterIs(count: number) {
    const expectedText = count === 1 ? `${count} item left` : `${count} items left`;
    await expect(this.todoCounter).toHaveText(expectedText)
  }

  async deleteTodo(name: string) {
    const todo = this.getTodo(name);
    await todo.hover();
    await todo.locator(this.deleteBtn).click();
  }

  async assertTodoIsDeleted(name: string) {
    const todo = this.getTodo(name);
    await expect(todo, `Todo with name ${name} not deleted`).toBeHidden();
  }

  async waitTodoIsCreatedInLocalStorage(title: string) {
    await this.page.waitForFunction(t => {
      return JSON.parse(localStorage.getItem('react-todos') || '[]').map((todo: any) => todo.title).includes(t);
    }, title);
  }

  async waitTodoIsCompletedInLocalStorage(title: string) {
    await this.page.waitForFunction(t => {
      return JSON.parse(localStorage.getItem('react-todos') || '[]').filter((todo: any) => todo.completed)
        .map((todo: any) => todo.title).includes(t);
    }, title);
  }

  async waitNumberOfTodosInLocalStorage(expected: number) {
    await this.page.waitForFunction(e => {
      return JSON.parse(localStorage.getItem('react-todos') || '[]').length === e;
    }, expected);
  }

  private getTodo(name: string): Locator {
    return this.todoItem.filter({ hasText: name });
  }
}