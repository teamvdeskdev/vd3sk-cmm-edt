import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { Router } from '@angular/router';
import { exportActivityPDF } from 'src/app/file-sharing/services/sidebar.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-activity-left-sidenav',
  templateUrl: './activity-left-sidenav.component.html',
  styleUrls: ['./activity-left-sidenav.component.scss']
})

export class ActivityLeftSidenavComponent implements OnInit {

  dict = new Dictionary();
  @Input() currentpage: string;
  @Output() newPathEvent = new EventEmitter<string>();
  data;

  // DICTIONARY VARIABLES ---
  dictAllActivities: string = this.dict.getDictionary('activities-all');
  dictYourActivities: string = this.dict.getDictionary('activities-your');
  dictOtherActivities: string = this.dict.getDictionary('activities-others');
  dictFavorites: string = this.dict.getDictionary('activities-favorites');
  dictFileChanges: string = this.dict.getDictionary('activities-filechanges');
  dictSecurity: string = this. dict.getDictionary('activities-security');
  dictFileShares: string = this.dict.getDictionary('activities-fileshares');
  dictCalendar: string = this.dict.getDictionary('activities-calendar');
  dictTask: string = this.dict.getDictionary('activities-task');
  export: string = this.dict.getDictionary('export');
  // ---

  head = [['User', 'Action', 'Date']]

  constructor(
    private router: Router,
    private exportActivityPDF: exportActivityPDF,
    ) { }

  ngOnInit() {
    this.exportActivityPDF.change.subscribe(data => {
        if(data) this.data = data;
    });
  }

  emitPath(path) {
    this.newPathEvent.emit(path);
  }

  exportPDF(){
    var doc = new jsPDF('l', 'mm', 'a4');
    var pageWidth = doc.internal.pageSize.getWidth()/15;

    doc.setFontSize(18);
    doc.text('', 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);


    (doc as any).autoTable({
      head: this.head,
      body: this.data,
      theme: 'grid',
      didDrawCell: data => {
      },
      tableWidth: 'wrap',

      headStyles: {
        fillColor: [0, 57, 106],
        fontSize: 15,
      },

      columnStyles: {
        0: {cellWidth: pageWidth*2.3},
        1: {cellWidth: pageWidth*9},
        2: {cellWidth: pageWidth*2.3},
      }
    })

    // Open PDF document in new tab
    //doc.output('dataurlnewwindow')

    // Download PDF document
    let date = new Date();
    let humanDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + '-' + date.getMinutes();
    let name = 'vShare_Activities_' + humanDate + '.pdf';
    doc.save(name);
  }

}
