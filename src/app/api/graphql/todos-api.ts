import { RESTDataSource } from '@apollo/datasource-rest';

interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export class TodosAPI extends RESTDataSource {
  override baseURL = 'https://jsonplaceholder.typicode.com/todos?_start=0&_limit=2';

  async getTodo(id: string): Promise<ITodo> {
    return this.get<ITodo>(`/${encodeURIComponent(id)}`);
  }

  async getTodos(): Promise<ITodo[]> {
    return this.get<ITodo[]>("");
  }


}