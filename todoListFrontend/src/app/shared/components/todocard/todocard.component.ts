import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Task, TaskService } from '../../../services/task.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todocard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todocard.component.html',
  styleUrl: './todocard.component.scss'
})
export class TodocardComponent {
  @Input() todo!: Task;
  showDetails: boolean = false;
  @Output() taskDeleted = new EventEmitter<number>();
  private subscription!: Subscription;
  @Output() editTask = new EventEmitter<Task>();

  constructor(private taskService: TaskService) {}

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  onEdit() {
    this.editTask.emit(this.todo);
  }

  deleteTask() {
    this.subscription = this.taskService.deleteTask(this.todo.id).subscribe({
      next: () => {
        console.log(`Task with ID ${this.todo.id} deleted successfully.`);
        this.taskDeleted.emit(this.todo.id);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
