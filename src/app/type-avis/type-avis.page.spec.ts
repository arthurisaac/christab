import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TypeAvisPage } from './type-avis.page';

describe('TypeAvisPage', () => {
  let component: TypeAvisPage;
  let fixture: ComponentFixture<TypeAvisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeAvisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TypeAvisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
