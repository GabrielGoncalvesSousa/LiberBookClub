import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FirebaseDataService } from 'src/app/api/services/firebase-data.service';

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

  constructor(private FirebaseDataService: FirebaseDataService) {
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
}
