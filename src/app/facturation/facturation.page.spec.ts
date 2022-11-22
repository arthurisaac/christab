import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FacturationPage } from './facturation.page';

describe('FacturationPage', () => {
  let component: FacturationPage;
  let fixture: ComponentFixture<FacturationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FacturationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
