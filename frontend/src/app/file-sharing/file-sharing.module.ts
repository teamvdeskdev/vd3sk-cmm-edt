/**
 * MODULES IMPORT
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material.module';
import { FileSharingRoutingModule } from './file-sharing-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
// Imported Syncfusion RichTextEditorModule from Rich Text Editor package
import { RichTextEditorAllModule  } from '@syncfusion/ej2-angular-richtexteditor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxSignaturepadModule } from 'ngx-signaturepad2';

/**
 * COMPONENTS
 */
import { FileSharingComponent } from './file-sharing.component';
import { AllFilesComponent } from './pages/all-files/all-files.component';
import { TableComponent } from './components/table/table.component';
import { RecentsComponent } from './pages/recents/recents.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { LabelsComponent } from './pages/labels/labels.component';
import { DeletedComponent } from './pages/deleted/deleted.component';
import { ExternalarchivesComponent } from './pages/externalarchives/externalarchives.component';
import { SharesComponent } from './pages/shares/shares.component';
import { SharedByYouComponent } from './pages/shared-by-you/shared-by-you.component';
import { SharedByOthersComponent } from './pages/shared-by-others/shared-by-others.component';
import { SharedByLinkComponent } from './pages/shared-by-link/shared-by-link.component';
import { FolderComponent } from './pages/folder/folder.component';
import { SharesTableComponent } from './components/shares-table/shares-table.component';
import { SharesDeletedComponent } from './pages/shares-deleted/shares-deleted.component';
import { PathComponent } from './components/path/path.component';
import { DropFileDirective} from './directives/dropfile.directive';
import { NoDataComponent } from './components/no-data/no-data.component';
import { ShareSetupMenuComponent } from './components/share-setup-menu/share-setup-menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarService, SidebarTableService, LinkTableSide, LinkSideTable } from './services/sidebar.service';
import { ShareComponent } from './components/share/share.component';
import { DeleteTableComponent } from './components/delete-table/delete-table.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { DialogDeleteFileComponent } from './components/dialogs/delete-file/delete-file.component';
import { DialogTableComponent } from './components/dialog-table/dialog-table.component'
import { ActivityLeftSidenavComponent } from './components/activity-left-sidenav/activity-left-sidenav.component';
import { AllActivitiesComponent } from './pages/activity/all-activities/all-activities.component';
import { YourActivitiesComponent } from './pages/activity/your-activities/your-activities.component';
import { OthersActivitiesComponent } from './pages/activity/others-activities/others-activities.component';
import { ActFavoritesComponent } from './pages/activity/act-favorites/act-favorites.component';
import { FileChangesComponent } from './pages/activity/file-changes/file-changes.component';
import { SecurityComponent } from './pages/activity/security/security.component';
import { FileSharesComponent } from './pages/activity/file-shares/file-shares.component';
import { CalendarComponent } from './pages/activity/calendar/calendar.component';
import { TaskComponent } from './pages/activity/task/task.component';
import { ActivityTableComponent } from './components/activity-table/activity-table.component';
import { ActivitiesandnotificationsComponent } from './pages/settings/activitiesandnotifications/activitiesandnotifications.component';
import { ApplicationsComponent } from './pages/settings/applications/applications.component';
import { ExternalArchivesComponent } from './pages/settings/externalarchives/externalarchives.component';
import { SettingsLeftSidenavComponent } from './components/settings-left-sidenav/settings-left-sidenav.component';
import { VersionsComponent } from './components/versions/versions.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { SearchResultTableComponent } from './components/search-result-table/search-result-table.component';
import { GroupFolderComponent } from './pages/group-folder/group-folder.component';
import { ArchivesTableComponent } from './components/archives-table/archives-table.component';
import { GroupfoldersComponent } from './pages/settings/groupfolders/groupfolders.component';
import { VpecComponent } from './pages/vpec/vpec.component';
import { DialogMoveCopyFileComponent } from './components/dialogs/copy-file/copy-file.component';
import { VpecTableComponent } from './components/vpec-table/vpec-table.component';
import { TextEditorComponent } from './components/dialogs/text-editor/text-editor.component';
//import { AudioVideoComponent } from './components/dialogs/audio-video/audio-video.component';
import { ProtectedFilesComponent } from './pages/protected-files/protected-files.component';
import { PasswordDialogComponent } from './components/dialogs/password-dialog/password-dialog.component';

//import { DialogPdfComponent } from './components/dialogs/dialog-pdf/dialog-pdf.component';
import {AppSharedModule} from 'src/app/app-shared.module';
import { SignDialogComponent } from './components/dialogs/sign-dialog/sign-dialog.component';
import { DuplicateFileComponent } from './components/dialogs/duplicate-file/duplicate-file.component';
import { CreateStorageComponent } from './pages/settings/externalarchives/create-storage/create-storage.component';

import { ChangeSavePathComponent } from './components/dialogs/change-save-path/change-save-path.component';
import { PadesSignatureComponent } from './components/digital-signature/pades-signature/pades-signature.component';
import { DigitalSignatureComponent } from './components/digital-signature/digital-signature.component';
import { AuthSignatureComponent } from './components/digital-signature/auth-signature/auth-signature.component';
import { SetSignatureComponent } from './components/digital-signature/set-signature/set-signature.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { SignatureBoxComponent } from './components/digital-signature/signature-box/signature-box.component';
import { SignedDocumentsFolderComponent } from './pages/signed-documents-folder/signed-documents-folder.component';
import { SignatureSettingsComponent } from './pages/settings/signature-settings/signature-settings.component';
import { SignatureTableComponent } from './pages/settings/signature-settings/components/signature-table/signature-table.component';
import { SignatureSettingsFormComponent } from './pages/settings/signature-settings/components/signature-settings-form/signature-settings-form.component';
import { TagComponent } from './pages/tags/tag/tag.component';
import { TaglistComponent } from './pages/tags/taglist/taglist.component';
import { TagsidebarComponent } from './pages/tags/tagsidebar/tagsidebar.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SignatureVerifyComponent } from './components/signature-verify/signature-verify.component';
import { VflowComponent } from './pages/vflow/vflow.component';
import { GroupfolderDialogComponent } from './pages/settings/groupfolders/groupfolder-dialog/groupfolder-dialog.component';
import { GroupfolderDeletedialogComponent } from './pages/settings/groupfolders/groupfolder-deletedialog/groupfolder-deletedialog.component';
import { RenameFileComponent } from './components/dialogs/rename-file/rename-file.component';
import { CreatefileDialogComponent } from './components/dialogs/createfile-dialog/createfile-dialog.component';
import { AllfilesTableComponent } from './pages/all-files/allfiles-table/allfiles-table.component';
import { AllfilesSidebarComponent } from './pages/all-files/allfiles-sidebar/allfiles-sidebar.component';
import { GroupfolderTableComponent } from './pages/group-folder/groupfolder-table/groupfolder-table.component';
import { GroupfolderSidebarComponent } from './pages/group-folder/groupfolder-sidebar/groupfolder-sidebar.component';
import { SignatureOtpComponent } from './components/dialogs/signature-otp/signature-otp.component';
import { UserdialogPasswordComponent } from './components/dialogs/userdialog-password/userdialog-password.component';

@NgModule({
  declarations: [
    FileSharingComponent,
    AllFilesComponent,
    TableComponent,
    RecentsComponent,
    FavoritesComponent,
    LabelsComponent,
    DeletedComponent,
    ExternalarchivesComponent,
    SharesComponent,
    SharedByYouComponent,
    SharedByOthersComponent,
    SharedByLinkComponent,
    FolderComponent,
    SharesTableComponent,
    SharesDeletedComponent,
    DropFileDirective,
    NoDataComponent,
    ShareSetupMenuComponent,
    SidebarComponent,
    ShareComponent,
    DeleteTableComponent,
    ActivitiesComponent,
    ActivityLeftSidenavComponent,
    AllActivitiesComponent,
    YourActivitiesComponent,
    OthersActivitiesComponent,
    ActFavoritesComponent,
    FileChangesComponent,
    SecurityComponent,
    FileSharesComponent,
    CalendarComponent,
    TaskComponent,
    ActivityTableComponent,
    ActivitiesandnotificationsComponent,
    ApplicationsComponent,
    ExternalArchivesComponent,
    SettingsLeftSidenavComponent,
    VersionsComponent,
    SearchResultComponent,
    SearchResultTableComponent,
    GroupFolderComponent,
    ArchivesTableComponent,
    GroupfoldersComponent,
    VpecComponent,
    VpecTableComponent,
    TextEditorComponent,
    //AudioVideoComponent,
    ProtectedFilesComponent,
    PasswordDialogComponent,
    //DialogPdfComponent,
    SignDialogComponent,
    DuplicateFileComponent,
    CreateStorageComponent,
    DigitalSignatureComponent,
    AuthSignatureComponent,
    SetSignatureComponent,
    PadesSignatureComponent,
    SignatureBoxComponent,
    // UserdialogPasswordComponent,
    SignedDocumentsFolderComponent,
    SignatureSettingsComponent,
    SignatureTableComponent,
    SignatureSettingsFormComponent,
    TagComponent,
    TaglistComponent,
    TagsidebarComponent,
    SignatureVerifyComponent,
    VflowComponent,
    GroupfolderDialogComponent,
    GroupfolderDeletedialogComponent,
    RenameFileComponent,
    CreatefileDialogComponent,
    AllfilesTableComponent,
    AllfilesSidebarComponent,
    GroupfolderTableComponent,
    GroupfolderSidebarComponent,
    SignatureOtpComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    RichTextEditorAllModule,
    AppSharedModule,
    DragDropModule,
    AngularDraggableModule,
    NgxSignaturepadModule,
    ImageCropperModule,

    FileSharingRoutingModule // SEMPRE PER ULTIMO
  ],
  /*
  entryComponents: [
    TextEditorComponent,          // DIALOG
    PasswordDialogComponent,      // DIALOG
    SignDialogComponent,
    DuplicateFileComponent,
    SignatureBoxComponent,
    UserdialogGroupComponent,
    GroupfolderDialogComponent,
    GroupfolderDeletedialogComponent,
    RenameFileComponent,
    CreatefileDialogComponent,
  ],
  */
  providers: [
    SidebarService,
    SidebarTableService,
  ]
})
export class FileSharingModule { }
