import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemandePassagerPage } from './demande-passager.page';

describe('DemandePassagerPage', () => {
  let component: DemandePassagerPage;
  let fixture: ComponentFixture<DemandePassagerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandePassagerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemandePassagerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
