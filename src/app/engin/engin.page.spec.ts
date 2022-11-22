import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnginPage } from './engin.page';

describe('EnginPage', () => {
  let component: EnginPage;
  let fixture: ComponentFixture<EnginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
