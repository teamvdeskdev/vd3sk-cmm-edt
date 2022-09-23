import { Component, OnInit, ViewChild } from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';

@Component({
  selector: 'app-ldapuser',
  templateUrl: './ldapuser.component.html',
  styleUrls: ['./ldapuser.component.scss']
})
export class LdapuserComponent implements OnInit {
  serverList: any = [];

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor() { }

  ngOnInit() {
    this.serverList = [
      {id: 0, name: 'server1'},
      {id: 1, name: 'server2'}, 
      {id: 2, name: 'server3'},
    ];

  }

}
