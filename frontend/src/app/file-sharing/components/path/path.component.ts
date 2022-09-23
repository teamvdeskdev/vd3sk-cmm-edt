import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { globals } from 'src/config/globals';
import { Dictionary } from '../../dictionary/dictionary';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.scss']
})

export class PathComponent implements OnInit {
  @Input() class: string;
  @Input() movepath;
  @Output() change: EventEmitter<any> = new EventEmitter();
  dict = new Dictionary();
  name = '';
  array = [];
  searchResult: string = this.dict.getDictionary('searchResultFor');
  searchClose: string = this.dict.getDictionary('searchClose');
  searchValue: string = '';
  getTitleHome: string;
  signatureComponentName = [
    {title: this.dict.getDictionary('digital-signature'), name: 'digital-signature'},
    {title: this.dict.getDictionary('set-signature'), name: 'set-signature'},
    {title: this.dict.getDictionary('pades-signature'), name: 'pades-signature'},
    {title: this.dict.getDictionary('authentication'), name: 'authentication'}
  ];
  notCustom: boolean = false;
  globalsVar: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private dataSharingService: DataSharingService
  ) {
    this.globalsVar = globals;
    this.dataSharingService.currentPath.subscribe( value => {
      if (value.includes('_cleanArray')) {
        this.getTitleHome = '';
        this.array = [];
      }
      this.loadPath();
    });
  }

  ngOnInit() {
    this.notCustom = (this.globalsVar.customCustomer.toLowerCase() == 'notariato')? true : false;
    this.load();
  }

  load() {
    if(this.router.url.includes('search-result')){
      let urlArray = this.router.url.split('/');
      this.searchValue = '"' + urlArray[urlArray.length-1] + '"';
    }else{
      this.loadPath();
    } 
  }

  loadPath() {
    this.getTitleHome = this.getTitlePage();
    this.getNamePath();
  }

  /*
  ngOnChanges(changes: SimpleChanges) {
    const activity = changes.movepath;
    if (activity.currentValue != activity.previousValue) {
      if (activity.currentValue.includes('_cleanArray')) {
        this.getTitleHome = '';
        this.array = [];
      }
      this.loadPath();
    }
  }
  */

  /** RETURN TO PATH
   * Click on single path folder name
   * Navigate to that folder
   * Also used in dialog for move file
   **/
  returnToPath(value, index) {
    const url = decodeURIComponent(this.router.url);
    if (url.includes('/filesharing/digital-signature')) {
      const findedName = this.signatureComponentName.find(q => q.title === value).name;
      if (findedName) {
        this.router.navigateByUrl('/filesharing/digital-signature/' + findedName);
      }
    } else if(!this.class){
      let home = this.route.snapshot.queryParams.home;
      let nameurl;
      if(home == "attachmentsvpec" || home == 'vflow'){
        nameurl = decodeURIComponent(decodeURIComponent(this.route.snapshot.queryParams.name)).split('/')[0] + '/';
      }
      this.array = this.array.slice(0, index+1);
      let realname = this.array.join('/');
      if(home == "attachmentsvpec" || home == 'vflow') realname = nameurl + realname;
      realname = realname.replace(/\//g, '%252F');
      this.router.navigate(['filesharing','folder', realname], {queryParams: { name: realname, home: home }});
    }else{
      for(var a=0; a<this.array.length; a++){
        if(this.array[a] == value){
          let newarray = (a==0)? this.array.slice(0, 1) : this.array.slice(0, a + 1);
          let result = (newarray.length>1)? newarray.join('/') : newarray.join();
          let dataresult = {
            result: result,
            navigate: true,
          }
          this.change.emit(dataresult);
          break;
        }
      }
    }
  }

  /** NAVIGATE HOME
   * Click on home path
   * Navigate to home
   * Also used in dialog for move file
   **/
  navigateHome(){
    if(!this.class){
      let home = this.route.snapshot.queryParams.home;
      this.array = [];
      this.router.navigate(['filesharing',home]);
    }else{
        this.change.emit('');
    }
  }

  goToHome(){
    this.router.navigate(['filesharing', 'all-files']);
  }


  /** GET NAME PATH
   * Get path home from url if there is no class else get it from string value
   * Also used in dialog for move file
   **/
  getNamePath() {
    if (!this.class) {
      var url = decodeURIComponent(this.router.url);
      url = url.replace(/%252F/g, '/');
      const home = this.route.snapshot.queryParams.home;
      if (url.includes('/filesharing/folder/')) {
        let arrayString: string = this.route.snapshot.queryParams.name.replace(/%252F/g, '/');
        this.array = arrayString.split('/');
        /*
        if (arrayString.includes('.d')) {
          this.array = arrayString.split('/');         
        } else {
          this.array = arrayString.split('/');
        }
        */
        if (home === 'attachmentsvpec' || home=='vflow') {
          this.array.shift();
        }
      }

      if (url.includes('/filesharing/digital-signature/')) {
        const check = '/filesharing/digital-signature/';
        const arrayPath = url.slice(check.length).split('/');
        for (const path of arrayPath) {
          const dictPath = this.dict.getDictionary(path);
          this.array.push(dictPath);
        }
      }
    } else {
      if (this.movepath.length > 0) {
        const array = this.movepath.split('/');
        this.array = [];
        for (const a in array) {
          if (array[a].length > 0) {
            this.array.push(array[a]);
          }
        }
      } else {
        this.array = [];
      }
    }
  }

  /** GET TITLE PAGE
   * Get path home from url if there is no class
   * Also used in dialog for move file
  **/
  getTitlePage() {
    let result: string;
    const url = decodeURIComponent(this.router.url);

    if (!this.class) {
      if (url.includes('/filesharing/folder/')) {
        const check = '&home=';
        const index = url.indexOf(check) + check.length;
        result = url.slice(index);
      } else {
        const check = '/filesharing/';
        const index = url.indexOf(check);
        result = url.slice(index + check.length);
      }

      if (url.includes('/filesharing/digital-signature')) {
        result = 'digital-signature';
      }

      if (url.includes('/filesharing/signed-documents-folder')) {
        result = 'signed-documents-folder';
      }
    } else {
      result = 'all-files';
    }

    return this.dict.getDictionary(result);
  }

}
