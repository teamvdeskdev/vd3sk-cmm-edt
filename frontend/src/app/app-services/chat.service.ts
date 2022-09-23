import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPdfComponent } from '../file-sharing/components/dialogs/dialog-pdf/dialog-pdf.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatBadge = 0;
  showChatBadge = true;

  constructor(private dialog: MatDialog) {
    // Listen from chat custom event
    window.addEventListener("updateChatBadge", function(evt) {
      try {
        this.setChatBadge();
      } catch (e) {
        console.log(e);
      }
    }.bind(this), false);

    window.addEventListener("showPdfFile", function(evt) {
      try {
        if (evt && evt.detail) {
          this.openDialogPdf(evt.detail.data, evt.detail.base);
        }
      } catch (e) {
        console.log(e);
      }
    }.bind(this), false);
  }

  showChat() {
    const toggleChat = document.getElementById('conversejs');
    if (toggleChat) {
      toggleChat.style.visibility = 'visible';
    }
  }

  hideChat() {
    const toggleChat = document.getElementById('conversejs');
    if (toggleChat) {
      toggleChat.style.visibility = 'hidden';
    }
  }

  showControlbox() {
    const controlbox = document.getElementById('controlbox');
    if (controlbox) {
      controlbox.classList.toggle('hidden');
      this.showChatBadge = false;
      const chatBadge = document.getElementById('chatBadge');
      if (chatBadge) {
        chatBadge.hidden = true;
      }
    }
  }

  hideControlBox() {
    const controlbox = document.getElementById('controlbox');
    if (controlbox) {
      controlbox.classList.toggle('hidden');
      this.showChatBadge = true;
      const chatBadge = document.getElementById('chatBadge');
      if (chatBadge) {
        chatBadge.hidden = false;
      }
    }
  }

  setChatSettings(currentUser, vMeetEndpoint, vMeetLink, endpoint) {
    vMeetLink = vMeetLink.split('https://')[1];
    const settings = {
      show_send_button: true,
      muc_domain: 'conference.' + vMeetLink,
      view_mode: 'overlayed',
      // websocket_url: 'wss://' + vMeetLink + '/xmpp-websocket',
      websocket_url: 'wss://' + vMeetLink + ':7443/ws',
      auto_login: true,
      auto_away: 600,
      auto_join_on_invite: true,
      auto_subscribe: true,
      auto_reconnect: true,
      clear_cache_on_logout: true,
      muc_nickname_from_jid: true,
      locked_muc_nickname: true,
      allow_non_roster_messaging: true,
      hide_muc_participants: true,
      muc_show_join_leave: false,
      jid: currentUser.id + '@' + vMeetLink,
      id: currentUser.id,
      password: 'secret',
      nickname: currentUser.displayname,
      vMeetEndpoint: vMeetEndpoint,
      vMeetLink: vMeetLink,
      endpoint: endpoint
    };

    return settings;
  }

  setChatBadge() {
    this.chatBadge = Number(sessionStorage.getItem('chatBadge'));
  }

  /** OPEN DIALOG PDF **/
  openDialogPdf(data, base) {
    const dialogRef = this.dialog.open(DialogPdfComponent, {
      width: '70%',
      height: '85%',
      data: { data: data, base: base }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
