// CKEDITOR.plugins.add("inlinesave",{requires:"notification",init:function(b){var a=b.config.inlinesave,c;if(typeof a=="undefined"){a={}}c=!!a.useColorIcon?"inlinesave-color.svg":"inlinesave.svg";b.addCommand("inlinesave",{exec:function(f){var d={},j="",k="application/x-www-form-urlencoded; charset=UTF-8";if(typeof a.postUrl=="undefined"){throw new Error("CKEditor inlinesave: You must define config.inlinesave.postUrl in your configuration file. See http://ckeditor.com/addon/inlinesave");return}if(typeof a.onSave=="function"){var i=a.onSave(f);if(typeof i!="undefined"&&!i){if(typeof a.onFailure=="function"){a.onFailure(f,-1,null)}else{throw new Error("CKEditor inlinesave: Saving Disable by return of onSave function = false")}return}}CKEDITOR.tools.extend(d,a.postData||{},true);d.editabledata=f.getData();d.editorID=f.container.getId();if(!!a.useJSON){j=JSON.stringify(d);k="application/json; charset=UTF-8"}else{var h="";for(var e in d){h+="&"+e+"="+encodeURIComponent(d[e])}j=h.slice(1)}var g=new XMLHttpRequest();g.onreadystatechange=function(){if(g.readyState==4){if(g.status==200){if(typeof a.onSuccess=="function"){a.onSuccess(f,g.response)}if(a.successMessage){f.showNotification(a.successMessage,"success")}}else{if(typeof a.onFailure=="function"){a.onFailure(f,g.status,g)}if(a.errorMessage){f.showNotification(a.errorMessage,"warning")}}}};g.open("POST",a.postUrl,true);g.setRequestHeader("Content-type",k);g.send(j)}});b.ui.addButton("Inlinesave",{toolbar:"document",label:"Save",command:"inlinesave",icon:this.path+"images/"+c})}});

CKEDITOR.plugins.add('inlinesave',
    {
        requires: 'notification',
        init: function (editor) {
            var config = editor.config.inlinesave,
                iconName;

            if (typeof config == "undefined") { // Give useful error message if user doesn't define config.inlinesave
                config = {}; // default to empty object
            }

            iconName = !!config.useColorIcon ? 'inlinesave-color.svg' : 'inlinesave.svg';

            editor.addCommand('inlinesave',
                {
                    exec: function (editor) {
                        var postData = {},
                            payload = '',
                            contentType = 'application/x-www-form-urlencoded; charset=UTF-8';

                        if (typeof config.postUrl == "undefined") { // Give useful error message if user doesn't define config.inlinesave.postUrl (or config.inlinesave)
                            throw new Error("CKEditor inlinesave: You must define config.inlinesave.postUrl in your configuration file. See http://ckeditor.com/addon/inlinesave");
                            return;
                        }                     

                        // Clone postData object from config and add editabledata and editorID properties
                        CKEDITOR.tools.extend(postData, config.postData || {}, true); // Clone config.postData to prevent changing the config.
                        postData.editabledata = editor.getData();
                        postData.editorID = editor.container.getId();

                        // If user opts to use JSON format for sending data to server, use Content-type 'application/json'.
                        if (!!config.useJSON) {
                            WFAModel.BindModel();
                            payload = WFAModel;
                            contentType = 'application/json; charset=UTF-8';

                        }                      
                        WFAModel.AjaxCallPOST(config.postUrl, WFAModel.Model,
                            function (response) {
                               if(response!=null && response.Model!=null && response.Model.Performed && response.Model.Dto!=null)
                               {
                                editor.showNotification(config.successMessage, "success");
                               }
                               else
                               {
                                editor.showNotification(config.errorMessage, "warning");
                               }
                            });
                        
                    }
                });
            editor.ui.addButton('Inlinesave',
                {
                    toolbar: 'document',
                    label: 'Save',
                    command: 'inlinesave',
                    icon: this.path + 'images/' + iconName
                });
        }
    });