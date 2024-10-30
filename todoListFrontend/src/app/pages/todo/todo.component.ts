import { Component } from '@angular/core';
import { TodocardComponent } from '../../shared/components/todocard/todocard.component';
import { Task, TaskService, NewTask } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { SlidePanelComponent } from '../../shared/ui/slide-panel/slide-panel.component';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Prioritization } from '../../services/task.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TodocardComponent, CommonModule, SlidePanelComponent, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {
  todoForm!: FormGroup;
  tasks: Task[] = [];
  isSlidePanelOpen = false;
  prioritizations = Object.values(Prioritization);
  minDate: string;
  selectedTask: Task | null = null;

  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.initializeForm();
    this.minDate = this.getCurrentDate(); 
  }

  getCurrentDate(): string {
    const today = new Date();
    const dd: string = String(today.getDate()).padStart(2, '0');
    const mm: string = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy: number = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  ngOnInit() {
    this.getAllTasks();
  }

  initializeForm() {
    this.todoForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      prioritization: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      deadline: new FormControl('', [Validators.required]),
      completed: new FormControl(false)
    });
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

  openSlidePanel() {
    this.isSlidePanelOpen = true;
  }

  onCloseSlidePanel() {
    this.isSlidePanelOpen = false;
    this.selectedTask = null;
    this.todoForm.reset(); 
  }  

  openEditPanel(task: Task) {
    this.selectedTask = task;
    const formattedDeadline = task.deadline ? task.deadline.split('T')[0] : null;
    this.todoForm.patchValue({ ...task, deadline: formattedDeadline });
    this.isSlidePanelOpen = true;
    console.log('Editing task:', this.selectedTask);
  }
  

  saveTask() {
    if (this.todoForm.valid) {
      let taskData: Task;
  
      if (this.selectedTask && this.selectedTask.id) {
        taskData = {
          ...this.todoForm.value,
          id: this.selectedTask.id,
          userId: this.selectedTask.userId,
          creationDate: this.selectedTask.creationDate,  
          updateDate: new Date().toISOString(),  
          deadline: new Date(this.todoForm.value.deadline).toISOString(),
        };
  
        console.log('Updating task:', taskData);
  
        this.taskService.updateTask(taskData.id, taskData).subscribe(
          (updatedTask: Task) => {
            const index = this.tasks.findIndex(t => t.id === taskData.id);
            if (index !== -1) {
              this.tasks[index] = updatedTask;
            }
            this.onCloseSlidePanel();
          },
          error => console.error('Error updating task', error)
        );
      } else {
        const newTask: NewTask = {
          title: this.todoForm.value.title,
          description: this.todoForm.value.description,
          completed: false,
          category: this.todoForm.value.category,
          creationDate: new Date().toISOString(),
          updateDate: new Date().toISOString(),
          deadline: new Date(this.todoForm.value.deadline).toISOString(),
          prioritization: this.todoForm.value.prioritization,
          userId: 1 // ID fixo
        };
  
        console.log('Creating new task:', newTask);
  
        this.taskService.createTask(newTask).subscribe(
          (createdTask: Task) => {
            this.tasks.push(createdTask);
            this.onCloseSlidePanel();
          },
          error => console.error('Error creating task', error)
        );
      }
    }
  }  
  
}