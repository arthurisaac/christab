import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlertePage } from './alerte.page';

describe('AlertePage', () => {
  let component: AlertePage;
  let fixture: ComponentFixture<AlertePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
