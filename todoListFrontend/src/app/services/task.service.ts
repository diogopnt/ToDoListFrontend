import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  creationDate: string;
  updateDate: string;
  deadline: string;
  prioritization: Prioritization;
  userId: number;
}

export interface NewTask {
  title: string;
  description: string;
  completed: boolean;
  category: string;
  creationDate: string; 
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

  createTask(task: NewTask): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/`, task, {headers: this.headers });
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/`, {headers: this.headers });
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, {headers: this.headers });
  }

  deleteTask(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`, {headers: this.headers });
  }

  getAllCompletedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/completed`, {headers: this.headers });
  }

  getAllIncompleteTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/incomplete`, {headers: this.headers });
  }

  filterByCategory(category: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/filterCategory/${category}`);
  }

  filterByDeadline(deadline: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/filterDeadline/${deadline}`);
  }
}
