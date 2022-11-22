import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UtilisateurPage } from './utilisateur.page';

describe('UtilisateurPage', () => {
  let component: UtilisateurPage;
  let fixture: ComponentFixture<UtilisateurPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilisateurPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
