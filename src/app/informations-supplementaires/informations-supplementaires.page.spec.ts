import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformationsSupplementairesPage } from './informations-supplementaires.page';

describe('InformationsSupplementairesPage', () => {
  let component: InformationsSupplementairesPage;
  let fixture: ComponentFixture<InformationsSupplementairesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationsSupplementairesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformationsSupplementairesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
