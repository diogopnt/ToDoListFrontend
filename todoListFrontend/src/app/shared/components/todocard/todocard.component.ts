import { Component, Input } from '@angular/core';
import { Task } from '../../../services/task.service';
import { CommonModule } from '@angular/common';

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

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

}
