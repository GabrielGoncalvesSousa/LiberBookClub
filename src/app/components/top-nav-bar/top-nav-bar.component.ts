import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { popoverController } from '@ionic/core';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: [
    './top-nav-bar.component.scss',
  ],
})
export class TopNavBarComponent implements OnInit {
  @Output() OUTPUT_searchBarActive_TopNavBar = new EventEmitter();

  public currentPopover: any;

  constructor() {}

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

  async handleButtonClick(ev: any) {
    let popover = await popoverController.create({
      component: 'popover-example-page',
      event: ev,
      translucent: true,
    });
    this.currentPopover = popover;
    return popover.present();
  }

  async dismissPopover() {
    if (this.currentPopover) {
      this.currentPopover.dismiss().then(() => {
        this.currentPopover = null;
      });
    }
  }

  ngOnInit() {
    const botao = document.getElementById('botaoSettings');

    botao.addEventListener('click', this.handleButtonClick);

    customElements.define(
      'popover-example-page',
      class ModalContent extends HTMLElement {
        connectedCallback() {
          this.innerHTML = `
          <ion-list>
            <ion-list-header>Ionic</ion-list-header>
            <ion-item button>Learn Ionic</ion-item>
            <ion-item button>Documentation</ion-item>
            <ion-item button>Showcase</ion-item>
            <ion-item button>GitHub Repo</ion-item>
          </ion-list>
        `;
        }
      }
    );
  }
}