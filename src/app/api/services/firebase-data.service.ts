import { Injectable } from '@angular/core';
import { collection, collectionData, docData, Firestore } from '@angular/fire/firestore';
import { doc, getDocs, query, where } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Genero } from '../models/genero.model';
import { Livro } from '../models/livro.model';
import { Utilizador } from '../models/utilizador.model';
import { Utilizador_livro } from '../models/utilizador_livro.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDataService {
  constructor(private firestore: Firestore) {}
  //Referias as collections do firebase
  private livroCollectionRef = collection(this.firestore, 'livro');
  private generoCollectionRef = collection(this.firestore, 'genero');
  private utilizadorCollectionRef = collection(this.firestore, 'utilizador');
  private utilizador_livroCollectionRef = collection(this.firestore, 'utilizador_livro');
  private comentarioCollectionRef = collection(this.firestore, 'comentario');

  private data = this.getData();

  getUtilizadores(): Observable<Utilizador[]> {
    return collectionData(this.utilizadorCollectionRef, { idField: 'id' }) as Observable<Utilizador[]>;
  }

  getLivros(): Observable<Livro[]> {
    return collectionData(this.livroCollectionRef, { idField: 'id' }) as Observable<Livro[]>;
  }

  getGeneros(): Observable<Genero[]> {
    return collectionData(this.generoCollectionRef, { idField: 'id' }) as Observable<Genero[]>;
  }

  getUtilizador_Livro(): Observable<Utilizador_livro[]> {
    return collectionData(this.utilizador_livroCollectionRef, { idField: 'id' }) as Observable<Utilizador_livro[]>;
  }

  getData() {
    let data = {
      livros: [],
      generos: [],
      utilizadores: [],
      utilizador_livro: [],
    };

    this.getUtilizadores().subscribe((res) => {
      res.forEach((element) => {
        data.utilizadores.push(element);
      });
    });

    this.getLivros().subscribe((res) => {
      res.forEach((element) => {
        data.livros.push(element);
      });
    });

    this.getGeneros().subscribe((res) => {
      res.forEach((element) => {
        data.generos.push(element);
      });
    });

    this.getUtilizador_Livro().subscribe((res) => {
      res.forEach((element) => {
        data.utilizador_livro.push(element);
      });
    });

    return data;
  }

  getLivroByName(name: string): Observable<Livro[]> {
    const queryLivro = query(this.livroCollectionRef, where('nome', '>=', name), where('nome', '<=', name + '\uf8ff'));
    const livroCollectionData = collectionData(queryLivro, { idField: 'id' }) as Observable<Livro[]>;
    return livroCollectionData;
  }

  getUtilizadorById(id: any): Observable<Utilizador> {
    const userDocRef = doc(this.firestore, `utilizador/${id}`);
    return docData(userDocRef, { idField: 'id' }) as Observable<Utilizador>;
  }

  getlivroByGeneroId(id: any) {
    //Buscar dados do livro e criar colecao com a idField atraves da query
    const queryLivro = query(this.livroCollectionRef, where('id_genero', '==', `${id}`));
    const livroCollectionData = collectionData(queryLivro, { idField: 'id' }) as Observable<Livro[]>;

    //Buscar dados genero e criar collection com id field sem query
    const generoCollectionData = collectionData(this.generoCollectionRef, { idField: 'id' }) as Observable<Genero[]>;

    //Var que vai guardar o nome do genero
    let generoNome: String;

    //Criar observable
    const observable = new Observable((observable) => {
      //Iterar a collection de generos e guardar o nome do genero
      generoCollectionData.subscribe((data) => {
        data.forEach((element) => {
          if (element.id == id) {
            generoNome = element.nomeGenero;
          }
        });
      });

      //Iterar a collection de livros e guardar o nome do genero do livro
      livroCollectionData.subscribe((data) => {
        data.forEach((livro) => {
          livro['generoNome'] = generoNome;
        });
        observable.next(data);
      });
    });

    return observable;
  }

  getUtilizadores_livroByIdLivro(idLivro: any) {
    const queryUtilizadorLivro = query(this.utilizador_livroCollectionRef, where('id_livro', '==', idLivro));

    const utilizadorLivroCollectionData = collectionData(queryUtilizadorLivro, { idField: 'id' }) as Observable<
      Utilizador_livro[]
    >;
    return utilizadorLivroCollectionData;
  }

  getComentarioByBookId(id: any) {
    const queryComentario = query(this.comentarioCollectionRef, where('id', '==', id));
    const comentarioCollectionData = collectionData(queryComentario, { idField: 'id' }) as Observable<Livro[]>;
    return comentarioCollectionData;
  }
}
