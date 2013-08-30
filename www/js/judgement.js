var app = {

	chapter_id : null,
	idea_id : 1,

	initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        console.log('device ready');

        var url_params = helper.getURLDetails();
        if( !helper.isNull(url_params.ch) && !helper.isNull(url_params.idea_id) ){
        	app.chapter_id = url_params.ch;
        	app.idea_id = url_params.idea_id;
	     	app.getAllJudgements(app.idea_id,app.chapter_id);
	     	app.initPageLayout(app.chapter_id);
     	}
     	else{
     		helper.makeToast("There occured some error please try again");
     	}
     	app.bindEventListeners();

    },

    bindEventListeners : function(){
        $("a").click(function(e){
            e.preventDefault();
            switch($(this).data("url")){
                case "back" :
                    helper.goBack();
                    break;
                case "judgement" :
                    app.showNewJudgement();
                    break;
                case "save" :
                	app.saveJudgement();
                	break;
            }
        });
    },

    getAllJudgements : function(idea_id,chapter_id){
    	db_controller.getAllJudgements(idea_id,chapter_id,function(res){
    		if(res.length > 0){
    			var judgements = "";
    			for( var i=0; i<res.length; i++ ){
    				var judgement = res[i].judgement;
    				var judgement_template = app.addJudgement(judgement);
    				judgements += judgement_template;
    			}
    			$("#judgement-container").html(judgements);
    		}
    	});
    },

    initPageLayout : function(chapter_id){

    	db_controller.get_chapter_data( chapter_id , function(res){
    		var chapter_name = res.name;
    		console.log(chapter_name);
    		$('#chaptername').html(chapter_name);
    	});
    },

    showNewJudgement : function(){
    	$("#new-judgement").addClass("show");
    },

    hideNewJudgement : function(){
    	$("#new-judgement").removeClass("show");	
    },

    saveJudgement : function(){
    	var judgement = $("#note").val();
    	if( $.trim(judgement) != '' ){
    		db_controller.insertJudgement(app.idea_id,app.chapter_id,judgement,function(res){
    			if(res){
    				helper.makeToast('Sucessfully saved Judgement');
    				var str = app.addJudgement(judgement);
    				$("#judgement-container").append(str);
    				app.hideNewJudgement();
    			}
    		})
    	}
    	else{
    		helper.makeToast('Please enter some judgement!!');
    	}
    },

    addJudgement : function(str){
    	return "<a href='#' data-url='answer' data-type='text'><div class='answer-box'><div class='content'>"+str+"</div></div></a>";
    },


}