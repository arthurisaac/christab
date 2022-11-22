import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DecomptePage } from './decompte.page';

describe('DecomptePage', () => {
  let component: DecomptePage;
  let fixture: ComponentFixture<DecomptePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecomptePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DecomptePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
