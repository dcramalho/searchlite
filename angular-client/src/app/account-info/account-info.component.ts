import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  types = [
      {'value': 'pdf', 'name': 'PDF'},
      {'value': 'html', 'name': 'HTML'},
      {'value': 'xml', 'name': 'XML'},
      {'value': 'doc', 'name': 'DOC'},
      {'value': 'all', 'name': 'ALL'}
];

  constructor() { }

  ngOnInit() {
  }

}
