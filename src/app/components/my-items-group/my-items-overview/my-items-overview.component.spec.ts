import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyItemsOverviewComponent } from './my-items-overview.component';

describe('MyItemsOverviewComponent', () => {
  let component: MyItemsOverviewComponent;
  let fixture: ComponentFixture<MyItemsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MyItemsOverviewComponent]
    });
    fixture = TestBed.createComponent(MyItemsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
