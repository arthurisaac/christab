import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItinerairePage } from './itineraire-page.component';

describe('TrajetPage', () => {
  let component: ItinerairePage;
  let fixture: ComponentFixture<ItinerairePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItinerairePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItinerairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
