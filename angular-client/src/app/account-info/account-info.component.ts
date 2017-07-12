import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import {Observable} from 'rxjs/Rx';


import { Router } from '@angular/router';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],

})

export class AccountInfoComponent implements OnInit {

  user:  Observable<firebase.User>;
  items: FirebaseListObservable<any[]>;
  msgVal: string = '';

  constructor(public afAuth: AngularFireAuth, af: AngularFireDatabase, private router: Router) {
  /*  this.items = af.list('/messages', {
      query: {
        limitToLast: 50
      }
    });*/

    this.user = this.afAuth.authState;
    this.items = af.list('items');

  }


  login() {
    this.afAuth.auth.signInAnonymously();

}

loginGoogle()
{
     this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

}

logout() {
    this.afAuth.auth.signOut();
}

Send(desc: string) {
    this.items.push({ message: desc});
    this.msgVal = '';
}

  ngOnInit() {
  }

}
