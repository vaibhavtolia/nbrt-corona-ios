var app = {

    idea_id : null,
    tour : null,
    
    initialize: function() {
        app.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        console.log('device ready');

        var url_params = helper.getURLDetails();
        if( !helper.isNull( url_params.idea_id ) ){
            console.log("updating ideaid",url_params.idea_id);
            app.idea_id = url_params.idea_id;
        }
        else{
            app.idea_id = 1;
        }
        app.bindEventListeners();
        app.getAllIdeas();
        app.check_tour();
        app.get_all_ratings();
        app.get_all_judgements();
    },

    bindEventListeners : function(){
        $(document).on('click',['a'],function(e){
            e.preventDefault();
            var $target = $(e.target);
            $a = $target.parents().filter('a');
            var data_url = $a.data("url");
            var data_value = $a.data("value");
            switch(data_url){
                case "back" :
                    helper.goBack();
                    break;
                case "continue" :
                    app.showChapters();
                    break;
                case "showideas" :
                    app.toggleIdeasDropdown();
                    break;
                case "idea" :
                    app.gotoIdea(data_value);
                    break;
            }
        });
    },


    init_tour : function(){
        app.tour = new Trip([
            {
                sel : $("#ideas-con"),
                content : 'Tap here to see list of ideas',
                position : 's',
                nextLabel : 'Okay'
            },
            {
                sel : $("#right"),
                content : "Tap this to start!",
                position : 'n',
                finishLabel : 'Okay'
            }
        ],{
            delay : -1,
            showNavigation : true
        });

        helper.update_tour_count('domain_tour_count');
    },

    start_tour : function(){
        app.tour.start();
    },

    //checks from localstorage if the tour has to be initialized or not
    check_tour : function(){
        try{
            var tour_count = localStorage.getItem("domain_tour_count");
            if(tour_count == null || tour_count < 3){
                app.init_tour();
                app.start_tour();
            }
        }catch(e){
            console.log(e);
        }
    },

    showChapters : function(){
        var url = "chapter.html?idea_id="+app.idea_id;
        window.location = url;
    },

    getAllIdeas : function(){
        db_controller.getAllIdeas(function(response){
            for( var i=0; i< response.length; i++ ){
                console.log("ideas",response[i].name);
                if( response[i].id == app.idea_id ){
                    $("#ideaname").html(response[i].name);
                    app.idea_id = response[i].id;
                }
                $("#dropdown ul").prepend('<a href="#" data-url="idea" data-value="'+response[i].id+'"><li>'+response[i].name+'</li></a>');
            }
        });
    },

    toggleIdeasDropdown : function(){
        $("#dropdown").slideToggle();
    },

    gotoIdea : function(idea_id){
        console.log("idea id",idea_id);
        if( idea_id == 0 ){
            //open new idea
            window.location = "intro.html";
        }
        else{
            window.location = "domain.html?idea_id="+idea_id;
        }

    },

    get_all_ratings : function(){
        console.log("idea_id",app.idea_id);
        db_controller.get_all_ratings(app.idea_id,function(results){
            console.log(JSON.stringify(results[0]));
            app.generate_seven_domain(results);
        });
    },

    get_chapter_rating : function(chapter_id,ratings){
        var rating = 3;
        for(var i=0; i<ratings.length; i++){
            if( ratings[i].chapter_id == chapter_id ){
                rating = ratings[i].rating;
                break;
            }
        }
        return rating;
    },

    generate_seven_domain : function(ratings){
        var width = $(".wrapper").width();
        var height = $(".wrapper").height();

        var TEXT_COLOR = "#333333";
        var BORDER_COLOR = "#999999";
        var BORDER_WIDTH = 2;
        var FONT_STYLE = app.get_font_size();
        
        //$("#canvas_container").css({ 'height' : height - 50, 'width' : width - 50 });
        var canvas = document.getElementById('sevendomain');
        canvas.width = width - 50;
        canvas.height = height - 50;
        var canvas_context = canvas.getContext("2d");

        //console.log(canvas_height,canvas_width);

        //draw rectangles
        var half_height = canvas.height/2; var half_width = canvas.width/2;
        
        
        canvas_context.fillStyle = app.getDomainColor(app.get_chapter_rating(1,ratings));
        canvas_context.beginPath();
        canvas_context.fillRect(0,0,half_width,half_height);

        canvas_context.strokeStyle = BORDER_COLOR;
        canvas_context.lineWidth = BORDER_WIDTH;
        canvas_context.strokeRect(0,0,half_width,half_height);

        canvas_context.closePath();
        canvas_context.fillStyle = TEXT_COLOR;
        canvas_context.beginPath();
        canvas_context.font = FONT_STYLE;
        canvas_context.fillText("Market",10,20);
        canvas_context.fillText("Attractiveness",10,34);
        canvas_context.closePath();

        //---------------------------------------------------------------------------------------------

        canvas_context.fillStyle = app.getDomainColor(app.get_chapter_rating(3,ratings));
        canvas_context.beginPath();
        canvas_context.fillRect(half_width,0,half_width,half_height);

        canvas_context.strokeStyle = BORDER_COLOR;
        canvas_context.lineWidth = BORDER_WIDTH;
        canvas_context.strokeRect(half_width,0,half_width,half_height);

        canvas_context.closePath();
        canvas_context.fillStyle = TEXT_COLOR;
        canvas_context.beginPath();
        canvas_context.font = FONT_STYLE;
        canvas_context.fillText("Industry",canvas.width-80,20);
        canvas_context.fillText("Attractiveness",canvas.width-80,34);
        canvas_context.closePath();

        //------------------------------------------------------------------------------------------------

        canvas_context.fillStyle = app.getDomainColor(app.get_chapter_rating(2,ratings));
        canvas_context.beginPath();
        canvas_context.fillRect(0,half_height,half_width,half_height);

        canvas_context.strokeStyle = BORDER_COLOR;
        canvas_context.lineWidth = BORDER_WIDTH;
        canvas_context.strokeRect(0,half_height,half_width,half_height);

        canvas_context.closePath();
        canvas_context.fillStyle = TEXT_COLOR;
        canvas_context.beginPath();
        canvas_context.font = FONT_STYLE;
        canvas_context.fillText("Target segment benefits",10,canvas.height-24);
        canvas_context.fillText("and attractiveness",10,canvas.height-10);
        canvas_context.closePath();

        //-------------------------------------------------------------------------------------------------

        canvas_context.fillStyle = app.getDomainColor(app.get_chapter_rating(4,ratings));
        canvas_context.beginPath();
        canvas_context.fillRect(half_width,half_height,half_width,half_height);

        canvas_context.strokeStyle = BORDER_COLOR;
        canvas_context.lineWidth = BORDER_WIDTH;
        canvas_context.strokeRect(half_width,half_height,half_width,half_height);

        canvas_context.closePath();
        canvas_context.fillStyle = TEXT_COLOR;
        canvas_context.beginPath();
        canvas_context.font = FONT_STYLE;
        canvas_context.fillText("Competitive and",canvas.width-110,canvas.height-24);
        canvas_context.fillText("economic sustainability",canvas.width-110,canvas.height-10);
        canvas_context.closePath();


        //draw sectors
        canvas_context.moveTo(half_width,half_height);
        
        canvas_context.fillStyle = app.getDomainColor(app.get_chapter_rating(7,ratings));
        canvas_context.beginPath();
        canvas_context.arc(half_width,half_height,app.getCircleRadius(width,height),(1/6)*Math.PI,(5/6)*Math.PI);
        canvas_context.lineTo(half_width,half_height);
        canvas_context.closePath();
        canvas_context.stroke();
        canvas_context.fill();

        canvas_context.fillStyle = TEXT_COLOR;
        canvas_context.beginPath();
        canvas_context.font = FONT_STYLE;
        
        canvas_context.closePath();

        canvas_context.fillStyle = app.getDomainColor(app.get_chapter_rating(5,ratings));
        canvas_context.beginPath();
        canvas_context.arc(half_width,half_height,app.getCircleRadius(width,height),(5/6)*Math.PI,(3/2)*Math.PI);
        canvas_context.lineTo(half_width,half_height);
        canvas_context.closePath();
        canvas_context.stroke();
        canvas_context.fill();
        canvas_context.fillStyle = TEXT_COLOR;
        canvas_context.beginPath();
        canvas_context.font = FONT_STYLE;
        canvas_context.fillText("Mission, aspirations,",half_width-90,half_height-39);
        canvas_context.fillText("propensity for risk",half_width-90,half_height-25);
        canvas_context.fillText("Connectedness up",half_width-50,half_height+60);
        canvas_context.fillText("and down value chain",half_width-50,half_height+74);
        canvas_context.closePath();

        canvas_context.fillStyle = app.getDomainColor(app.get_chapter_rating(6,ratings));
        canvas_context.beginPath();
        canvas_context.arc(half_width,half_height,app.getCircleRadius(width,height),(3/2)*Math.PI,(13/6)*Math.PI);        
        canvas_context.lineTo(half_width,half_height);
        canvas_context.closePath();
        canvas_context.stroke();
        canvas_context.fill();
        canvas_context.fillStyle = TEXT_COLOR;
        canvas_context.beginPath();
        canvas_context.font = FONT_STYLE;
        canvas_context.fillText("Ability to",half_width+40,half_height-53);
        canvas_context.fillText("execute",half_width+40,half_height-39);
        canvas_context.fillText("on CSFs",half_width+40,half_height-25);
        canvas_context.closePath();

        canvas_context.fillStyle = "#F9F9F9";
        canvas_context.beginPath();
        canvas_context.fillRect(half_width-60,half_height-15,120,30);
        
        canvas_context.strokeStyle = BORDER_COLOR;
        canvas_context.lineWidth = BORDER_WIDTH;
        canvas_context.strokeRect(half_width-60,half_height-15,120,30);

        canvas_context.closePath();

        canvas_context.fillStyle = TEXT_COLOR;
        canvas_context.beginPath();
        canvas_context.font = "15px Arial"
        canvas_context.fillText("Team Domains",half_width-50,half_height+5);
        canvas_context.closePath();
    },

    getCircleRadius : function(width,height){
        var radius;
        if( width > height){
            radius = (height/1.4)/2;
        }
        else{
            radius = (width/1.4)/2;
        }
        return radius;
    },

    getDomainColor : function(rating){
        var VERY_ATTRACTIVE = "#5BA0A0";
        var ATTRACTIVE = "#a7cfcf"
        var VERY_UNATTRACTIVE = "#f47d5f";
        var UNATTRACTIVE = "#f4a875";
        var MIXED = "#f8f8f0";

        switch(rating){
            case 1 :
                return VERY_UNATTRACTIVE;
                break;
            case 2:
                return UNATTRACTIVE;
                break;
            case 3:
                return MIXED;
                break;
            case 4: 
                return ATTRACTIVE;
                break;
            case 5 :
                return VERY_ATTRACTIVE;
                break;
            default :
                return MIXED;
                break;
        }
    },

    get_font_size : function(){
        var user_agent = window.navigator.userAgent.toLowerCase();
        if( user_agent.indexOf("ipad") != -1 ){
            return "15px Arial";
        }
        else{
            return "10px Arial";
        }
    },

    get_all_judgements : function(){
        db_controller.getIdeawiseJudgements(app.idea_id,function(res){ 
            //console.log("no of judgements", res.length);
            if( parseInt(res.length) > 0){
                $("#judgements-container").show();
                //console.log("inside");
                for(var i=0; i<res.length; i++){
                    var chapter_id = parseInt(res[i].chapter_id) + 1;
                    var judgement = res[i].judgement;
                    //console.log(judgement);
                    var template = "<div class='answer-box'><div class='content'>"+judgement+"</div></div>";
                    $("#judgements-container div:nth-child("+chapter_id+")").show().append(template);
                }
            } 
        });
    }
    
    
};
