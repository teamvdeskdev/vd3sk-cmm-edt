/**
 * ANGULAR MODULES IMPORTS
 */
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SimplebarAngularModule } from 'simplebar-angular';

import { QRCodeModule } from 'angularx-qrcode';

/**
 * BOOTSTRAP COMPONENT OF THE APP
 */
import { AppComponent } from './app.component';
/**
 * SECURITY AUTHENTICATION
 */
import { AuthInterceptor } from './app-shared/authconfig.interceptor';
/**
 * PRESENTATION/PURE COMPONENTS
 */
import { HeaderComponent } from './app-components/header/header.component';
import { VshareActivitiesTableComponent } from './app-components/vshare-activities-table/vshare-activities-table.component';
import { VshareFavoritesTableComponent } from './app-components/vshare-favorites-table/vshare-favorites-table.component';
import { NoCardDataComponent } from './app-components/no-card-data/no-card-data.component';
/**
 * APPLICATION_LEVEL/SMART COMPONENTS
 */
import { LoginComponent } from './app-pages/login/login.component';
import { LandingsamlComponent } from './app-pages/landingsaml/landingsaml.component';
import { LoginTotpComponent } from './app-pages/login-totp/login-totp.component';
import { LoginBackupCodeComponent } from './app-pages/login-backup-code/login-backup-code.component';
import { DashboardComponent } from './app-pages/dashboard/dashboard.component';
import { ExternalSharedbylinkComponent } from './app-pages/external-sharedbylink/external-sharedbylink.component';
import { SidebarComponent } from 'src/app/app-pages/external-sharedbylink/components/sidebar/sidebar.component';
import { TableComponentLink } from 'src/app/app-pages/external-sharedbylink/components/table/table.component';
import { UploadLink } from 'src/app/app-pages/external-sharedbylink/components/services/link.service';
import { LinkTableSide, LinkSideTable, exportActivityPDF, LabelService, GroupFolderButton, CreateService, DeleteServiceAllfiles } from 'src/app/file-sharing/services/sidebar.service';
import { UploadListComponent } from './app-pages/external-sharedbylink/components/upload-list/upload-list.component';
import { PathLinkComponent } from './app-pages/external-sharedbylink/components/path-link/path-link.component';
import { MovecopyDialogComponent } from './app-pages/external-sharedbylink/components/movecopy-dialog/movecopy-dialog.component';
import { TableDialogComponent } from './app-pages/external-sharedbylink/components/table-dialog/table-dialog.component';
import { NotFoundComponent } from './app-pages/not-found/not-found.component';

import { GlobalVariable } from './globalviarables';
import {AppSharedModule} from './app-shared.module';
import { NgxOnlyOfficeModule } from "ngx-onlyoffice";
import { OnlyofficeblackComponent } from 'src/app/app-pages/onlyofficeblack/onlyofficeblack.component';
import { DropFileLink } from 'src/app/app-pages/external-sharedbylink/components/dragdroplink';
import { ConfigService } from './config.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DownloadComponent } from './app-pages/download/download.component';
import { CardSelectorComponent } from './app-pages/dashboard/card-selector/card-selector.component';
import { DraggableCardComponent } from './app-pages/dashboard/draggable-card/draggable-card.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { NewsAndRemindersComponent } from './app-pages/dashboard/news-and-reminders/news-and-reminders.component';
import { FeedItemComponent } from './app-pages/dashboard/news-and-reminders/feed-item/feed-item.component';
import { DownloadMobileComponent } from './app-pages/download-mobile/download-mobile.component';
import { PostItItemComponent } from './app-pages/dashboard/news-and-reminders/post-it-item/post-it-item.component';
import { AddPostItDialogComponent } from './app-pages/dashboard/news-and-reminders/add-post-it-dialog/add-post-it-dialog.component';
import { EmptyPostItItemComponent } from './app-pages/dashboard/news-and-reminders/empty-post-it-item/empty-post-it-item.component';
import { AddFeedUrlDialogComponent } from './app-pages/dashboard/news-and-reminders/add-feed-url-dialog/add-feed-url-dialog.component';
import { EmptyFeedItemComponent } from './app-pages/dashboard/news-and-reminders/empty-feed-item/empty-feed-item.component';
import { NewsRemindersCustomSnackbarComponent } from './app-pages/dashboard/news-and-reminders/news-reminders-custom-snackbar/news-reminders-custom-snackbar.component';
import { LoginV2Component } from './app-pages/login-v2/login-v2.component';
import { FlowPageComponent } from './app-pages/login-v2/flow-page/flow-page.component';
import { RemindersPageComponent } from './app-pages/dashboard/reminders-page/reminders-page.component';
import { SearchPostItPipe } from './app-pipes/search-post-it.pipe';
import { FilterPostItDialogComponent } from './app-pages/dashboard/reminders-page/filter-post-it-dialog/filter-post-it-dialog.component';
import { MatDaterangepickerModule } from 'mat-daterangepicker';
import { NewUserDialogComponent } from './settings/components/new-user-dialog/new-user-dialog.component';
import { FilterUserDialogComponent } from './settings/components/filter-user-dialog/filter-user-dialog.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment';
import { NewPasswordGuestComponent } from './app-pages/new-password-guest/new-password-guest.component';
import { UploadNewuserFileComponent } from './settings/components/upload-newuser-file/upload-newuser-file.component';

const appInitializerFn = (configService: ConfigService) => {
  return () => {
    return configService.setConfig();
  };
};

@NgModule({
  declarations: [
    // APP BOOTSTRAP
    AppComponent,

    // PRESENTATION/PURE COMPONENTS
    HeaderComponent,
    VshareActivitiesTableComponent,
    VshareFavoritesTableComponent,
    NoCardDataComponent,

    // APPLICATION_LEVEL/SMART COMPONENTS
    LoginComponent,
    LandingsamlComponent,
    ExternalSharedbylinkComponent,
    SidebarComponent,
    TableComponentLink,
    LoginTotpComponent,
    LoginV2Component,
    FlowPageComponent,
    LoginBackupCodeComponent,
    DashboardComponent,
    DownloadComponent,
    DownloadMobileComponent,
    UploadListComponent,
    PathLinkComponent,
    MovecopyDialogComponent,
    TableDialogComponent,
    OnlyofficeblackComponent,
    DropFileLink,
    CardSelectorComponent,
    DraggableCardComponent,
    NewsAndRemindersComponent,
    FeedItemComponent,
    PostItItemComponent,
    AddPostItDialogComponent,
    EmptyPostItItemComponent,
    AddFeedUrlDialogComponent,
    EmptyFeedItemComponent,
    NewsRemindersCustomSnackbarComponent,
    RemindersPageComponent,
    SearchPostItPipe,
    FilterPostItDialogComponent,
    NewUserDialogComponent,
    FilterUserDialogComponent,
    NewPasswordGuestComponent,
    UploadNewuserFileComponent,
    NotFoundComponent
  ],
  imports: [
    AppMaterialModule, // MATERIAL THEME
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SimplebarAngularModule,
    AppSharedModule,
    NgxOnlyOfficeModule,
    DragDropModule,
    ColorPickerModule,
    MatDaterangepickerModule,
    // NgbModule,
    QRCodeModule,
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    AppRoutingModule // ROUTING sempre per ultimo
  ],
  exports: [
    ColorPickerModule,
    AppMaterialModule, // MATERIAL THEME
    SearchPostItPipe
  ],
  /*
  entryComponents: [
    MovecopyDialogComponent,
  ],
  */
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [ConfigService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    GlobalVariable,
    LinkTableSide,
    LinkSideTable,
    exportActivityPDF,
    LabelService,
    GroupFolderButton,
    CreateService,
    DeleteServiceAllfiles,
    UploadLink,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
