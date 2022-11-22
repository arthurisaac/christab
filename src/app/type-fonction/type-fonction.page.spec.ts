import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TypeFonctionPage } from './type-fonction.page';

describe('TypeFonctionPage', () => {
  let component: TypeFonctionPage;
  let fixture: ComponentFixture<TypeFonctionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeFonctionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TypeFonctionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
