import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Dragdroputils{

    constructor(
        private serviceCall: FileSharingService
    ) {}

    public async getUploadedFiles(entry, realname, path) {
        var files = [];
        if (entry.isDirectory) {
            const directoryReader = entry.createReader();
            var folderContent =  await new Promise((resolve, reject) => {
                directoryReader.readEntries(
                    entries => {
                        resolve(entries);
                    },
                    err => {
                        reject(err);
                    }
                );
            });
            if(Array.isArray(folderContent)){
                for(var i in folderContent){
                    let file = folderContent[i];
                    if(file.isFile){
                        var filePromise: any = await new Promise((resolve, reject) => file.file(resolve, reject));
                        if(filePromise){
                            let name = path + ((realname)? realname : entry.name);
                            let controlName = filePromise.name;
                            let sendname;
                            let arrayChange;
                            let count = 0;

                            if(controlName.indexOf('.')>0){
                            let nameChange = '';
                            if(controlName.includes('.ven')){
                                count = 1;
                                nameChange.replace('.ven', '');
                            }else if (controlName.includes('.ved')) {
                                count = 2;
                                nameChange.replace('.ved', '');
                            }else{
                                nameChange = controlName;
                            }

                            if(nameChange.indexOf('.')>0){
                                arrayChange = nameChange.split('.');
                                let ext = arrayChange[1].toLowerCase();
                                sendname = arrayChange[0] + '.' + ext;
                            }

                            if(count==1) sendname + '.ven';
                            else if(count==2) sendname + '.ved';
                            }
                            let uriName = encodeURIComponent(sendname);
                            let uriFolder = encodeURIComponent(name);

                            await this.serviceCall.upload(uriFolder + '/' + uriName, filePromise).toPromise();
                        }                            
                    } 
                    else{
                        let name = path + ((realname)? realname : entry.name) + '/' + file.name;
                        let serviceWait = await this.serviceCall.createFolder(name).toPromise();
                        if(serviceWait.status == 'success')
                            await this.recursiveUploadFile(file, name);
                    }
                }
            }
            return await new Promise(resolve => resolve(files));
        }
    }

    async recursiveUploadFile(entry, name){
        var files = [];
        if (entry.isDirectory) {
            const directoryReader = entry.createReader();
            var folderContent =  await new Promise((resolve, reject) => {
                directoryReader.readEntries(
                    entries => {
                        resolve(entries);
                    },
                    err => {
                        reject(err);
                    }
                );
            });
            if(Array.isArray(folderContent)){
                for(var i in folderContent){
                    let file = folderContent[i];
                    if(file.isFile){
                        var filePromise: any = await new Promise((resolve, reject) => file.file(resolve, reject));
                        if(filePromise){
                            let controlName = filePromise.name;
                            let sendname;
                            let arrayChange;
                            let count = 0;

                            if(controlName.indexOf('.')>0){
                            let nameChange = '';
                            if(controlName.includes('.ven')){
                                count = 1;
                                nameChange.replace('.ven', '');
                            }else if (controlName.includes('.ved')) {
                                count = 2;
                                nameChange.replace('.ved', '');
                            }else{
                                nameChange = controlName;
                            }

                            if(nameChange.indexOf('.')>0){
                                arrayChange = nameChange.split('.');
                                let ext = arrayChange[1].toLowerCase();
                                sendname = arrayChange[0] + '.' + ext;
                            }

                            if(count==1) sendname + '.ven';
                            else if(count==2) sendname + '.ved';
                            }
                            let uriName = encodeURIComponent(sendname);
                            let uriFolder = encodeURIComponent(name);

                            await this.serviceCall.upload(uriFolder + '/' + uriName, filePromise).toPromise();
                        }
                    }else{
                        let superName = name + '/' + file.name;
                        let serviceWait = await this.serviceCall.createFolder(superName).toPromise();
                        if(serviceWait.status.toLowerCase() == 'success')
                            await this.recursiveUploadFile(file, superName);
                    }
                }
            }
            return await new Promise(resolve => resolve(files));
        }
    }
}