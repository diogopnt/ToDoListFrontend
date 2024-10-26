import { Routes } from '@angular/router';
import { MasterComponent } from './shared/layouts/master/master.component';
import { TodoComponent } from './pages/todo/todo.component';

export const routes: Routes = [
    {
        path: "",
        component: MasterComponent,
        children: [{path: 'todo', component: TodoComponent }]
    }
];
