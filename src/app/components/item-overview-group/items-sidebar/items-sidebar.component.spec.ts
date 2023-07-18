import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsSidebarComponent } from './items-sidebar.component';

describe('ItemsOverviewWidgetComponent', () => {
  let component: ItemsSidebarComponent;
  let fixture: ComponentFixture<ItemsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsSidebarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ItemsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
