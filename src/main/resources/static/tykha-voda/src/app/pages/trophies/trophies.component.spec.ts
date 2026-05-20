import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrophiesComponent } from './trophies.component';

describe('TrophiesComponent', () => {
  let component: TrophiesComponent;
  let fixture: ComponentFixture<TrophiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrophiesComponent]
    });
    fixture = TestBed.createComponent(TrophiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
