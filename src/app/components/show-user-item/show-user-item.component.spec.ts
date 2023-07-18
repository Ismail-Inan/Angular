import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUserItemComponent } from './show-user-item.component';

describe('ShowUserItemComponent', () => {
  let component: ShowUserItemComponent;
  let fixture: ComponentFixture<ShowUserItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ShowUserItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowUserItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
