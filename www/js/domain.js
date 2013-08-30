var app = {

    idea_id : null,
    
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
    
    
};
