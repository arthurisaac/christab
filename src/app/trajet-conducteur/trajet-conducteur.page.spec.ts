import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrajetConducteurPage } from './trajet-conducteur.page';

describe('TrajetConducteurPage', () => {
  let component: TrajetConducteurPage;
  let fixture: ComponentFixture<TrajetConducteurPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetConducteurPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrajetConducteurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
