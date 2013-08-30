var app = {
    
    idea_id : null,
    qid : 0,
    type : null,
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        console.log('device ready');
        app.bindEventListners();
        var url_params = helper.getURLDetails();
        app.qid = url_params.qid;
        app.type = url_params.type;
        app.idea_id = url_params.idea_id;
        console.log("qid",app.qid);
        console.log("type",app.type);
        console.log("idea",app.idea_id);
        helper.getChapterDetails(app.qid,function(question){
            console.log("ques",question);
            $("#q").html(question);    
        });
    },
    bindEventListners : function(){
        $("a").click(function(e){
            e.preventDefault();
            console.log("a clicked");
            switch($(this).data("url")){
                case "back" :
                    helper.goBack();
                    break;
                case "save" :
                    app.saveNote();
                    break;
                case "cancel" :
                    app.cancelNote();
                    break;
            }
        });
    },
    saveNote : function(){
        var answer = $("#note").val();
        console.log(answer);
        if(answer != ""){
            if(app.type == "answer"){
                db_controller.insert_answer(app.idea_id,app.qid,"text",answer,function(a){
                    if(a){
                        helper.makeToast("Added note successfully");
                    }
                })
            }
            else{
                db_controller.insert_risk(app.idea_id,app.qid,"text",answer,function(a){
                    if(a){
                        helper.makeToast("Added note successfully");
                    }
                })
            }
        }else{
            helper.makeToast("Please enter some text");
            $("#q").focus();
        }
    },
    cancelNote : function(){
        helper.goBack();
    }
}