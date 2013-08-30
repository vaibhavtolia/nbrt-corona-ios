var app = {

    slides : 0,
    current_index : null,
    viewport_width : null,
    redirect_url : "intro.html",

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        app.updateRidrectURL();
        app.initGallery();
        initDB();
    },
    initGallery : function(){
        app.viewport_width = document.width;
        window.addEventListener('resize',this.updateViewport,false);
        var count = $(".page").length;
        if(count != undefined && count != null){
            app.slides = count;
            app.current_index = 1;
            app.disableHandle(0);
            $("#controls-wrapper a:eq(0)").click(function(e){
                e.preventDefault();
                app.showPrevSlide();
            });
            $("#controls-wrapper a:eq(1)").click(function(e){
                e.preventDefault();
                app.showNextSlide();
            });
            $("#controls-wrapper a:eq(2)").click(function(e){
                e.preventDefault();
                window.location = app.redirect_url;
            });
            $("#controls-wrapper a:eq(3)").click(function(e){
                e.preventDefault();
                app.skipIntroduction();
            })
        }
    },
    disableHandle : function(handle){
        $("#controls-wrapper a:eq("+handle+")").addClass('disabled');
    },
    enableHandle : function(handle){
        $("#controls-wrapper a:eq("+handle+")").removeClass('disabled');
    },
    updateHandle : function(){
        if(app.current_index == app.slides){
            app.disableHandle(1);
        }
        else if( app.current_index == 1 ){
            app.disableHandle(0);
        }
        else{
            app.enableHandle(0);
            app.enableHandle(1);
        }
    },
    showNextSlide : function(){
        var left = $("#page-wrapper").css("left");
        if(app.current_index < app.slides ){
            if(left == "auto"){
                var new_left = app.viewport_width*(-1)*app.current_index;
                $("#page-wrapper > div").css("left",new_left+"px");
                app.current_index = app.current_index + 1;
            }
            else{
                var new_left = app.current_index*(-1)*app.viewport_width;
                $("#page-wrapper > div").css("left",new_left+"px");
                app.current_index = app.current_index + 1;
            }
            if( app.current_index == app.slides ){
                app.showContinue();
            }
            app.updateHandle();
        }
    },
    showPrevSlide : function(){
        var left = $("#page-wrapper").css("left");
        $("#continue").hide();
        if(app.current_index <= app.slides && app.current_index > 0 ){
            app.current_index = app.current_index - 1;
            if(left == "auto"){
                var new_left = app.viewport_width*(-1)*(app.current_index -1);
                //console.log(new_left);
                $("#page-wrapper > div").css("left",new_left+"px");
            }
            else{
                var new_left = (app.current_index -1)*(-1)*app.viewport_width;
                $("#page-wrapper > div").css("left",new_left+"px");
            }
            app.updateHandle();
        }
    },
    updateViewport : function(){
        app.viewport_width = document.width;
    },
    showContinue : function(){
        //app.disableHandle(0);
        app.disableHandle(1);
        $("#continue").css("display","inline-block");
    },
    updateRidrectURL : function(){
        db_controller.getIdeasCount(function(count){
            if( count > 0 ){
                app.redirect_url = "domain.html";
            }
            else{
                app.redirect_url = "intro.html";
            }
        })
    },
    skipIntroduction : function(){
        window.location = app.redirect_url;
    }
    
};