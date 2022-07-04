//Firebase service, currently the app only works with firebase and its expected to be implemented local storage via ionic storage
import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  docData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { doc, getDocs, query, where } from '@firebase/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';

//Import dos modelos da base de dados
import { Genero } from '../models/genero.model';
import { Livro } from '../models/livro.model';
import { Utilizador } from '../models/utilizador.model';
import { Utilizador_livro } from '../models/utilizador_livro.model';

import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { Comentario } from '../models/comentario.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDataService {
  //Injetacao do firestore, do firebaseauth e to hotToastService
  constructor(private firestore: Firestore, public fireBaseAuth: Auth, public toast: HotToastService) {}

  //References as collections do firebase
  public isLoggeinOn = false;
  public livroCollectionRef = collection(this.firestore, 'livro');
  public generoCollectionRef = collection(this.firestore, 'genero');
  public utilizadorCollectionRef = collection(this.firestore, 'utilizador');
  public utilizador_livroCollectionRef = collection(this.firestore, 'utilizador_livro');
  public comentarioCollectionRef = collection(this.firestore, 'comentario');

  //Guardar o current user numa variavel destinada a guardar o user usando o auth do firebase
  currentUser$ = authState(this.fireBaseAuth);

  //Variavel com os dados todos da base de dados do firebase, isto foi criado para futuramente ser implementado com 
  //local storage usando o inonic storage
  public data = this.getData();

  //Retorna observable tipo Utilizador[] com uma collection dos utilizadores + o respetivo id de cada documento dentro da collection
  //Em termos de firebase, cada colecao em termos praticos refere-se a uma tabela em sql e um documento a um registo dentro da tabela
  getUtilizadores(): Observable<Utilizador[]> {
    return collectionData(this.utilizadorCollectionRef, { idField: 'id' }) as Observable<Utilizador[]>;
  }

  //Retorna observable tipo Livro[] 
  getLivros(): Observable<Livro[]> {
    return collectionData(this.livroCollectionRef, { idField: 'id' }) as Observable<Livro[]>;
  }

 //Retorna observable tipo Generos[] 
  getGeneros(): Observable<Genero[]> {
    return collectionData(this.generoCollectionRef, { idField: 'id' }) as Observable<Genero[]>;
  }

  //Retorna observable tipo Utilizador_livro[] 
  getUtilizador_Livro(): Observable<Utilizador_livro[]> {
    return collectionData(this.utilizador_livroCollectionRef, { idField: 'id' }) as Observable<Utilizador_livro[]>;
  }

  //Dados todos
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

  registerUser(email: string, password: string, userId) {
    setDoc(doc(this.utilizadorCollectionRef, userId), {
      email: email,
      password: password,
    });
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

  //Retornamos um observable que esta a observar o resultado da insercao do livro na lista do user
  addBookToList(bookId: number) {
    return new Observable((subscriber) => {
      this.currentUser$.pipe(take(1), map((value) => value.uid)).subscribe((val) =>
        this.getUtilizadorLivroByIdLivroAndIdUtilizador(bookId, val).pipe(take(1)).subscribe((res) => {
          subscriber.next(res);
          if (res[0].isList == true) {
            subscriber.error();
          }
        })
      );
    });
  }

//Funcao chamada atraves do addBookToList que vai buscar o respetivo documento utilizador_livro
//e guarda o parametro isList como true caso contrario cria um documento novo tipo utilizador_livro para guardar
//as interacoes que o user tem com o respetivo livro e coloca como isList:true para atribuir a lista 
  getUtilizadorLivroByIdLivroAndIdUtilizador(id_livro: number, id_utilizador: any) {
    const queryUtilizadorLivro = query(
      this.utilizador_livroCollectionRef,
      where('id_livro', '==', id_livro),
      where('id_utilizador', '==', id_utilizador)
    );
    const utilizadorLivroCollectionData = collectionData(queryUtilizadorLivro, { idField: 'id' });
    utilizadorLivroCollectionData.pipe(take(1)).subscribe((res) => {
      console.log(res);
      if (res.length > 0) {
        setDoc(doc(this.utilizador_livroCollectionRef, res[0].id), {
          id_livro: id_livro,
          id_utilizador: id_utilizador,
          isList: true,
          isRead: false,
        });
      } else {
        setDoc(doc(this.utilizador_livroCollectionRef), {
          id_livro: id_livro,
          id_utilizador: id_utilizador,
          isList: true,
          isRead: false,
        });
      }
    }).unsubscribe;
    return utilizadorLivroCollectionData;
  }

//Remover livro da lista de utilizador, esta funcao foi complicada
  removeFromList(id_livro, id_utilizador) {

    //Primeiro criamos um observable que basicamente vai estar a observar
    // o respetivo documento utilizador_livro
    let observer = new Observable((obs) => {
      const queryUtilizadorLivro = query(
        this.utilizador_livroCollectionRef,
        where('id_livro', '==', id_livro),
        where('id_utilizador', '==', id_utilizador)
      );
      const utilizadorLivroCollectionData = collectionData(queryUtilizadorLivro, { idField: 'id' });

      utilizadorLivroCollectionData.pipe(take(1)).subscribe((res) => {
        let livroRef = doc(this.firestore, 'utilizador_livro', `${res[0].id}`);
        obs.next(livroRef);
        obs.complete();
      });
    });

    //De seguida chamamos esse observe e anexamos um toast para observar o progresso
    //de removermos o livro da lista
    observer
      .pipe(
        this.toast.observe({
          success: 'Removed from list',
          loading: 'Removing from list',
          error: 'Something went wrong',
        })
      )

      //Apos isso, damos subscribe a esse observer onde o resultado dele é assync porque estamos
      //a basicamente a dar uma querie a base de dados para obtermos o documento, depois de termos o documento
      .subscribe(async (res: DocumentReference) => {
        const docSnap = await updateDoc(res, {
          id_livro: id_livro,
          id_utilizador: id_utilizador,
          isList: false,
          isRead: false,
        });
      });

    // return utilizadorLivroCollectionData;
  }

  //Retorna comentarios por bookId
  getComentarioByBookId(id: any) {
    const queryComentario = query(this.comentarioCollectionRef, where('id', '==', id));
    const comentarioCollectionData = collectionData(queryComentario, { idField: 'id' }) as Observable<Livro[]>;
    return comentarioCollectionData;
  }

  //Retorna user por email
  getUserByEmail(email: string) {
    const queryUser = query(this.utilizadorCollectionRef, where('email', '==', email));
    const userCollectionData = collectionData(queryUser, { idField: 'id' });
    return userCollectionData;
  }


  getUserList() {
    return new Observable((subs) => {
      this.currentUser$.subscribe((userInfo) => {
        collectionData(query(this.utilizador_livroCollectionRef, where('id_utilizador', '==', userInfo.uid)))
          .pipe()
          .subscribe((qr) => {
            subs.next(qr);
          });
      });
    });
  }

  getLivroById(livroId) {
    console.log(livroId);
    return new Observable((subs) => {
      this.getLivros().subscribe((livros) => {
        livros.forEach((livro) => {
          if (livro.id == livroId) {
            subs.next(livro);
          }
        });
      });
    });
  }

  getComentarioPorIdUtilizadorLivro(idUtilizadorLivro) {
    const queryComentario = query(this.comentarioCollectionRef, where('id_utilizadorLivro', '==', idUtilizadorLivro));
    const comentarioCollectionData = collectionData(queryComentario, { idField: 'id' }) as Observable<Comentario[]>;
    return comentarioCollectionData;
  }

  getUtilizadores_livroByIdLivro(idLivro: any) {
    const queryUtilizadorLivro = query(this.utilizador_livroCollectionRef, where('id_livro', '==', idLivro));
    const utilizadorLivroCollectionData = collectionData(queryUtilizadorLivro, { idField: 'id' }) as Observable<
      Utilizador_livro[]
    >;

    return utilizadorLivroCollectionData;
  }

  //Funcao de login do firebase auth
  signin(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.fireBaseAuth, email, password));
  }

  //Funcao de registar do firebase auth
  register(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.fireBaseAuth, email, password));
  }

  //Funcao de logout do firebase auth
  logout() {
    return from(signOut(this.fireBaseAuth));
  }
}
