import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrajetCartePage } from './trajet-carte.page';

describe('TrajetCartePage', () => {
  let component: TrajetCartePage;
  let fixture: ComponentFixture<TrajetCartePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetCartePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrajetCartePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
