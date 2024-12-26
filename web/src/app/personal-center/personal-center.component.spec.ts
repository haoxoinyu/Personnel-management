import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalCenterComponent } from './personal-center.component';
import {of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';

describe('PersonalCenterComponent', () => {
  let component: PersonalCenterComponent;
  let fixture: ComponentFixture<PersonalCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalCenterComponent],
      imports: [HttpClientTestingModule, MatDialogModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
