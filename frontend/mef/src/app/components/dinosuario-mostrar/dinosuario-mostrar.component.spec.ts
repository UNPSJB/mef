import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DinosuarioMostrarComponent } from './dinosuario-mostrar.component';

describe('DinosuarioMostrarComponent', () => {
  let component: DinosuarioMostrarComponent;
  let fixture: ComponentFixture<DinosuarioMostrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DinosuarioMostrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DinosuarioMostrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
