import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDataService {
  constructor(private firestore: Firestore) {}

  getUtilizadores() {
    const usersRef = collection(this.firestore, 'utilizador');
    return collectionData(usersRef);
  }
}
