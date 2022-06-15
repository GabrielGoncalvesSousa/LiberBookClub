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
  @Output() OUTPUT_searchBarUserInput_MainPage: string;

  public isSearchBarActiveMainPage: boolean = false;
  private data: any;

  constructor(private FirebaseDataService: FirebaseDataService) {}

  ngOnInit() {
    this.data = this.FirebaseDataService.getData();
  }

  ngAfterViewInit() {}

  functionSearchBarUpdate_MainPage(event: [boolean, string]) {
    event[0] == false
      ? (this.isSearchBarActiveMainPage = false)
      : ((this.isSearchBarActiveMainPage = true), (this.OUTPUT_searchBarUserInput_MainPage = event[1]));
  }
}
