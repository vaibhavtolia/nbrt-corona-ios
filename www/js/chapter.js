var app = {
    // Application Constructor
    chapter_id : null,
    idea_id : 1,
    image_fullpath : null,
    video_fulpath : null,
    audio_fullpath : null,
    gallery_init : false,
    db_req_count : 0,
    question_view : {},

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
        
        app.initURIpaths();
        var url_params = helper.getURLDetails();
        if( !helper.isNull( url_params.ch ) ){
            app.initChapterLayout(url_params.ch);
            app.chapter_id = url_params.ch;
        }
        else{
            app.initChapterLayout(1);
            app.chapter_id = 1;
        }
        if( !helper.isNull( url_params.idea_id ) ){
            app.idea_id = url_params.idea_id;
            //console.log("idea chapter",app.idea_id);
        }
        app.getChapterRating();
        app.check_tour();

        //db_controller.get_risks();
    },

    initURIpaths : function(){
        var folder = "nbrt";
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            var entry = fileSystem.root;
            entry.getDirectory(folder, {create: true, exclusive: false}, function(dir){

                //console.log('found/created dir : '+dir.fullPath);
                var fullPath = "file://localhost"+dir.fullPath;
                app.audio_fullpath = fullPath+"/audio/";
                app.video_fulpath = fullPath+"/video/";
                app.image_fullpath = fullPath+"/images/";

            }, function(err){
                console.log("error could not find/create dir "+err.code);
            });
        }, null); 
    },

    initChapterLayout : function(chapter_id){

        var chapter_data;

        app.bindEventListeners();

        db_controller.get_chapter_data( chapter_id , function(res){
            chapter_data = res;
            //console.log(JSON.stringify(chapter_data));
            $("#title-text").html(chapter_data.name);
            $("#summary #title").html(chapter_data.name);
            $("#summary #content").html(chapter_data.summary);
        });

        db_controller.get_all_questions(chapter_id,function(res){
            var questions = res;
            for(var i=0;i<questions.length;i++){
                var question = questions[i].question;
                var qid = questions[i].id;
                //console.log(qid,question);
                var question_template = '<div class="holder"><div class="question">'+question+'</div><div class="options-wrapper"><a href="./text.html?qid='+qid+'" data-url="text" data-value="'+qid+'"><div class="text"><span></span></div></a><a href="./camera.html?qid='+qid+'" data-url="media" data-value="'+qid+'"><div class="media"><span></span></div></a><a href="./audio.html?qid='+qid+'" data-url="audio" data-value="'+qid+'"><div class="audio"><span></span></div></a><a href="#" data-url="risk" data-value="'+qid+'" class="new"><div class="risk">+Risk</div></a><div style="clear:both"></div></div>';

                $(document).trigger('question',[question_template,qid]);

                $(document).trigger('db_request');
                //querying db for all the answers to question
                db_controller.get_all_answers(app.idea_id,qid,function(response,question_id){

                    var answers = response;
                    var answer_template = "";

                    for(var j=0;j<answers.length;j++){
                        var aid = answers[j].id;
                        //console.log(aid);
                        var answer = answers[j].response;
                        //console.log("response_type",answers[j].response_type,aid,answer);
                        var response_type = answers[j].response_type;
                        switch(answers[j].response_type){
                            case "text" : 
                                //console.log("match");
                                answer_template += "<a href='#' data-url='answer' data-type='text' data-qid='"+question_id+"' data-value='"+aid+"'><div class='answer-box'><div class='content'>"+answer+"</div></div></a>";
                                break;
                            case "audio" :
                                //console.log(app.image_fullpath+answer);
                                answer_template +=  "<a href='#' data-url='answer' data-type='audio' data-value='"+aid+"'><div class='answer-box'><div class='content'><audio controls><source src='"+app.audio_fullpath+answer+"' type='audio/ogg'></audio></div></div></a>";
                                break;
                            case "image" :
                                //console.log(app.image_fullpath+answer);
                                answer_template +=  "<a href='#' data-url='answer' data-type='image' data-value='"+aid+"'><div class='answer-box'><div class='content'><img src='"+app.image_fullpath+answer+"' /></div></div></a>";
                                break;
                            case "video" :
                                answer_template +=  "<a href='#' data-url='answer' data-type='video' data-value='"+aid+"'><div class='answer-box'><div class='content'>"+answer+"</div></div></a>";
                                break;
                        }
                    }

                    $(document).trigger('db_response',[answer_template,question_id,"answer"]);

                });


                $(document).trigger('db_request');

                //queryiing db for all risks
                db_controller.get_all_risks(app.idea_id,qid,function(response,question_id){
                    var risks = response;
                    //console.log("risk_response",response);
                    
                    var risk_template = "";
                    
                    for(var j=0; j<risks.length; j++){
                        var rid = risks[j].id;
                        var risk = risks[j].response;
                        console.log("response_type",risks[j].response_type);
                        var response_type = risks[j].response_type;
                        switch(risks[j].response_type){
                            case "text" : 
                                risk_template += "<a href='#' data-url='risks' data-type='text' data-qid='"+question_id+"' data-value='"+rid+"'><div class='answer-box' id='risk'><div class='content'>"+risk+"</div></div></a>";
                                break;
                            case "audio" :
                                risk_template +=  "<a href='#' data-url='risks' data-type='audio' data-value='"+rid+"'><div class='answer-box' id='risk'><div class='content'></div></div></a>";
                                break;
                            case "image" :
                                risk_template +=  "<a href='#' data-url='risks' data-type='image' data-value='"+rid+"'><div class='answer-box' id='risk'><div class='content'><img src='"+app.image_fullpath+risk+"' /></div></div></a>";
                                break;
                            case "video" :
                                risk_template +=  "<a href='#' data-url='risks' data-type='video' data-value='"+rid+"'><div class='answer-box' id='risk'><div class='content'>"+risk+"</div></div></a>";
                                break;
                        }
                    }

                    $(document).trigger('db_response',[risk_template,question_id,"risk"]);
                });
            }
        });
        
    },

    bindEventListeners : function(){
        console.log('called function bindEventListeners');

        $(document).on('question',function(e,q,qid){
            //console.log("==========question=========");
            //console.log(q,qid);
            app.question_view[qid] = q;
        });

        $(document).on('db_request',function(){
            //console.log('==================recieved event db_request==================');
            app.db_req_count++;
            //console.log("req count",app.db_req_count);
        });

        $(document).on('db_response',function(e,s,qid,type){
            //console.log('==================db_response================');
            //console.log(type,qid);
            app.question_view[qid] += s;
            app.db_req_count--;
            //console.log("req count",app.db_req_count);
            app.checkRequests();
        });

        $(document).on('click',['a'],function(e){
            e.preventDefault();
            var $target = $(e.target);
            $a = $target.parents().filter('a');
            var data_url = $a.data("url");
            var data_value = $a.data("value");
            var data_type = $a.data("type");
            var parent = $a;
            console.log("click event :",data_url,data_value,data_type);
            switch(data_url){
                case "summary" :
                    app.showSummary();
                    break;
                case "back" :
                    helper.goBack();
                    break;
                case "menu" :
                    app.toggleMenu();
                    break;
                case "text" :
                    app.makeNote(data_value,"answer");
                    break;
                case "audio" :
                    app.captureAudio(data_value,"answer");
                    break;
                case "media" :
                    app.captureMedia(data_value,"answer");
                case "risk" : 
                    app.showRiskBox(data_value);
                    break;
                case "close-summary" :
                    app.hideSummary();
                    break;
                case "chapter" :
                    app.changeChapter(data_value);
                    break;
                case "rating" :
                    app.updateRating(data_value,parent);
                    break;
                case "close-gallery" :
                    app.closeImageGallery();
                    break;
                case "answer" :
                    app.showAnswer(data_url,data_type,data_value);
                    break;
                case "risks" :
                    app.showAnswer(data_url,data_type,data_value);
                    break;
                case "close-riskbox" :
                    app.hideRiskBox();
                    break;
                case "addrisk" :
                    app.addRisk(data_type,data_value);
                    break;
                case "close-textbox" :
                    app.hideTextEdit();
                    break;
                case "save-note" :
                    app.saveNote(data_value,data_type);
                    break;
                case "judgement" :
                    app.openJugement();
            }
        });
    },

    checkRequests : function(){
        //console.log(app.db_req_count);
        if(app.db_req_count == 0){
            console.log("finish");
            var s = "";
            for(key in app.question_view){
                var q_block = app.question_view[key]+"</div>";
                s += q_block;
            }
            $("#chapter-wrapper").html(s);
        }
    },

    showSummary : function(){
        $(".overlay").addClass("show-summary");
    },

    hideSummary : function(){
        $(".overlay").removeClass("show-summary");
    },
    anchorClicked : function(e){
        e.preventDefault();
        console.log('anchor clicked');
    },
    toggleMenu : function(){
        if($(".sidemenu").hasClass("menushow")){
            $(".sidemenu").removeClass("menushow");
        }
        else{
            $(".sidemenu").addClass("menushow");      
        }
        
    },
    makeNote : function(qid,type){
        window.location = "text.html?idea_id="+app.idea_id+"&qid="+qid+"&type="+type;
    },
    captureAudio : function(qid,type){
        window.location = "audio.html?idea_id="+app.idea_id+"&qid="+qid+"&type="+type;
    },
    captureMedia : function(qid,type){
        window.location = "camera.html?idea_id="+app.idea_id+"&qid="+qid+"&type="+type;
    },
    changeChapter : function(ch){
        window.location = "chapter.html?idea_id="+app.idea_id+"&ch="+ch;
    },
    showRiskBox : function(qid){
        $(".overlay").addClass("show-riskbox");
        $("#risk-box div a").attr("data-value",qid);
    },
    hideRiskBox : function(){
        $(".overlay").removeClass("show-riskbox");
    },
    updateRating : function(rating,parent){
        console.log(rating);
        db_controller.update_chapter_rating(app.idea_id,app.chapter_id,rating);
        $(".rating a").removeClass("selected-rating");
        parent.addClass('selected-rating');
        helper.makeToast("update rating successfully");
    },
    getChapterRating : function(){
        console.log('called chapter raitng');
        db_controller.get_chapter_rating(app.idea_id,app.chapter_id,function(rating){
            if(rating != null){
                $('.rating a').filter(function(){
                    if($(this).data('value') == rating){
                        $(this).addClass("selected-rating");
                    }
                });
            }
        })
    },
    showAnswer : function(data_url,data_type,data_value){
        switch(data_type){
            case "text" :
                app.showTextEdit(data_url,data_type,data_value);
                break;
            case "audio" :
                
                break;
            case "image" :
                app.showImageGallery(data_url,data_type,data_value);
                break;
            case "video" :
                break;
        }
    },
    showImageGallery : function(data_url,data_type,data_value){
        $p = $("a[data-url='"+data_url+"'][data-type='"+data_type+"'][data-value='"+data_value+"']");
        var src = $p.children().children().children().attr("src");
        //console.log(src);
        $("#image-viewer img.img").attr("src",src);
        $("#image-viewer").removeClass("hidden");
    },
    closeImageGallery : function(){
        $("#image-viewer").addClass("hidden");
    },
    showTextEdit : function(data_url,data_type,data_value){
        console.log("showTextEdit : ",data_url,data_type,data_value);
        $p = $("a[data-url='"+data_url+"'][data-type='"+data_type+"'][data-value='"+data_value+"']");
        var answer = $p.children().children().html();
        $("#text-box .textarea").val(answer);
        var qid = $p.data("qid");
        //console.log("qid",qid);
        db_controller.get_question(qid,function(question){
            $("#text-box .question").html(question);
            $("#text-box #controls a").attr("data-value",data_value);
            $("#text-box #controls a").attr("data-type",data_url);
            $(".overlay").addClass("show-textbox");
        });
    },
    hideTextEdit : function(){
        $(".overlay").removeClass("show-textbox");
    },
    saveNote : function(aid,type){
        console.log("savenote",aid,type);
        var answer = $("#ans").val();
        //console.log("updated answer",answer);
        if(answer != ""){
            if(type == "answer"){
                db_controller.update_answer(aid,answer,function(a){
                    if(a){
                        console.log("update",type,aid);
                        $("a[data-url='"+type+"'][data-value='"+aid+"']").children().children().html(answer);
                        helper.makeToast("updated successfully");
                        app.hideTextEdit();
                    }
                    else{
                        helper.makeToast("unable to update, please try again");
                    }
                });
            }
            else{
                db_controller.update_risk(aid,answer,function(a){
                    if(a){
                        console.log("update",type,aid);
                        $("a[data-url='"+type+"'][data-value='"+aid+"']").children().children().html(answer);
                        helper.makeToast("updated successfully");
                        app.hideTextEdit();
                    }
                    else{
                        helper.makeToast("unable to update, please try again");
                    }
                });
            }
        }
        else{
            helper.makeToast("Please enter some text");
        }
    },
    addRisk : function(data_type,data_value){
        switch(data_type){
            case "text" :
                app.makeNote(data_value,"risk");
                break;
            case "media" :
                app.captureMedia(data_value,"risk");
                break;
            case "audio" :
                app.captureAudio(data_value,"risk");
                break;
        }
    },
    openJugement : function(){
        var url = "judgement.html?ch="+app.chapter_id+"&idea_id="+app.idea_id;
        window.location = url;
    },

    init_tour : function(){
        app.tour = new Trip([
            {
                sel : $("#menu"),
                content : 'Tap here change domain',
                position : 's',
                nextLabel : 'Okay'
            },
            {
                sel : $(".title"),
                content : 'Tap here to see the summary for the domain',
                position : 's',
                nextLabel : 'Okay'  
            },
            {
                sel : $("#note"),
                content : "Tap here to add overall judgement for the domain",
                position : 's',
                nextLabel : 'Okay'
            },
            {
                sel : $(".rating"),
                content : "Tap here to add rating for this domain",
                position : 'n',
                finishLabel : 'Okay'
            }
        ],{
            delay : -1,
            showNavigation : true
        });

        helper.update_tour_count("chapter_tour_count");

    },

    start_tour : function(){
        app.tour.start();
    },

    check_tour : function(){
        try{
            var tour_count = localStorage.getItem("chapter_tour_count");
            if( tour_count == null || tour_count < 3){
                app.init_tour();
                app.start_tour();
            }
        }catch(e){
            console.log(e);
        }
    }
};