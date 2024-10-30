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
  filteredTasks: Task[] = [];
  filter: 'ALL' | 'COMPLETED' | 'INCOMPLETED' = 'ALL'; 
  selectedCategory: string | null = null;
  categories: string[] = [];
  sortCriteria: 'creationDate' | 'deadline' = 'creationDate';
  sortDirection: 'asc' | 'desc' = 'asc';


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
        this.applyFilter();
        this.extractCategories();
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  extractCategories() {
    const categoriesSet = new Set(this.tasks.map(task => task.category));
    this.categories = Array.from(categoriesSet);
  }

  applyFilter() {
    let filtered = this.tasks;
    if (this.filter === 'COMPLETED') {
      filtered = filtered.filter(task => task.completed);
    } else if (this.filter === 'INCOMPLETED') {
      filtered = filtered.filter(task => !task.completed);
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(task => task.category === this.selectedCategory);
    }

    this.filteredTasks = filtered;
    this.sortTasks();
  }
  
  setFilter(filter: 'ALL' | 'COMPLETED' | 'INCOMPLETED') {
    this.filter = filter;
    this.applyFilter();
  }

  setCategoryFilter(category: string | null) {
    this.selectedCategory = category;
    this.applyFilter();
  }

  onTaskDeleted(id: number) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.extractCategories(); 

    if (this.selectedCategory && !this.categories.includes(this.selectedCategory)) {
      this.selectedCategory = null;
    }
    this.applyFilter();
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
            this.extractCategories();
            this.onCloseSlidePanel();
          },
          error => console.error('Error creating task', error)
        );
      }
    }
  }
  
  sortTasks() {
    this.filteredTasks.sort((a, b) => {
      const dateA = new Date(a[this.sortCriteria]).getTime();
      const dateB = new Date(b[this.sortCriteria]).getTime();
      
      if (this.sortDirection === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }

  setSortCriteria(criteria: 'creationDate' | 'deadline') {
    this.sortCriteria = criteria;
    this.sortTasks();
  }
  
  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortTasks();
  }
  
}