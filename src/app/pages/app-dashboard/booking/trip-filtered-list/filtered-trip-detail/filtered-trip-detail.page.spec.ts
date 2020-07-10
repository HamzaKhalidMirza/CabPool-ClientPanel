import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilteredTripDetailPage } from './filtered-trip-detail.page';

describe('FilteredTripDetailPage', () => {
  let component: FilteredTripDetailPage;
  let fixture: ComponentFixture<FilteredTripDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteredTripDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilteredTripDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
