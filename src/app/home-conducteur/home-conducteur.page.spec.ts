import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeConducteurPage } from './home-conducteur.page';

describe('HomeConducteurPage', () => {
  let component: HomeConducteurPage;
  let fixture: ComponentFixture<HomeConducteurPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeConducteurPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeConducteurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
