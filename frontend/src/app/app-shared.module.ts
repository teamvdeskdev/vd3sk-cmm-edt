import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AcronymPipe } from './app-pipes/acronym.pipe';
import { ToHexColourPipe } from './app-pipes/to-hex-colour.pipe';
import { TruncatePipe } from './app-pipes/truncate.pipe';
import { AttachmentTypePipe } from './app-pipes/attachment-type.pipe';
import { CleanPipe } from './app-pipes/clean.pipe';
import { DialogDeleteFileComponent } from 'src/app/file-sharing/components/dialogs/delete-file/delete-file.component';
import { DialogMoveCopyFileComponent } from 'src/app/file-sharing/components/dialogs/copy-file/copy-file.component';
import { DialogTableComponent } from 'src/app/file-sharing/components/dialog-table/dialog-table.component';
import { PathComponent } from 'src/app/file-sharing/components/path/path.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { AudioVideoComponent } from 'src/app/file-sharing/components/dialogs/audio-video/audio-video.component';
import { DialogPdfComponent } from 'src/app/file-sharing/components/dialogs/dialog-pdf/dialog-pdf.component';
import { ChangeSavePathComponent } from './file-sharing/components/dialogs/change-save-path/change-save-path.component';
// tslint:disable-next-line: max-line-length
import { UserdialogPasswordComponent } from './file-sharing/components/dialogs/userdialog-password/userdialog-password.component';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConfirmDialogComponent } from './app-components/dialogs/confirm-dialog/confirm-dialog.component';
import { TimeWeatherComponent } from './app-components/sub-header/time-weather.component';


@NgModule({
  declarations: [
    AcronymPipe,
    ToHexColourPipe,
    TruncatePipe,
    AttachmentTypePipe,
    CleanPipe,
    DialogDeleteFileComponent,
    DialogMoveCopyFileComponent,
    DialogTableComponent,
    PathComponent,
    AudioVideoComponent,
    DialogPdfComponent,
    ChangeSavePathComponent,
    UserdialogPasswordComponent,
    ConfirmDialogComponent,
    TimeWeatherComponent
  ],
  imports: [
    CommonModule,
    ColorPickerModule,
    AppMaterialModule,
    NgxSpinnerModule,
    FormsModule,
    PdfViewerModule,
  ],
  exports: [
    CommonModule,
    ColorPickerModule,
    PdfViewerModule,
    AcronymPipe,
    ToHexColourPipe,
    TruncatePipe,
    AttachmentTypePipe,
    DialogDeleteFileComponent,
    DialogMoveCopyFileComponent,
    DialogTableComponent,
    PathComponent,
    ChangeSavePathComponent,
    TimeWeatherComponent,
  ],
  /*
  entryComponents: [
    DialogDeleteFileComponent,
    DialogMoveCopyFileComponent,
    AudioVideoComponent,
    DialogPdfComponent,
    ChangeSavePathComponent,
    UserdialogPasswordComponent
  ],
  */
})
export class AppSharedModule { }
