import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { take } from 'rxjs/operators';
import { Livro } from 'src/app/api/models/livro.model';
import { FirebaseDataService } from 'src/app/api/services/firebase-data.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.page.html',
  styleUrls: [
    './my-list.page.scss',
  ],
})
export class MyListPage implements OnInit {
  private userBookList: Livro[] = [];

  constructor(public firebase: FirebaseDataService, private toast: HotToastService) {}

  ngOnInit() {
    this.updateContent();
  }

  removeBookFromList(livro: Livro) {
    this.firebase.currentUser$.pipe(take(1)).subscribe((user) => {
      for (let i = 0; i < this.userBookList.length; i++) {
        if (this.userBookList[i].id == livro.id && i > 0) {
          console.log(i);

          this.userBookList.splice(i, 1);
        } else if (this.userBookList.length == 0) {
          this.userBookList = [];
        }
      }

      this.firebase.removeFromList(livro.id, user.uid);
    });
  }

  updateContent() {
    this.firebase.getUserList().pipe(take(1)).subscribe((res: any[]) => {
      console.log(res);
      res.forEach((element) => {
        console.log(element);

        this.firebase.getLivroById(element.id_livro).pipe(take(1)).subscribe((livro: Livro) => {
          if (element.isList == true) {
            this.userBookList.push(livro);
            console.log(this.userBookList);
          }
        }).unsubscribe;
      });
    }).unsubscribe;
  }
}
