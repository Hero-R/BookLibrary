import { Injectable } from '@angular/core';
import {Book} from '../models/Book.model';
import {Subject} from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>();

  constructor() { }

  // enregistre et fait émettre le subject
  emitBooks() {
    this.booksSubject.next(this.books);
  }

  // remplace le liste des livres au node ('/books') de la base de données avec l'array local.
  saveBooks() {
    firebase.database().ref('/books').set(this.books);
  }

  // on() va réagir des événements venants de la base de données.
  // Il va continuer à chaque fois que une valeur soit modifier, le callback sera exécuté (temps réel).
  getBooks() {
    firebase.database().ref('/books')
      .on('value', (data) => {
        this.books = data.val() ? data.val() : [];
        this.emitBooks();
      });
  }

  // once() pour récupérer une données une fois (on a pas besoin du comportement en temps réel).
  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {
    if (book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo supprimée !');
        }
      ).catch(
        (error) => {
          console.log('Fichier non trouvé : ' + error);
        }
      );
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if (bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref().child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
          console.log('Chargement...');
          },
          (error) => {
          console.log('Erreur de chargement : ' + error);
          },
          () => {
          resolve(upload.snapshot.ref.getDownloadURL());
          });
      }
    );
  }
}
