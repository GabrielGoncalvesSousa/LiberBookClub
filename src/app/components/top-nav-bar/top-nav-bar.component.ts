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
