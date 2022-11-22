import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailTrajetPage } from './detail-trajet.page';

describe('DetailUrbainPage', () => {
  let component: DetailTrajetPage;
  let fixture: ComponentFixture<DetailTrajetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTrajetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailTrajetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
