import { Component } from '@angular/core';
import { TodocardComponent } from '../../shared/components/todocard/todocard.component';
import { Task, TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TodocardComponent, CommonModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.getAllTasks();
  }

  getAllTasks() {
    this.taskService.getAllTasks().subscribe(
      (data: Task[]) => {
        this.tasks = data;
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  onTaskDeleted(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}
