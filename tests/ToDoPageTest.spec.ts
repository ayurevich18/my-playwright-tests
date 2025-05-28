import { test as base } from '@playwright/test';
import { Pages } from '../src/ui/pages/Pages'

const test = base.extend<{ pages: Pages }>({
  pages: async ({ page }, use) => {
    const todoPage = new Pages(page);
    await use(todoPage);
  },
});

const todos = [
  'Buy milk',
  'Read book'
]

test('E2E: add todos, mark one completed, verify counter, and delete it',
  async ({ pages }) => {
    await pages.todoPage.open();
    await pages.todoPage.createTodos(todos);
    await pages.todoPage.markTodoAsCompleted(todos[0]);
    await pages.todoPage.assertTodoIsCompleted(todos[0]);
    await pages.todoPage.assertTodoCount(todos.length);
    await pages.todoPage.assertTodosCounterIs(1);
    await pages.todoPage.deleteTodo(todos[0]);
    await pages.todoPage.assertTodoIsDeleted(todos[0]);
    await pages.todoPage.assertTodoCount(todos.length - 1);
    await pages.todoPage.assertTodoIsPresent(todos[1])
  });