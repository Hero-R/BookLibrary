import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bookshelves';

  constructor() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: 'AIzaSyAOonKqC3IcYXGW_raAKWIE5o297s954rs',
      authDomain: 'bookshelves-59034.firebaseapp.com',
      databaseURL: 'https://bookshelves-59034.firebaseio.com',
      projectId: 'bookshelves-59034',
      storageBucket: 'bookshelves-59034.appspot.com',
      messagingSenderId: '314006296741',
      appId: '1:314006296741:web:25183be2470ad74492d54c'
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

}
