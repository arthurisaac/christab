import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemandePage } from './demande.page';

describe('DemandePage', () => {
  let component: DemandePage;
  let fixture: ComponentFixture<DemandePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
