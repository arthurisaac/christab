import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RenouvellementPage } from './renouvellement.page';

describe('RenouvellementPage', () => {
  let component: RenouvellementPage;
  let fixture: ComponentFixture<RenouvellementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenouvellementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RenouvellementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
