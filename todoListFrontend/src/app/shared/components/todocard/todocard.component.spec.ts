import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodocardComponent } from './todocard.component';

describe('TodocardComponent', () => {
  let component: TodocardComponent;
  let fixture: ComponentFixture<TodocardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodocardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodocardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
