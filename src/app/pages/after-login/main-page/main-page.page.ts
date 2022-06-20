import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FirebaseDataService } from 'src/app/api/services/firebase-data.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.page.html',
  styleUrls: [
    './main-page.page.scss',
  ],
})
export class MainPagePage implements OnInit, AfterViewInit {
  @Output() OUTPUT_searchBarUserInput_MainPage: any;

  public isSearchBarActiveMainPage: boolean;

  constructor(private FirebaseDataService: FirebaseDataService, private router: Router) {
    this.isSearchBarActiveMainPage = false;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    console.log(this.isSearchBarActiveMainPage);
  }

  functionSearchBarUpdate_MainPage(event: any) {
    event !== ''
      ? ((this.isSearchBarActiveMainPage = true), (this.OUTPUT_searchBarUserInput_MainPage = event))
      : (this.isSearchBarActiveMainPage = false);
  }

  logout() {
    console.log(`ded`);
    this.FirebaseDataService.logout().pipe(take(1)).subscribe(() => {
      this.router.navigate([
        '/login',
      ]);
    });
  }
}
