import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeEpisodeSelectorComponent } from './select-anime.component';

describe('AnimeEpisodeSelectorComponent', () => {
  let component: AnimeEpisodeSelectorComponent;
  let fixture: ComponentFixture<AnimeEpisodeSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimeEpisodeSelectorComponent]
    });
    fixture = TestBed.createComponent(AnimeEpisodeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
