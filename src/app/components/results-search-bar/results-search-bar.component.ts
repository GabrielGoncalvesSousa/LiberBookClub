import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { take } from 'rxjs/operators';

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

  constructor(private toast: HotToastService, private firebaseDataService: FirebaseDataService, public router: Router) {
    this.resultadoQuery = [];
    this.firstLoad();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshContent();
  }

  ngOnInit() {}

  refreshContent() {
    console.log('refreshing');

    if (this.INPUT_searchBarUserInput_ResultsSearchBar) {
      if (this.INPUT_searchBarUserInput_ResultsSearchBar[1] !== false) {
        this.firebaseDataService.getLivroByName(this.INPUT_searchBarUserInput_ResultsSearchBar[0]).subscribe((data) => {
          this.resultadoQuery = data;
          console.log(this.resultadoQuery);
        }).unsubscribe;
      } else {
        this.firstLoad();
      }
    }
  }

  firstLoad() {
    this.firebaseDataService.getLivros().subscribe((data) => {
      this.resultadoQuery = data;

      console.log(this.resultadoQuery);
    }).unsubscribe;
    this.didUserClickOnBook = false;
  }

  public goToBook(book: any) {
    this.didUserClickOnBook = true;
    let utilizador_livro;
    let comentarios;
    this.firebaseDataService.getUtilizadores_livroByIdLivro(book.id).pipe(take(1)).subscribe((data) => {
      utilizador_livro = data;
    }).unsubscribe;

    this.resultadoQuery = book;
    // this.router.navigate([
    //   '/main-menu',
    // ]);
  }

  addToList(book: any) {
    this.firebaseDataService
      .addBookToList(book.id)
      .pipe(
        this.toast.observe({
          success: 'Added to list',
          loading: 'Adding to list',
          error: 'Book already in list',
        })
      )
      .subscribe((res) => {
        console.log(res);
      });
  }
}
