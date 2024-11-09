import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss'
})
export class MasterComponent implements OnInit {
  
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.handleRedirectCallback();
  }

}
