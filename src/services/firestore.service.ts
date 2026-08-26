import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private firestore = inject(Firestore);

  async getAll<T>(path: string): Promise<T[]> {
    const collectionRef = collection(this.firestore, path);
    const snapshot = await getDocs(collectionRef);
 
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  add<T>(path: string, data: T) {
    const collectionRef = collection(this.firestore, path);
    return addDoc(collectionRef, data as any);
  }

  update<T>(path: string, id: string, data: T) {
    const docRef = doc(this.firestore, path, id);
    return updateDoc(docRef, data as any);
  }

  delete(path: string, id: string) {
    const docRef = doc(this.firestore, path, id);
    return deleteDoc(docRef);
  }
}