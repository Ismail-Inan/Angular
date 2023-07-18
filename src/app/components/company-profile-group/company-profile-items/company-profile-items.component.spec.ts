import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileItemsComponent } from './company-profile-items.component';

describe('CompanyProfileItemsComponent', () => {
  let component: CompanyProfileItemsComponent;
  let fixture: ComponentFixture<CompanyProfileItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompanyProfileItemsComponent]
    });
    fixture = TestBed.createComponent(CompanyProfileItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
