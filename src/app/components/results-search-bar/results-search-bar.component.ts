import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { mergeMap, take } from 'rxjs/operators';
import { Comentario } from 'src/app/api/models/comentario.model';
import { runInThisContext } from 'vm';

import { FirebaseDataService } from '../../api/services/firebase-data.service';

@Component({
  selector: 'app-results-search-bar',
  templateUrl: './results-search-bar.component.html',
  styleUrls: [
    './results-search-bar.component.scss',
  ],
})
export class ResultsSearchBarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public INPUT_searchBarUserInput_ResultsSearchBar: [string, boolean];

  public infoComents: Comentario[];
  public resultadoQuery: any;
  public didUserClickOnBook: boolean;
  public coments = [];
  public book_user = [];
  public userInfo = [];
  public infoEditada = [];

  constructor(private toast: HotToastService, private firebaseDataService: FirebaseDataService, public router: Router) {
    this.resultadoQuery = [];
    this.firstLoad();
  }
  ngOnDestroy(): void {
    this.coments = [];
    this.book_user = [];
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
    this.coments = [];
    this.book_user = [];
    this.firebaseDataService.getLivros().subscribe((data) => {
      this.resultadoQuery = data;

      console.log(this.resultadoQuery);
    }).unsubscribe;
    this.didUserClickOnBook = false;
  }

  public goToBook(book: any) {
    this.didUserClickOnBook = true;
    this.firebaseDataService
      .getUtilizadores_livroByIdLivro(book.id)
      .pipe(take(1))
      .subscribe((res_utilizadores_livro) => {
        res_utilizadores_livro.forEach((utili_livro) => {
          this.book_user.push(utili_livro);

          this.firebaseDataService
            .getUtilizadorById(utili_livro.id_utilizador)
            .pipe(take(1))
            .subscribe((utilizador) => {
              if (utilizador) {
                this.userInfo.push(utilizador);
              }

              this.firebaseDataService
                .getComentarioPorIdUtilizadorLivro(utili_livro.id)
                .pipe(take(1))
                .subscribe((comen) => {
                  if (utilizador) {
                    console.log('utili');
                    console.log(utilizador);
                  }

                  console.log('cm');
                  console.log(comen[0]);
                  console.log('utiliLivro');
                  console.log(utili_livro);

                  if (comen.length > 0) {
                    console.log('AHHHHHHHHHHH');
                    console.log(comen);

                    this.coments.push(comen[0]);

                    if (utilizador) {
                      this.userInfo.push(utilizador);
                      let temp = {
                        comentario: comen[0].comentario,
                        avaliacao: comen[0].avaliacao,
                        data: comen[0].data,
                        user: utilizador.email,
                      };
                      this.infoEditada.push(temp);
                    }

                    console.log('INFO JUNTADA OMG');
                    this.book_user.forEach((bkuser) => {
                      this.coments.forEach((coment) => {
                        this.userInfo.forEach((userInfo) => {
                          // console.log('bkuser');
                          // console.log(bkuser);
                          // console.log('coment');
                          // console.log(coment);
                          // console.log('userInfo');
                          // console.log(userInfo);
                        });
                      });
                    });
                  }
                });
            });
        });
      });

    this.resultadoQuery = book;

    console.log('BOOK USERS');
    console.log(this.book_user);

    console.log('COMENTS');
    console.log(this.coments);

    console.log('USER INFO');
    console.log(this.userInfo);

    console.log('INFO JUNTADA OMG');
    console.log(this.infoEditada);
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
