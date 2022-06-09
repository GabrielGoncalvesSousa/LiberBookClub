import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

//cordovasqlite stuff
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, from, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

const STORAGE_KEY = 'myList';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  contador: BigInteger;
  private storageReady = new BehaviorSubject(false);
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    console.log('INIT');
    await this.storage.defineDriver(cordovaSQLiteDriver);

    await this.storage.create();
    console.log('INIT DONE');

    this.storageReady.next(true);
  }

  getData() {
    //get data com sqlcordova de forma a assegurar que os dados sao carregados primeiro antes da pagina
    return this.storageReady.pipe(
      filter((ready) => ready),
      switchMap((_) => {
        console.log('OMG GET DATA');

        return (
          from(this.storage.get(STORAGE_KEY)) ||
          of({
            contador: 0,
            data: [],
          })
        );
      })
    );

    // return await ((await this.storage.get(STORAGE_KEY)) || {
    //   contador: 0,
    //   data: [],
    // });
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
