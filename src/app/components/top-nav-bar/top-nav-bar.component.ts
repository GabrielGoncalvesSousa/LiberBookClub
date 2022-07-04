import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { popoverController } from '@ionic/core';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: [
    './top-nav-bar.component.scss',
  ],
})
export class TopNavBarComponent implements OnInit, OnDestroy {
  @Output() OUTPUT_searchBarActive_TopNavBar = new EventEmitter();

  public currentPopover: any;

  constructor() {}
  ngOnDestroy(): void {
    console.log('DESTROY TOP NAV BAR');
  }

  //When the content is changed, it emmits an array with ['userString':String , true:boolean] in case
  //theres is a string in the search bar , or ['',false] in case there isnt anything in the search bar
  //this verification is done in order to load all books in case the search bar is empty (when the user deletes everything) 
  onSearchChange(ev: any) {
    console.log(ev.target.value.length);
    if (ev.target.value.length > 0) {
      this.OUTPUT_searchBarActive_TopNavBar.emit([
        ev.target.value,
        true,
      ]);
    } else {
      this.OUTPUT_searchBarActive_TopNavBar.emit([
        '',
        false,
      ]);
    }
  }

  ngOnInit() {}
}
