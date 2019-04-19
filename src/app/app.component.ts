import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Instagram';




ngOnInit():void{
  var config = {
    apiKey: "AIzaSyDAiTNKBRS0WNjpQrh4jguibjqeB7hcbKs",
    authDomain: "jta-instagram-clone-ea2e0.firebaseapp.com",
    databaseURL: "https://jta-instagram-clone-ea2e0.firebaseio.com",
    projectId: "jta-instagram-clone-ea2e0",
    storageBucket: "jta-instagram-clone-ea2e0.appspot.com",
    messagingSenderId: "708597072915"
  };
  firebase.initializeApp(config)
}

}
