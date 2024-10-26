import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';

@NgModule({
  declarations: [
    AppComponent 
  ],
  imports: [
    BrowserModule,    
    HttpClientModule 
  ],
  providers: [TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
