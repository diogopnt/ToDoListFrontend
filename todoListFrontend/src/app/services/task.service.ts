import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  creationDate: string; // Formato ISO, como '2024-10-26T10:24:33'
  updateDate: string;
  deadline: string;
  prioritization: Prioritization;
  userId: number;
}

export enum Prioritization {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/v1/tasks';

  
  username = 'admin'; 
  password = 'admin'; 
  headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
  });

  constructor(private http: HttpClient) { }

  // Cria uma nova tarefa
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/`, task);
  }

  // Retorna todas as tarefas
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/`, {headers: this.headers });
  }

  // Atualiza uma tarefa existente
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // Remove uma tarefa pelo ID
  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`, {headers: this.headers });
  }

  // Retorna todas as tarefas completadas
  getAllCompletedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/completed`);
  }

  // Retorna todas as tarefas incompletas
  getAllIncompleteTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/incomplete`);
  }

  // Filtra tarefas por categoria
  filterByCategory(category: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/filterCategory/${category}`);
  }

  // Filtra tarefas por prazo (deadline)
  filterByDeadline(deadline: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/filterDeadline/${deadline}`);
  }
}
