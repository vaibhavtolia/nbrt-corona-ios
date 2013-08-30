var app = {

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
        console.log('device ready')
        app.bindEventListeners();
    },

    bindEventListeners : function(){
        $("a").click(function(e){
            console.log("data-url",$(this).data("url"));
            e.preventDefault();
            switch($(this).data("url")){
                case "back" :
                    helper.goBack();
                    break;
                case "continue" :
                    app.insertIdea();
                    break;
            }
        });
    },

    showDomains : function(){
        var url = "domain.html";
        window.location = url;
    },

    validateIdea : function(){
        if( app.validateText($('#name').val()) ){
            if( app.validateText( $("#problem").val() ) ){
                if( app.validateText( $("#segment").val() ) ){
                    if( app.validateText( $("#solution").val() ) ){
                        if( app.validateText( $("#industry").val() ) ){
                            return true;
                        }
                        else{
                            helper.makeToast('Please provide an industry where you will function');
                            return false;
                        }
                    }
                    else{
                        helper.makeToast('Please provide solution you propose');
                        return false;
                    }
                }
                else{
                    helper.makeToast('Please provide a customer segment');
                    return false;
                }
            }
            else{
                helper.makeToast('Please provide a problem you are trying to solve');
                return false;
            }
        }
        else{
            helper.makeToast('Please provide a name for your startup/idea');
            return false;
        }
    },

    validateText : function(str){
        console.log(str);
        if( $.trim(str) != '' ){
            return true;
        }
        else{
            return false;
        }
    },

    insertIdea : function(){
        console.log('called insert idea');
        if( app.validateIdea() ){
            var name = $('#name').val(), problem = $("#problem").val(), segment = $("#segment").val(), solution = $("#solution").val(), industry = $("#industry").val();
            db_controller.insertIdea(name,problem,segment,solution,industry,function(res){
                if( res ){
                    helper.makeToast('Started working on new idea '+name);
                    app.showDomains();
                }
                else{
                    helper.makeToast('There occured some error please try again');
                }
            })
        }
    }
    
    
};