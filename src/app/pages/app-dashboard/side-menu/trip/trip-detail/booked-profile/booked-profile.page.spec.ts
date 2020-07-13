import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookedProfilePage } from './booked-profile.page';

describe('BookedProfilePage', () => {
  let component: BookedProfilePage;
  let fixture: ComponentFixture<BookedProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookedProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookedProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
