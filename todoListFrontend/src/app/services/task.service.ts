import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';

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
  userId: string;
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


  constructor(private http: HttpClient) { }

  createTask(task: NewTask): Observable<Task> {
    const token = localStorage.getItem('token'); 
    if (!token) {
        console.error("Token JWT não encontrado no localStorage.");
        return throwError("Token não encontrado.");
    }

    //console.log("Token JWT:", token);

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    return this.http.post<Task>(`${this.apiUrl}/`, task, { headers });
  }

  getAllTasks(): Observable<Task[]> {
    const token = localStorage.getItem('token'); 
    if (!token) {
        console.error("Token JWT não encontrado no localStorage.");
        return throwError("Token não encontrado.");
    }

    //console.log("Token JWT:", token);

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });


    return this.http.get<Task[]>(`${this.apiUrl}/`, { headers });
  }

  updateTask(id: number, task: Task): Observable<Task> {
    const token = localStorage.getItem('token'); 
    if (!token) {
        console.error("Token JWT não encontrado no localStorage.");
        return throwError("Token não encontrado.");
    }

    //console.log("Token JWT:", token);

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, { headers });
  }

  deleteTask(id: number): Observable<boolean> {
    const token = localStorage.getItem('token'); 
    if (!token) {
        console.error("Token JWT não encontrado no localStorage.");
        return throwError("Token não encontrado.");
    }

    //console.log("Token JWT:", token);

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    return this.http.delete<boolean>(`${this.apiUrl}/${id}`, { headers });
  }

  getAllCompletedTasks(): Observable<Task[]> {
    const token = localStorage.getItem('token'); 
    if (!token) {
        console.error("Token JWT não encontrado no localStorage.");
        return throwError("Token não encontrado.");
    }

    //console.log("Token JWT:", token);

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    return this.http.get<Task[]>(`${this.apiUrl}/completed`, { headers });
  }

  getAllIncompleteTasks(): Observable<Task[]> {
    const token = localStorage.getItem('token'); 
    if (!token) {
        console.error("Token JWT não encontrado no localStorage.");
        return throwError("Token não encontrado.");
    }

    //console.log("Token JWT:", token);

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    return this.http.get<Task[]>(`${this.apiUrl}/incomplete`, { headers });
  }
}
