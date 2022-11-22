import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrajetPassagerPage } from './trajet-passager.page';

describe('TrajetPassagerPage', () => {
  let component: TrajetPassagerPage;
  let fixture: ComponentFixture<TrajetPassagerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetPassagerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrajetPassagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
