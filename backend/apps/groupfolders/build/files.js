!function(e,r){if("object"==typeof exports&&"object"==typeof module)module.exports=r();else if("function"==typeof define&&define.amd)define([],r);else{var n=r();for(var t in n)("object"==typeof exports?exports:e)[t]=n[t]}}(window,(function(){return function(e){function r(r){for(var n,o,i=r[0],u=r[1],a=0,f=[];a<i.length;a++)o=i[a],Object.prototype.hasOwnProperty.call(t,o)&&t[o]&&f.push(t[o][0]),t[o]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(e[n]=u[n]);for(l&&l(r);f.length;)f.shift()()}var n={},t={0:0};function o(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.e=function(e){var r=[],n=t[e];if(0!==n)if(n)r.push(n[2]);else{var i=new Promise((function(r,o){n=t[e]=[r,o]}));r.push(n[2]=i);var u,a=document.createElement("script");a.charset="utf-8",a.timeout=120,o.nc&&a.setAttribute("nonce",o.nc),a.src=function(e){return o.p+""+({2:"sharing",3:"vendors~sharing"}[e]||e)+".js"}(e);var l=new Error;u=function(r){a.onerror=a.onload=null,clearTimeout(f);var n=t[e];if(0!==n){if(n){var o=r&&("load"===r.type?"missing":r.type),i=r&&r.target&&r.target.src;l.message="Loading chunk "+e+" failed.\n("+o+": "+i+")",l.name="ChunkLoadError",l.type=o,l.request=i,n[1](l)}t[e]=void 0}};var f=setTimeout((function(){u({type:"timeout",target:a})}),12e4);a.onerror=a.onload=u,document.head.appendChild(a)}return Promise.all(r)},o.m=e,o.c=n,o.d=function(e,r,n){o.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,r){if(1&r&&(e=o(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var t in e)o.d(n,t,function(r){return e[r]}.bind(null,t));return n},o.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(r,"a",r),r},o.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},o.p="/",o.oe=function(e){throw console.error(e),e};var i=window.webpackJsonpGroupFolder=window.webpackJsonpGroupFolder||[],u=i.push.bind(i);i.push=r,i=i.slice();for(var a=0;a<i.length;a++)r(i[a]);var l=u;return o(o.s=26)}({26:function(e,r,n){e.exports=n(27)},27:function(e,r,n){
/*
 * @copyright Copyright (c) 2018 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 *
 * @license GNU AGPL version 3 or any later version
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
!function(e,r){e.Plugins.register("OCA.Files.App",{attach:function(){r.Theming?e.MimeType._mimeTypeIcons["dir-group"]=e.generateUrl("/apps/theming/img/groupfolders/folder-group.svg?v="+r.Theming.cacheBuster):e.MimeType._mimeTypeIcons["dir-group"]=e.imagePath("groupfolders","folder-group")}}),n.nc=btoa(e.requestToken),n.p=e.linkTo("groupfolders","build/");var t={attach:function(e){e.on("rendered",(function(){var r=this;if(this.model&&"group"===this.model.get("mountType")){var t=document.createElement("div"),o=e.$el.find(".dialogContainer")[0];o.parentNode.insertBefore(t,o.nextSibling),t.id="groupfolder-sharing",Promise.all([n.e(3),n.e(2)]).then(n.bind(null,29)).then((function(e){new(0,e.default)({propsData:{fileModel:r.model}}).$mount(t)}))}}))}};e.Plugins.register("OCA.Sharing.ShareTabView",t)}(OC,OCA)}})}));
//# sourceMappingURL=files.js.map