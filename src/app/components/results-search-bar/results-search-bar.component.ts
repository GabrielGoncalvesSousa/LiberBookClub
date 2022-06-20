import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() public INPUT_searchBarUserInput_ResultsSearchBar: [string, boolean];

  public resultadoQuery: any;
  public didUserClickOnBook: boolean;

  constructor(private firebaseDataService: FirebaseDataService, public router: Router) {
    this.resultadoQuery = [];
    this.firstLoad();
    console.log(this.resultadoQuery);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.INPUT_searchBarUserInput_ResultsSearchBar);
    this.refreshContent();
  }

  async ngOnInit() {
    console.log('wtf');
  }

  async refreshContent() {
    if (this.INPUT_searchBarUserInput_ResultsSearchBar) {
      if (this.INPUT_searchBarUserInput_ResultsSearchBar[1] !== false) {
        this.firebaseDataService.getLivroByName(this.INPUT_searchBarUserInput_ResultsSearchBar[0]).subscribe((data) => {
          this.resultadoQuery = data;
          console.log(this.resultadoQuery);
        });
      } else {
        this.firstLoad();
      }
    }
  }

  async firstLoad() {
    this.firebaseDataService.getLivros().subscribe((data) => {
      this.resultadoQuery = data;

      console.log(this.resultadoQuery);
    });
    this.didUserClickOnBook = false;
  }

  public goToBook(book: any) {
    this.didUserClickOnBook = true;
    let utilizador_livro;
    let comentarios;
    this.firebaseDataService.getUtilizadores_livroByIdLivro(book.id).subscribe((data) => {
      utilizador_livro = data;
    });

    this.resultadoQuery = book;
    // this.router.navigate([
    //   '/main-menu',
    // ]);
  }
}
