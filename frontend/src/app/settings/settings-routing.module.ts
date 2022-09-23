import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DeviceSessionComponent } from './pages/device-session/device-session.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { EncryptionComponent } from './pages/encryption/encryption.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';
import { ConfigPanelComponent } from './pages/config-panel/config-panel.component';
import { GroupsComponent } from './pages/groups-settings/groups.component';
import { SinglegroupComponent } from './pages/groups-settings/singlegroup/singlegroup.component';
import { UserSearchComponent } from './pages/users-settings/components/user-search/user-search.component';
import { DisableuserComponent } from './pages/users-settings/disableuser/disableuser.component';
import { LdapuserComponent } from './pages/users-settings/ldapuser/ldapuser.component';
import { SamluserComponent } from './pages/users-settings/samluser/samluser.component';
import { UsersComponent } from './pages/users-settings/user/users.component';
import { VDpaSettingsComponent } from './pages/vdpa-settings/vdpa-settings.component';
import { CanvasUserSearchComponent } from './pages/users-settings/components/canvas-user-search/canvas-user-search.component';
import { GuestsSettingsComponent } from './pages/guests-settings/guests-settings.component';
import { SmtpComponent } from './pages/smtp/smtp.component';
import { SamluserSettingsComponent } from './pages/samluser-settings/samluser-settings.component';
import { SamluserDisabledComponent } from './pages/samluser-settings/components/samluser-disabled/samluser-disabled.component';
import { AuthGuard } from '../app-shared/auth.guard';

const sRoutes: Routes = [
  { path: '',
    component: SettingsComponent,
    children: [
      { path: 'devicesession', component: DeviceSessionComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'authentication', component: AuthenticationComponent, canActivate: [AuthGuard] },
      { path: 'encryption', component: EncryptionComponent, canActivate: [AuthGuard] },
      { path: 'configurations', component: ConfigurationsComponent, canActivate: [AuthGuard] },
      { path: 'users-settings', component: UsersComponent, canActivate: [AuthGuard]},
      
      { path: 'vdpa', component: VDpaSettingsComponent, canActivate: [AuthGuard] },
      { path: 'config-panel', component: ConfigPanelComponent, canActivate: [AuthGuard] },
      { path: 'smtp', component: SmtpComponent, canActivate: [AuthGuard] },
      { path: 'disabled-user-settings', component: DisableuserComponent, canActivate: [AuthGuard] },
      { path: 'ldapuser-settings', component: LdapuserComponent, canActivate: [AuthGuard] },
      { path: 'samluser-settings', component: SamluserComponent, canActivate: [AuthGuard] },
      { path: 'user-settings-search/:query', component: UserSearchComponent, canActivate: [AuthGuard] },
      { path: 'canvas-user-settings-search/:query', component: CanvasUserSearchComponent, canActivate: [AuthGuard] },
      { path: 'groups-settings', component: GroupsComponent, canActivate: [AuthGuard]},
      { path: 'groups-settings/users/:query', component: SinglegroupComponent, canActivate: [AuthGuard] },
      { path: 'guest-settings', component: GuestsSettingsComponent, canActivate: [AuthGuard]},
      { path: 'samlusers-settings', component: SamluserSettingsComponent, canActivate: [AuthGuard]},
      { path: 'samlusersdisabled-settings', component: SamluserDisabledComponent, canActivate: [AuthGuard]},

      { path: '', redirectTo: 'users-settings', pathMatch: 'full' },
      // { path: '**', component: Page404FileSharingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(sRoutes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
