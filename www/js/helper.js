var helper = {

	getURLDetails : function(){
        var url = window.location.href;
        var up = url.split("?")
        var data;
        if(up.length > 1){
        	data = up[1].split('&');
        }
        var url_params = {};
        if( data != undefined ){
	        for( var i=0; i< data.length; i++ ){
	            var obj = data[i].split("=");
	            //console.log("HEPLER",obj[0],obj[1]);
	            url_params[obj[0]] = obj[1];
	        }
	    }
        return url_params;
    },

    goBack : function(){
    	window.history.back();
    },

    makeToast : function(msg){
        $("#toast-con").html(msg);
        $("#toast").show();
        setTimeout(function(){
            $("#toast").fadeOut(200);
        },2000)
    },

    getChapterDetails : function(qid,callback){
        var q = db_controller.get_question(qid,function(question){
            console.log(question);
            callback(question);
        });
    },

    isNull : function(str){
        if( str != undefined || str != null ){
            return false;
        }
        else{ 
            return true;
        }
    },

    update_tour_count : function(localstorage_key){
        try{
            var count = parseInt(localStorage.getItem(localstorage_key));
            console.log(localstorage_key,count);
            if( count == null ){
                count = 1;
            }
            else{
                count += 1;
            }
            console.log("updated count",count);
            localStorage.setItem(localstorage_key,count); 
        }catch(e){
            console.log(e);
        }
    }
}