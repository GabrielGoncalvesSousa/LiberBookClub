import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
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
export class MainPagePage implements OnInit, AfterViewInit, OnDestroy {
  @Output() OUTPUT_searchBarUserInput_MainPage: any;

  public isSearchBarActiveMainPage: boolean;

  constructor(private FirebaseDataService: FirebaseDataService, private router: Router) {
    this.isSearchBarActiveMainPage = false;
  }
  ngOnDestroy(): void {}

  ngOnInit() {}

  ngAfterViewInit() {}

  functionSearchBarUpdate_MainPage(event: any) {
    event !== ''
      ? ((this.isSearchBarActiveMainPage = true), (this.OUTPUT_searchBarUserInput_MainPage = event))
      : (this.isSearchBarActiveMainPage = false);
  }

  logout() {
    this.FirebaseDataService.logout().pipe(take(1)).subscribe((res) => {
      this.router.navigate([
        '/login',
      ]);
    });
  }
}
