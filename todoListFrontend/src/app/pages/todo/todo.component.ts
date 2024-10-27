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

  onSubmit() {
    if (this.todoForm.valid) {
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
  
      console.log('New Task:', newTask); 
  
      this.taskService.createTask(newTask).subscribe(
        (createdTask: Task) => {
          this.tasks.push(createdTask); 
          this.isSlidePanelOpen = false; 
          this.todoForm.reset();
        },
        (error) => {
          console.error('Error creating task', error);
        }
      );
    }
  }

  onTaskDeleted(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  openSlidePanel() {
    this.isSlidePanelOpen = true;
  }

  onCloseSlidePanel() {
    this.isSlidePanelOpen = false;
  }
}