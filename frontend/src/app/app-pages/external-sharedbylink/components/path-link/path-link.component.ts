import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';

@Component({
  selector: 'app-path-link',
  templateUrl: './path-link.component.html',
  styleUrls: ['./path-link.component.scss']
})
export class PathLinkComponent implements OnInit {
  @Input() completename: string;
  @Input() arrayPath: any;
  @Input() class: boolean;
  @Output() change: EventEmitter<any> = new EventEmitter();

  dict = new Dictionary();
  array = [];

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.arrayPath.currentValue.length>0){
      if(changes.arrayPath.previousValue==undefined || (changes.arrayPath.currentValue.toString() != changes.arrayPath.previousValue.toString())){
        this.arrayPath = changes.arrayPath.currentValue;
      }
    }    
  }

  /** NAVIGATE HOME
   * Click on home path
   * Navigate to home
   * Also used in dialog for move file
   **/
  navigateHome(){
    let data = {
      path: 'home',
      check: true,
    }
    this.change.emit(data);
  }

  returnToPath($event){
    if($event != this.arrayPath.length-1){
      let data = {
        path: $event,
        check: false,
      }
      this.change.emit(data);
    }
  }

}
