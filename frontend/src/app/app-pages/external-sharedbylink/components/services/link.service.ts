import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';

export class UploadLink {
    @Output() changestatus: EventEmitter<any> = new EventEmitter();

    toggle(obj) {    
        this.changestatus.emit(obj);
    }
}