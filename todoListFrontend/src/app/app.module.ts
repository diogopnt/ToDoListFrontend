import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';

@NgModule({
  declarations: [ 
  ],
  imports: [
    BrowserModule, 
  ],
  providers: [TaskService],
  bootstrap: []
})
export class AppModule { }
