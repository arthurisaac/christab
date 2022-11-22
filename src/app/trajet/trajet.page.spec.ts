import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrajetPage } from './trajet.page';

describe('TrajetPage', () => {
  let component: TrajetPage;
  let fixture: ComponentFixture<TrajetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrajetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
