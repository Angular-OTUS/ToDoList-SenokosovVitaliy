import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';

import { Backlog } from './backlog';

describe('Backlog', () => {
  let component: Backlog;
  let fixture: ComponentFixture<Backlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Backlog],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideTranslateService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Backlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
