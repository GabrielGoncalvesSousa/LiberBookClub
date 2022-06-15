import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseDataService } from '../../api/services/firebase-data.service';

@Component({
  selector: 'app-results-search-bar',
  templateUrl: './results-search-bar.component.html',
  styleUrls: [
    './results-search-bar.component.scss',
  ],
})
export class ResultsSearchBarComponent implements OnInit, OnChanges {
  @Input() public INPUT_searchBarUserInput_ResultsSearchBar: string;

  public resultadoQuery: any;

  constructor(private firebaseDataService: FirebaseDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.INPUT_searchBarUserInput_ResultsSearchBar = changes.INPUT_searchBarUserInput_ResultsSearchBar.currentValue;
    this.refreshContent();
  }

  async ngOnInit() {}

  async refreshContent() {
    this.firebaseDataService.getLivroByName(this.INPUT_searchBarUserInput_ResultsSearchBar).subscribe((data) => {
      this.resultadoQuery = data;
    });
  }
}
