import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowInfoBookComponent } from './show-info-book.component';

describe('ShowInfoBookComponent', () => {
  let component: ShowInfoBookComponent;
  let fixture: ComponentFixture<ShowInfoBookComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ShowInfoBookComponent,
        ],
        imports: [
          IonicModule.forRoot(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ShowInfoBookComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
