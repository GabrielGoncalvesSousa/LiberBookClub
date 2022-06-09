import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/database/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: [
    'home.page.scss',
  ],
})
export class HomePage implements OnInit {
  contador: any;
  listData: any;

  constructor(private dataService: DataService) {
    this.contador = 0;
    // this.listData = [];

    this.listData = {};
    this.loadData();
  }

  async loadData() {
    console.log('A DAR LOAD NO HOME PAGE');
    this.listData = await this.dataService.getData();
    // return await this.dataService.getData();
  }

  async getRandomString() {
    return Math.random().toString(36).slice(2, 7);
  }

  async addData() {
    let wooow = await Math.random().toString(36).slice(2, 7);

    console.log(wooow);
    const item = {
      title: 'titulo',
      autor: 'Novo Autor',
      ano: (await Math.floor(Math.random() * (2020 - 1900 + 1))) + 1900,
      [wooow]: await this.getRandomString(),
    };
    console.log('perofjperj');

    console.log(item);

    this.contador++;
    await this.dataService.addData(item);
    this.loadData();
  }

  async ngOnInit() {
    await this.loadData();
  }
  async removeItem(index) {
    console.log(index);
    console.log('caralho');

    await this.dataService.removeItem(index.key);
    this.loadData();
  }
}
