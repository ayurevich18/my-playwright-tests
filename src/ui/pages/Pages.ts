import { Page } from "@playwright/test";
import { ToDoPage } from "./ToDoPage";

export class Pages {

    readonly todoPage: ToDoPage;

    constructor(page: Page) {
    this.todoPage = new ToDoPage(page);
    }

}