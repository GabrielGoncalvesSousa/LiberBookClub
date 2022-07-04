//Study service designed to explore how to implement sqlite
import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Aut {
  id: number;
  nome: string;
  img: string;
}

@Injectable({
  providedIn: 'root',
})
export class dbSqliteService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  autores = new BehaviorSubject([]);
  livros = new BehaviorSubject([]);

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient
  ) {
    this.plt.ready().then(() => {
      this.sqlite
        .create({
          name: 'biblioteca.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.iniciaBaseDados();
        });
    });
  }

  iniciaBaseDados() {
    this.http.get('assets/dadosIniciais.sql', { responseType: 'text' }).subscribe((sql) => {
      this.sqlitePorter
        .importSqlToDb(this.database, sql)
        .then((_) => {
          this.loadAutores();
          this.loadLivros();
          this.dbReady.next(true);
        })
        .catch((e) => console.error(e));
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getAutores(): Observable<Aut[]> {
    return this.autores.asObservable();
  }

  getLivros(): Observable<any[]> {
    return this.livros.asObservable();
  }
  // Observable: Uma representação de qualquer conjunto de valores em qualquer altura

  // GET, CREATE, DELETE e UPDATE

  loadAutores() {
    return this.database.executeSql('SELECT * FROM autores', []).then((data) => {
      let autores: Aut[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          autores.push({
            id: data.rows.item(i).id,
            nome: data.rows.item(i).nome,
            img: data.rows.item(i).img,
          });
        }
      }
      this.autores.next(autores);
    });
  }

  addAutor(nome, img) {
    let data = [
      nome,
      img,
    ];
    return this.database.executeSql('INSERT INTO autores (nome, img) VALUES (?, ?)', data).then((data) => {
      this.loadAutores();
    });
  }

  getAutor(id): Promise<Aut> {
    return this.database
      .executeSql('SELECT * FROM autores WHERE id = ?', [
        id,
      ])
      .then((data) => {
        return {
          id: data.rows.item(0).id,
          nome: data.rows.item(0).nome,
          img: data.rows.item(0).img,
        };
      });
  }

  deleteAutor(id) {
    return this.database
      .executeSql('DELETE FROM autores WHERE id = ?', [
        id,
      ])
      .then((_) => {
        this.loadAutores();
        this.loadLivros();
      });
  }

  updateAutor(aut: Aut) {
    let data = [
      aut.nome,
      aut.img,
    ];
    return this.database.executeSql(`UPDATE autores SET nome = ?, img = ? WHERE id = ${aut.id}`, data).then((data) => {
      this.loadAutores();
    });
  }

  loadLivros() {
    let query =
      'SELECT livros.nome, livros.id, autores.nome AS autor FROM livros JOIN autores ON autores.id = livros.autorId';
    return this.database.executeSql(query, []).then((data) => {
      let livros = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          livros.push({
            nome: data.rows.item(i).nome,
            id: data.rows.item(i).id,
            autor: data.rows.item(i).autor,
          });
        }
      }
      this.livros.next(livros);
    });
  }

  addLivro(nome, autor) {
    let data = [
      nome,
      autor,
    ];
    return this.database.executeSql('INSERT INTO livros (nome, autorId) VALUES (?, ?)', data).then((data) => {
      this.loadLivros();
    });
  }
}
