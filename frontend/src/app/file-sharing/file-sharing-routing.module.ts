import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app-shared/auth.guard';

import { FileSharingComponent } from './file-sharing.component';
import { AllFilesComponent } from './pages/all-files/all-files.component';
import { RecentsComponent } from './pages/recents/recents.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
//import { LabelsComponent } from './pages/labels/labels.component';
import { TagComponent } from './pages/tags/tag/tag.component';
import { DeletedComponent } from './pages/deleted/deleted.component';
import { ExternalarchivesComponent } from './pages/externalarchives/externalarchives.component';
import { SharesComponent } from './pages/shares/shares.component';
import { SharedByYouComponent } from './pages/shared-by-you/shared-by-you.component';
import { SharedByOthersComponent } from './pages/shared-by-others/shared-by-others.component';
import { SharedByLinkComponent } from './pages/shared-by-link/shared-by-link.component';
import { FolderComponent } from './pages/folder/folder.component';
import { SharesDeletedComponent } from './pages/shares-deleted/shares-deleted.component';
import { AllActivitiesComponent } from './pages/activity/all-activities/all-activities.component';
import { YourActivitiesComponent } from './pages/activity/your-activities/your-activities.component';
import { OthersActivitiesComponent } from './pages/activity/others-activities/others-activities.component';
import { ActFavoritesComponent } from './pages/activity/act-favorites/act-favorites.component';
import { FileChangesComponent } from './pages/activity/file-changes/file-changes.component';
import { SecurityComponent } from './pages/activity/security/security.component';
import { FileSharesComponent } from './pages/activity/file-shares/file-shares.component';
import { CalendarComponent } from './pages/activity/calendar/calendar.component';
import { TaskComponent } from './pages/activity/task/task.component';
import { ActivitiesandnotificationsComponent } from './pages/settings/activitiesandnotifications/activitiesandnotifications.component';
import { ApplicationsComponent } from './pages/settings/applications/applications.component';
import { ExternalArchivesComponent } from './pages/settings/externalarchives/externalarchives.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { GroupFolderComponent } from './pages/group-folder/group-folder.component';
import { GroupfoldersComponent } from './pages/settings/groupfolders/groupfolders.component';
import { VpecComponent } from './pages/vpec/vpec.component';
import { ProtectedFilesComponent } from './pages/protected-files/protected-files.component';
import { PadesSignatureComponent } from './components/digital-signature/pades-signature/pades-signature.component';
import { DigitalSignatureComponent } from './components/digital-signature/digital-signature.component';
import { SetSignatureComponent } from './components/digital-signature/set-signature/set-signature.component';
import { AuthSignatureComponent } from './components/digital-signature/auth-signature/auth-signature.component';
import { VflowComponent } from './pages/vflow/vflow.component';

//USER SETTINGS ~~~
import { SignedDocumentsFolderComponent } from './pages/signed-documents-folder/signed-documents-folder.component';
import { SignatureSettingsComponent } from './pages/settings/signature-settings/signature-settings.component';
import { SignatureSettingsFormComponent } from './pages/settings/signature-settings/components/signature-settings-form/signature-settings-form.component';
//~~~ / -- / ~~~



const fsRoutes: Routes = [
  { path: '',
    component: FileSharingComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'all-files', component: AllFilesComponent, canActivate: [AuthGuard] },
      { path: 'recents', component: RecentsComponent, canActivate: [AuthGuard] },
      { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
      { path: 'labels', component: TagComponent, canActivate: [AuthGuard] },
      //{ path: 'labels', component: LabelsComponent, canActivate: [AuthGuard] },
      { path: 'deleted', component: DeletedComponent, canActivate: [AuthGuard] },
      { path: 'externalarchives', component: ExternalarchivesComponent, canActivate: [AuthGuard] },
      { path: 'shares', component: SharesComponent, canActivate: [AuthGuard] },
      { path: 'shared-by-you', component: SharedByYouComponent, canActivate: [AuthGuard] },
      { path: 'shared-by-others', component: SharedByOthersComponent, canActivate: [AuthGuard] },
      { path: 'shared-by-link', component: SharedByLinkComponent, canActivate: [AuthGuard] },
      { path: 'shares-deleted', component: SharesDeletedComponent, canActivate: [AuthGuard] },
      { path: 'folder/:name', component: FolderComponent, canActivate: [AuthGuard] },
      { path: 'search-result/:query', component: SearchResultComponent, canActivate: [AuthGuard] },
      { path: 'group-folder', component: GroupFolderComponent, canActivate: [AuthGuard] },
      { path: 'attachmentsvpec', component: VpecComponent, canActivate: [AuthGuard] },
      { path: 'protectedfile', component: ProtectedFilesComponent, canActivate: [AuthGuard] },
      { path: 'signed-documents-folder', component: SignedDocumentsFolderComponent, canActivate: [AuthGuard] },
      { path: 'vflow', component: VflowComponent, canActivate: [AuthGuard] },

      { path: 'activities-all', component: AllActivitiesComponent, canActivate: [AuthGuard] },
      { path: 'activities-your', component: YourActivitiesComponent, canActivate: [AuthGuard] },
      { path: 'activities-others', component: OthersActivitiesComponent, canActivate: [AuthGuard] },
      { path: 'activities-favorites', component: ActFavoritesComponent, canActivate: [AuthGuard] },
      { path: 'activities-filechanges', component: FileChangesComponent, canActivate: [AuthGuard] },
      { path: 'activities-security', component: SecurityComponent, canActivate: [AuthGuard] },
      { path: 'activities-fileshares', component: FileSharesComponent, canActivate: [AuthGuard] },
      { path: 'activities-calendar', component: CalendarComponent, canActivate: [AuthGuard] },
      { path: 'activities-task', component: TaskComponent, canActivate: [AuthGuard] },

      { path: 'digital-signature',
        component: DigitalSignatureComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'set-signature',
            component: SetSignatureComponent,
            canActivate: [AuthGuard],
            children: [
              {
                path: 'authentication',
                component: AuthSignatureComponent,
                canActivate: [AuthGuard],
              },
              {
                path: 'pades-signature',
                component: PadesSignatureComponent,
                canActivate: [AuthGuard],
              },
            ]
          },
          { path: '',
            redirectTo: 'set-signature',
            pathMatch: 'full' }
        ]
      },

      { path: 'settings-activitiesandnotifications', component: ActivitiesandnotificationsComponent, canActivate: [AuthGuard] },
      { path: 'settings-applications', component: ApplicationsComponent, canActivate: [AuthGuard] },
      { path: 'settings-externalarchives', component: ExternalArchivesComponent, canActivate: [AuthGuard] },
      { path: 'settings-groupfolders', component: GroupfoldersComponent, canActivate: [AuthGuard] },
      { path: 'settings-signaturesettings', component: SignatureSettingsComponent, canActivate: [AuthGuard] },
      { path: 'settings-signaturesettingsform', component: SignatureSettingsFormComponent, canActivate: [AuthGuard] },

      { path: '', redirectTo: 'all-files', pathMatch: 'full' },
      { path: '**', component: AllFilesComponent } // In case of not founded route (404 error)
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(fsRoutes)],
  exports: [RouterModule]
})
export class FileSharingRoutingModule { }
