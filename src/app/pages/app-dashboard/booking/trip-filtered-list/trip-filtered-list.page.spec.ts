import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TripFilteredListPage } from './trip-filtered-list.page';

describe('TripFilteredListPage', () => {
  let component: TripFilteredListPage;
  let fixture: ComponentFixture<TripFilteredListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripFilteredListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TripFilteredListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
