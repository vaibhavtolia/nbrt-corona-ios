var app = {
    
    idea_id : null,
    qid : null,
    type : null,
    image : null,
    response_type : null,

    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        console.log('device ready');
        app.bindEventListeners();
        var url_params = helper.getURLDetails();
        app.type = url_params.type;
        app.qid = url_params.qid;
        app.idea_id = url_params.idea_id;
        helper.getChapterDetails(app.qid,function(question){
            $("#q").html(question);    
        });
    },
    bindEventListeners : function(){
        $("a").click(function(e){
            e.preventDefault();
            switch($(this).data("url")){
                case "back" :
                    helper.goBack();
                    break;
                case "camera" :
                    app.startCamera();
                    break;
                case "gallery" : 
                    app.openGallery();
                    break;
                case "video" :
                    app.startVideo();
                    break;
                case "save" :
                    app.saveMedia();
                    break;
                case "cancel" :
                    app.cancel();
            }
        });
    },
    startCamera : function(){
        console.log('start camera called');
        navigator.camera.getPicture(app.onCameraSuccess, app.onCameraFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            targetHeight: 300
        });
    },
    onCameraSuccess : function(imageData){
        console.log('camera success')
        app.image = imageData;
        $('img',{
            src : imageData
        }).appendTo(".image-holder img");
        app.response_type = "image";
        app.showActionbar();
    },
    onCameraFail : function(message){
        console.log('camera failed');
        alert('Failed because: ' + message);
    },
    openGallery : function(){
        console.log('open gallery called');
        navigator.camera.getPicture(app.onGallerySuccess, app.onGalleryFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
            targetHeight: 300
        });
    },
    onGallerySuccess : function(imageData){
        console.log('gallery success')
        //console.log(imageData);
        app.image = imageData;
        $(".image-holder img").attr("src",imageData);
        app.response_type = "image";
        app.showActionbar();
    },
    onGalleryFail : function(){
        console.log('gallery failed');
        alert('Failed because: ' + message);
    },
    startVideo : function(){
        console.log('video called');
        navigator.device.capture.captureVideo(videoCaptureSuccess, videoCaptureError);
    },
    videoCaptureSuccess : function(mediaFiles){
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            console.log(mediaFiles[i]);
        }
    },
    videoCaptureError : function(error){
        var msg = 'An error occurred during capture: ' + error.code;
        alert(msg);
    },
    showActionbar : function(){
        $(".action-bar").show();
    },
    hideActionbar : function(){
        $(".action-bar").hide();
    },
    saveMedia : function(){
        var response_type = app.response_type;
        console.log('save media called');
        app.saveFile(function(status,filename){
            console.log(status);
            if(status != null){
                console.log(filename);
                console.log(app.type,app.qid,app.response_type);
                if(app.type == "answer"){
                    db_controller.insert_answer(app.idea_id,app.qid,app.response_type,filename,function(a){
                        if(a){
                            helper.makeToast("Added media successfully");
                            setTimeout(function(){
                                helper.goBack();
                            },1000);
                        }
                        else{
                            helper.makeToast("There occured some error, please try again");
                        }
                    });
                }
                else{
                    db_controller.insert_risk(app.idea_id,app.qid,app.response_type,filename,function(a){
                        if(a){
                            helper.makeToast("Added media successfully");
                        }
                        else{
                            helper.makeToast("There occured some error, please try again");
                        }
                    })
                }
            }
        });
    },
    saveFile : function(callback){
        console.log('save file called');
        var filepath = app.image;
        console.log(filepath);
        var d = new Date();
        var n = d.getTime();
        var filename = "nbrt_"+ n + ".jpg";
        console.log(filename);
        var folder = "nbrt/images/";
        window.resolveLocalFileSystemURI(filepath, function(file){
            
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                var entry = fileSystem.root;
                entry.getDirectory(folder, {create: true, exclusive: false}, function(dir){

                    //console.log('found/created dir : '+dir.fullPath);
                    var fullPath = "file://localhost"+dir.fullPath;

                    window.resolveLocalFileSystemURI(fullPath,function(destination){
                        file.moveTo(destination,filename,function(entry){
                            console.log("new path "+entry.fullPath);
                            callback(true,filename);
                        },function(err){
                            console.log("error : "+err.code);
                            callback(null);
                        });
                    }, function(err){
                        console.log(err.target.error.code);
                        callback(null);
                    });
                }, function(err){
                    console.log("error could not find/create dir "+err.code);
                    callback(null);
                });
            }, null); 
        });
    },
    cancel : function(){
        helper.goBack();
    }
}