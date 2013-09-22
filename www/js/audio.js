var app = {
    
    idea_id : null,
    qid : null,
    type : null,
    response_type : "audio",
    mediaRec : null,
    filepath : null,

    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        console.log('device ready');
        app.initLayout();
        var url_params = helper.getURLDetails();
        app.type = url_params.type;
        app.qid = url_params.qid;
        app.idea_id = url_params.idea_id;
        helper.getChapterDetails(app.qid,function(question){
            $("#q").html(question);    
        });

        app.bindEventListeners();

        PLAY_BUTTON = $('#play-button');
        RECORD_BUTTON = $('#record-button');
        CD_BUTTON = $('#cd-button');

    },

    bindEventListeners : function(){
        $("a").click(function(e){
            e.preventDefault();
            switch($(this).data("url")){
                case "back" :
                    helper.goBack();
                    break;
                case "save" :
                    app.saveMedia();
                    break;
                case "cancel" :
                    app.cancel();
            }
        });
    },

    initLayout : function(){
        app.hideActionbar();
        $(".audio-action-bar a:eq(0)").css("visibility","hidden");
        $(".audio-action-bar a:eq(2)").css("visibility","hidden");
    },

    generatefilename : function(){
        var d = new Date();
        var n = d.getTime();
        var filename = "nbrt_"+ n + ".wav";
        return filename;
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
        console.log(RECORD_FILENAME);
        console.log(app.type,app.qid,app.response_type);
        if(app.type == "answer"){
            db_controller.insert_answer(app.idea_id,app.qid,app.response_type,RECORD_FILENAME,function(a){
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
            db_controller.insert_risk(app.idea_id,app.qid,app.response_type,RECORD_FILENAME,function(a){
                if(a){
                    helper.makeToast("Added media successfully");
                }
                else{
                    helper.makeToast("There occured some error, please try again");
                }
            })
        }
    },

    cancel : function(){
        helper.goBack();
    }
}