import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dictionary } from '../../dictionary/dictionary';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-vpec',
  templateUrl: './vpec.component.html',
  styleUrls: ['./vpec.component.scss']
})
export class VpecComponent implements OnInit {
  //CHECK PAGE
  util = new Utilities();
  dict = new Dictionary();
  dataValue = [];
  getValue;
  getpage: string = 'attachmentsvpec';
  pageFavorite: boolean = false;
  userId: any;
  noData: boolean;
  myArray = [];
  pathFirstname: string;
  pathArray = [];
  done: boolean = false;
  checkArrayName: any = [];

  deleted_file: string = this.dict.getDictionary('deleted_file');

  constructor(
    private fsService: FileSharingService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    private sendButton: GroupFolderButton,
  ) { }

  ngOnInit() {
    this.sendButton.toggle(false);
    this.spinner.show();
    this.fsService.getVPECList().subscribe((result: any) => {
      let response = result.Dto.path;
      if(response){
        let id = result.Dto.nodeId;
        let index = response.indexOf(window.sessionStorage.user.toLowerCase()) + window.sessionStorage.user.length +1;
        this.pathFirstname = decodeURIComponent(response.slice(index, response.length));
        this.fsService.getOpenFolder(this.pathFirstname).subscribe((result: any) => {
          if(Array.isArray(result.body.multistatus.response)){
            this.dataValue = this.util.getResponseVpec(result.body.multistatus.response, id);
            this.dataValue.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);
            this.fsService.getConfiguredMails().subscribe(result=>{      
              for(var k in result.Dto){
                for(var j in this.dataValue){
                  if(result.Dto[k].email == this.dataValue[j].name){
                    this.dataValue[j].isConfig = true;
                    break;
                  }
                }
              }
              this.noData = false;
              this.spinner.hide();
              this.done = true;
            });
          }else{
            this.noData = true;
            this.spinner.hide();
            this.done = true;
          }
        });
      }else{
        this.noData = true;
        this.spinner.hide();
        this.done = true;
      }      
    });
  }


  /** NAVIGATE FOLDER
   * Navigate folder (not home)
   **/
  navigateFolder($event){
    let middle = (this.pathArray.length>0)? '/' : '';
    let path = this.pathFirstname + middle + ((this.pathArray.length>0)? this.pathArray.join('/') : '/') + middle + $event.path;
    
    this.fsService.getOpenFolder(path).subscribe((result: any) => {
      if(result.body.multistatus.response){
        this.noData = false;
        this.dataValue = this.util.getResponseVpec(result.body.multistatus.response, $event.id);
        this.dataValue.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);
        this.pathArray.push($event.path);
      }else{
        this.noData = true;
      }
    });
  }

  deleteUnusedMail($event:any){
    this.fsService.delete($event.homepath + $event.realname).subscribe((result: any) => {
      if(result.status == 'success'){
        for(var i in this.dataValue){
          if($event.id == this.dataValue[i].id){
            this.dataValue[i].hide = true;
            break;
          }
        }
        this._snackBar.open(this.deleted_file, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
        if(this.dataValue.length==0){
          this.noData = true;
        }
        this.spinner.hide();
        this.done = true;
      }
    });
  }
  

}