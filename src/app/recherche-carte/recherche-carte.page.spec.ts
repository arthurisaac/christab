import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RechercheCartePage } from './recherche-carte.page';

describe('RechercheCartePage', () => {
  let component: RechercheCartePage;
  let fixture: ComponentFixture<RechercheCartePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechercheCartePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RechercheCartePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
