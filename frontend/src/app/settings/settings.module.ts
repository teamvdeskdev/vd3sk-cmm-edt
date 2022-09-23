/**
 * MODULES
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ImageCropperModule } from 'ngx-image-cropper';
/**
 * COMPONENTS
 */
import { SettingsComponent } from './settings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DeviceSessionComponent } from './pages/device-session/device-session.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { SecurityDialogComponent } from './components/security-dialog/security-dialog.component';
import { PictureDialogComponent } from './components/picture-dialog/picture-dialog.component';
import { VshareUploadDialogComponent } from './components/vshare-upload-dialog/vshare-upload-dialog.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { VshUploadDialogTableComponent } from './components/vsh-upload-dialog-table/vsh-upload-dialog-table.component';
import { EncryptionComponent } from './pages/encryption/encryption.component';
import { AppSharedModule } from '../app-shared.module';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { EditDeviceDialogComponent } from './components/edit-device-dialog/edit-device-dialog.component';
import { VPECSettingsComponent } from './pages/vpec-settings/vpec-settings.component';
import { VCanvasSettingsComponent } from './pages/vcanvas-settings/vcanvas-settings.component';
import { VFlowSettingsComponent } from './pages/vflow-settings/vflow-settings.component';
import { ConfigPanelComponent } from './pages/config-panel/config-panel.component';
import { EditDomainDialogComponent } from './components/edit-domain-dialog/edit-domain-dialog.component';
import { UsersComponent } from './pages/users-settings/user/users.component';
import { UsertableComponent } from './pages/users-settings/components/usertable/usertable.component';
import { UserSearchComponent } from './pages/users-settings/components/user-search/user-search.component';
import { UserdialogGroupComponent } from './pages/users-settings/components/userdialog-group/userdialog-group.component';
import { DialogCreateComponent } from './pages/guests-settings/components/dialog-create/dialog-create.component';
import { GroupsComponent } from './pages/groups-settings/groups.component';
import { GroupstableComponent } from './pages/groups-settings/groupstable/groupstable.component';
import { SinglegroupComponent } from './pages/groups-settings/singlegroup/singlegroup.component';
import { DisableuserComponent } from './pages/users-settings/disableuser/disableuser.component';
import { UserdialogPasswordComponent } from './pages/users-settings/components/userdialog-password/userdialog-password.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EditUserDialogComponent } from './components/edit-user-dialog/edit-user-dialog.component';
import { VDpaSettingsComponent } from './pages/vdpa-settings/vdpa-settings.component';
import { EditProviderDialogComponent } from './components/edit-provider-dialog/edit-provider-dialog.component';
import { VCanvasUserTableComponent } from './pages/vcanvas-settings/components/vcanvas-user-table.component/vcanvas-user-table.component';
import { CanvasSettingsUsersComponent } from './pages/vcanvas-settings/pages/canvas-settings-users/canvas-settings-users.component';
import { CanvasSettingsAppsComponent } from './pages/vcanvas-settings/pages/canvas-settings-apps/canvas-settings-apps.component';
import { CanvasSettingsGroupsComponent } from './pages/vcanvas-settings/pages/canvas-settings-groups/canvas-settings-groups.component';
import { VcanvasUserDetailsComponent } from './pages/vcanvas-settings/pages/canvas-settings-users/component/vcanvas-user-details/vcanvas-user-details.component';
import { AppsTreeComponent } from './pages/vcanvas-settings/pages/canvas-settings-users/component/apps-tree/apps-tree.component';
import { VcanvasGroupsTableComponent } from './pages/vcanvas-settings/components/vcanvas-groups-table/vcanvas-groups-table.component';
import { CreateAppComponent } from './pages/vcanvas-settings/pages/canvas-settings-apps/component/create-app/create-app.component';
import { CanvasUserSearchComponent } from './pages/users-settings/components/canvas-user-search/canvas-user-search.component';
import { GuestsSettingsComponent } from './pages/guests-settings/guests-settings.component';
import { SmtpComponent } from './pages/smtp/smtp.component';
import { SamluserSettingsComponent } from './pages/samluser-settings/samluser-settings.component';
import { SamluserDialogcreateComponent } from './pages/samluser-settings/components/samluser-dialogcreate/samluser-dialogcreate.component';
import { SamluserTableComponent } from './pages/samluser-settings/components/samluser-table/samluser-table.component';
import { SamluserDisabledComponent } from './pages/samluser-settings/components/samluser-disabled/samluser-disabled.component';
import { StagingAreaSettingsComponent } from './pages/staging-area-settings/staging-area-settings.component';
import { FieldModalComponent } from './pages/staging-area-settings/field-modal/field-modal.component';
import { RelationshipModalComponent } from './pages/staging-area-settings/relationship-modal/relationship-modal.component';
import { RenameTableModalComponent } from './pages/staging-area-settings/rename-table-modal/rename-table-modal.component';


@NgModule({
  declarations: [
    SettingsComponent,
    ProfileComponent,
    DeviceSessionComponent,
    AuthenticationComponent,
    SecurityDialogComponent,
    PictureDialogComponent,
    VshareUploadDialogComponent,
    BreadcrumbComponent,
    VshUploadDialogTableComponent,
    EncryptionComponent,
    ConfigurationsComponent,
    EditDeviceDialogComponent,
    VCanvasSettingsComponent,
    VPECSettingsComponent,
    VDpaSettingsComponent,
    VFlowSettingsComponent,
    ConfigPanelComponent,
    EditDomainDialogComponent,
    EditUserDialogComponent,
    UsersComponent,
    VCanvasUserTableComponent,
    UsertableComponent,
    UserSearchComponent,
    UserdialogPasswordComponent,
    UserdialogGroupComponent,
    GroupsComponent,
    GroupstableComponent,
    SinglegroupComponent,
    DisableuserComponent,
    EditProviderDialogComponent,
    CanvasSettingsUsersComponent,
     CanvasSettingsAppsComponent,
     CanvasSettingsGroupsComponent,
     VcanvasUserDetailsComponent,
     AppsTreeComponent,
     VcanvasGroupsTableComponent,
     CreateAppComponent,
     CanvasUserSearchComponent,
     GuestsSettingsComponent,
     DialogCreateComponent,
     SmtpComponent,
     SamluserSettingsComponent,
     SamluserDialogcreateComponent,
     SamluserTableComponent,
     SamluserDisabledComponent,
     StagingAreaSettingsComponent,
     FieldModalComponent,
     RelationshipModalComponent,
     RenameTableModalComponent
  ],
  imports: [
    AppSharedModule,
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    QRCodeModule,
    NgxSpinnerModule,
    ImageCropperModule,
    InfiniteScrollModule,
    SettingsRoutingModule // SEMPRE PER ULTIMO
  ],
  /*
  entryComponents: [
    SecurityDialogComponent,
    PictureDialogComponent,
    VshareUploadDialogComponent,
  ]
  */
})
export class SettingsModule { }
