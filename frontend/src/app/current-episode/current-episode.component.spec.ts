import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentEpisodeComponent } from './current-episode.component';

describe('CurrentEpisodeComponent', () => {
  let component: CurrentEpisodeComponent;
  let fixture: ComponentFixture<CurrentEpisodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentEpisodeComponent]
    });
    fixture = TestBed.createComponent(CurrentEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
