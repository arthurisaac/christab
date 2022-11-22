import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformationsConducteurPage } from './informations-conducteur.page';

describe('InformationsConducteurPage', () => {
  let component: InformationsConducteurPage;
  let fixture: ComponentFixture<InformationsConducteurPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationsConducteurPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformationsConducteurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
