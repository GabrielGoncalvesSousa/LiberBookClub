import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
const STORAGE_KEY = 'myList';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  contador: BigInteger;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    fira;
    console.log('INIT');
    await this.storage.defineDriver(cordovaSQLiteDriver);

    this.storage.create();
    console.log('INIT DONE');
  }

  async getData() {
    return await ((await this.storage.get(STORAGE_KEY)) || {
      contador: 0,
      data: [],
    });
  }

  async addData(item: any) {
    const storedData = (await this.storage.get(STORAGE_KEY)) || {
      contador: 0,
      data: [],
    };

    console.log('A INSERIR');
    console.log(storedData.data);
    storedData.data.push(item);
    return this.storage.set(STORAGE_KEY, storedData);
  }

  async removeItem(index: any) {
    const storedData = (await this.storage.get(STORAGE_KEY)) || {
      contador: 0,
      data: [],
    };

    storedData.data.splice(index, 1);
    return this.storage.set(STORAGE_KEY, storedData);
  }
}
