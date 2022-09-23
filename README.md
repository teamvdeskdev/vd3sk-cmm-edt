# vd3sk-cmm-edt
## _vDesk Community Edition_


[![N|Solid](https://raw.githubusercontent.com/teamvdeskdev/vd3sk-cmm-edt/master/livebox-vdesk-fullhd.png)](https://nodesource.com/products/nsolid)

vDesk è una piattaforma componibile, sicura, crittografata e facilmente integrabile con altri sistemi IT aziendali e completamente personalizzabile sia per processo che per funzione.
Principalmente rivolta alle funzioni apicali, permette di collaborare facilmente, condividere le informazioni in sicurezza, inviare file e firmarli digitalmente senza mai uscire da un ecosistema totalmente protetto.
Cosa fa vDesk?

- Profilare gli utenti in modo semplice e intuitivo
- Utilizzare una serie di applicazioni integrate 
- Tracciare la documentazione sensibile
- Condividere e collaborare in maniera sicura

## Features

- Piattaforma sicura e cifrata
- Unica dashboard 
- Filesharing avanzato
- Gestione ruoli e profili 

## Screenshots
[![N|Solid](https://raw.githubusercontent.com/teamvdeskdev/vd3sk-cmm-edt/master/back_login.png)](https://nodesource.com/products/nsolid)
[![N|Solid](https://raw.githubusercontent.com/teamvdeskdev/vd3sk-cmm-edt/master/back_dashboard.png)](https://nodesource.com/products/nsolid)
[![N|Solid](https://raw.githubusercontent.com/teamvdeskdev/vd3sk-cmm-edt/master/back_vshare.png)](https://nodesource.com/products/nsolid)

## Architettura
L’applicativo vDesk consiste in 3 differenti applicativi che possono essere disposti in layer di rete differenti. L’interazione fra gli applicativi avviene tramite chiamate HTTPS. Ogni url dovra avere la propria FQDN ed un certificato SSL autorevole.
vDesk, oltre ad essere il nome del progetto,  è l’applicativo che funge da frontend ed è il principale punto di accesso all’applicativo;
**Bridge** è l’applicativo che gestisce le comunicazioni fra il client, vDesk e il Backend.
**Drive** è il **backend** del programma ed ha la funzione di coordinamento e gestione di tutte le chiamate, dell’accesso ai dati e della scrittura dei file utente.

## Prerequisiti e Dipendenze 

### _FrontEnd_

| Piattaforma | Opzioni |
| ------ | ------ |
| Operating System | •	Ubuntu 18.04 LTS + |
|  | •	Red Hat Enterprise Linux 8 + |
|  | •	Debian 10 + |
|  |  |
| Webserver | •	Apache 2.4 with `mod_php` or `php-fpm` |
|  | •	nginx with `php-fpm` |
|  |  |
| Node | •	14.19 + |

I requisiti di **memoria** per l'esecuzione dell'aplicativo **Bridge** sono molto variabili, a seconda del numero di utenti, app, file e volume di attività del server.
Bridge richiede un minimo di **512 MB** di RAM

### _Bridge_

| Piattaforma | Opzioni |
| ------ | ------ |
| Operating System | •	Ubuntu 18.04 LTS + |
|  | •	Red Hat Enterprise Linux 8 + |
|  | •	Debian 10 + |
|  |  |
| Webserver | •	Apache 2.4 with `mod_php` or `php-fpm` |
|  | •	nginx with `php-fpm` |
|  |  |
| PHP Runtime | •	7.4 |
|  |  |
| Database | •	MySQL 5.7 or MariaDB 10.3 and 10.4 |
|  | •	Oracle Database 11g (only as part of an enterprise subscription) |
|  | •	PostgreSQL 9.5/9.6/10/11 |

I requisiti di **memoria** per l'esecuzione del’applicativo Bridge sono molto variabili, a seconda del numero di utenti, app, file e volume di attività del server.
Bridge richiede un minimo di **512 MB** di RAM

I moduli **PHP** necessari sono i seguenti:

-	PHP 7.4
-	PHP module ctype
-	PHP module curl
-	PHP module dom
-	PHP module GD
-	PHP module iconv
-	PHP module JSON
-	PHP module libxml (Linux package libxml2 must be >=2.7.0)
-	PHP module mbstring
-	PHP module openssl
-	PHP module posix
-	PHP module session
-	PHP module SimpleXML
-	PHP module XMLReader
-	PHP module XMLWriter
-	PHP module zip
-	PHP module zlib
-	PHP module pdo_mysql (MySQL/MariaDB)
-	PHP module pdo_pgsql (requires PostgreSQL >= 9.0)
-	PHP module fileinfo
-	PHP module bz2
-	PHP module intl 
-	PHP module exif
-	PHP module pcntl
-	PHP module bcmath
-	PHP module gd
-	PHP module opcache
-	PHP module pdo_mysql
-	PHP module gmp
-	PHP module imagick
-	PHP module apcu (>= 4.0.6)
-	PHP module memcached
-	PHP module redis (>= 2.2.6)


### _Backend (Drive)_

| Piattaforma | Opzioni |
| ------ | ------ |
| Operating System | •	Ubuntu 18.04 LTS + |
|  | •	Red Hat Enterprise Linux 8 + |
|  | •	Debian 10 + |
|  |  |
| Webserver | •	Apache 2.4 with `mod_php` or `php-fpm` |
|  | •	nginx with `php-fpm` |
|  |  |
| PHP Runtime | •	8.0 |

I requisiti di **memoria** per l'esecuzione di un server Drive sono molto variabili, a seconda del numero di utenti, app, file e volume di attività del server.

Drive richiede un minimo di **1 GB** di RAM

Qui sotto ci sono i requisiti database per **MySQL / MariaDB**:
- InnoDB storage engine (MyISAM non è supportato)
- **"READ COMMITED"** transaction isolation level 
  (Leggere Database “READ COMMITTED” transaction isolation level)
- Disabled or **BINLOG_FORMAT = ROW** configured Binary Logging 
  Leggere (See: https://dev.mysql.com/doc/refman/5.7/en/binary-log-formats.html)
- Per il supporto Emoji (**UTF8 4-byte**) Leggere **Enabling MySQL 4-byte support**

I moduli PHP necessari sono i seguenti:
-	PHP 8.0
-	PHP module ctype
-	PHP module curl
-	PHP module dom
-	PHP module GD
-	PHP module iconv
-	PHP module JSON
-	PHP module libxml (Linux package libxml2 must be >=2.7.0)
-	PHP module mbstring
-	PHP module openssl
-	PHP module posix
-	PHP module session
-	PHP module SimpleXML
-	PHP module XMLReader
-	PHP module XMLWriter
-	PHP module zip
-	PHP module zlib
-	PHP module opcache
-	PHP module pdo_mysql (MySQL/MariaDB)
-	PHP module pdo_pgsql (requires PostgreSQL >= 9.0)
-	PHP module fileinfo
-	PHP module bz2
-	PHP module intl 
-	PHP module ldap
-	PHP module imap 
-	PHP module exif
-	PHP module apcu (>= 4.0.6)
-	PHP module memcached
-	PHP module redis (>= 2.2.6)


## Istruzioni per l'installazione 

### _FrontEnd_
Andare nella cartella in cui è stata clonata la repository GIT e compilare il codice con i comandi sotto:
```sh
npm ci
node --max-old-space-size=4096 ./node_modules/@angular/cli/bin/ng build --prod
cp src/.htaccess dist/vdesk/
```

Modificare il file **dist/vdesk/app-config.json** e **dist/vdesk/.htaccess** personalizzandolo secondo le linee guida riportate sotto
{
    "endpoint":  `"https://BRIDGEFQD/api/v1" `,
    "isDev": false
}
Copiare il contenuto della cartella **dist/vdesk/** nella **“root”** del sito web.

### _Bridge_

Per procedere con l’installazione basta clonare la repository git nella cartella **“root”** del sito web e Modificare le variabili presenti nel file **.env** .
Il file .env deve essere modificato nelle parti evidenziate  con i relativi valori descritti con il corsivo in rosso 
APP_NAME= _`VDESK`_
APP_ENV= _`local`_
APP_KEY= _`Chiave identificativa in base64 dell'Applicazione laravel`_
APP_DEBUG= _`false`_
APP_URL=  _`url del Bridge`_
…….
…….
API_CLIENT_URL=
API_NEXTCLOUD_URL=
HOST_IP=  _`IP del Bridge`_
HOST_NEXTCLOUD=
HOST_IP_FRONTEND= _`url del Bridge`_
DOMAIN_IP_FRONTEND=   _`IP del Bridge`_
DOMAIN_IP_VDESK= _`IP del del frontend vdesk`_
OCSSESSION=  

Nella procedura di installazione bisogna prevedere che manchino il **composer** e l’**autoload** nelle librerie delle terze parti del vendor ,quindi bisogna installare il composer e creare l’autoload:
```sh
apt install composer
composer dump-autoload
```
E quindi rendere i file di log sotto **storage** modificabili

```sh
chmod -R 777 storage/
```

### _Backend (Drive)_

Per procedere con l’installazione basta clonare la repository git nella cartella **“root”** del sito web e collegarsi all’url scelta per proseguire con l’installazione da web.

**Tuning**
E’ consigliato l’utilizzo di **PHP OPcache** per migliorare le prestazioni.
Utilizzare **HTTP2** per velocizzare i caricamenti

## Support
vdeskdev@liveboxcloud.com 
_Le segnalazioni di sicurezza non vanno inviate attraverso l’issue tracker pubblico ma devono essere inviate confidenzialmente a tale indirizzo e-mail._

## License

GNU Affero General Public License

