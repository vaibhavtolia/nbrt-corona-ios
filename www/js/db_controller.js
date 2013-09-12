var db_name = "aaa",
	db_version = "1.0",
	db_displayname = "test db1",
	db_size = 1000000,
	db;

	db = window.openDatabase(db_name, db_version, db_displayname, db_size);

var db_controller = {

	insert_user : function(name){
		db.transaction(function(tx){
			tx.executeSql("INSERT INTO users (name,profile) VALUES ("+name+",0)");
		},errorDB);
	},

	get_user : function(name){
		return db.transaction(function(tx){
			return tx.executeSql("SELECT * from users WHERE name = "+name,[],function(tx,results){
				results.rows;
			},errorDB)
		},errorDB)
	},

	insert_question : function(chapter_id,question){
		db.transaction(function(tx){
			tx.executeSql("INSERT INTO questions (chapter_id,question) VALUES ("+chapter_id+","+question+")");
		},errorDB);
	},

	get_question : function(qid,callback){
		db.transaction(function(tx){
			tx.executeSql("SELECT question from questions WHERE id = "+qid,[],function(tx,results){
				callback(results.rows.item(0).question);
			},errorDB)
		},errorDB)
	},

	insert_answer : function(idea_id,question_id,response_type,response,callback){
		db.transaction(function(tx){
			tx.executeSql("INSERT INTO answers (idea_id,question_id,response_type,response) VALUES ("+idea_id+","+question_id+",'"+response_type+"', ?)",[response],function(tx,results){
				if(results.rowsAffected == 1){
					callback(true);
				}
				else{
					callback(false);
				}
			},errorDB);
			
		});
	},

	insert_risk : function(idea_id,question_id,response_type,response,callback){
		db.transaction(function(tx){
			tx.executeSql("INSERT INTO risks (idea_id,question_id,response_type,response) VALUES ("+idea_id+","+question_id+",'"+response_type+"', ? )",[response],function(tx,results){
				//console.log(results.rowsAffected);
				if(results.rowsAffected == 1){
					callback(true);
				}
				else{
					callback(false);
				}
			},errorDB);
		});
	},

	update_answer : function(id,response,callback){
		db.transaction(function(tx){
			tx.executeSql("UPDATE answers SET response = ? WHERE id = "+id,[response],function(tx,results){
				if(results.rowsAffected == 1){
					callback(true);
				}
				else{
					callback(false);
				}
			},errorDB);
		});
	},

	update_risk : function(id,response,callback){
		db.transaction(function(tx){
			tx.executeSql("UPDATE risks SET response = ? WHERE id = "+id,[response],function(tx,results){
				if(results.rowsAffected == 1){
					callback(true);
				}
				else{
					callback(false);
				}
			},errorDB);
		});
	},

	update_chapter_rating : function(idea_id,chapter_id,rating){
		db.transaction(function(tx){
			tx.executeSql("SELECT rating from rating whERE idea_id = "+idea_id+" AND chapter_id = "+chapter_id,[],function(tx,results){
				var count = results.rows.length;
				if(count > 0){
					tx.executeSql("UPDATE rating SET rating = "+rating+" WHERE idea_id = "+idea_id+" AND chapter_id = "+chapter_id);
				}
				else{
					tx.executeSql("INSERT INTO rating (idea_id,chapter_id,rating) VALUES ("+idea_id+","+chapter_id+","+rating+")");
				}
			},errorDB);
		});
	},

	get_chapter_rating : function(idea_id, chapter_id,callback){
		return db.transaction(function(tx){
			return tx.executeSql("SELECT rating from rating whERE idea_id = "+idea_id+" AND chapter_id = "+chapter_id,[],function(tx,results){
				//console.log("db_controller",results.rows.length);
				if(results.rows.length > 0){
					//console.log("db_controller","rating",results.rows.item(0).rating);
					callback(results.rows.item(0).rating);
				}
				else{
					callback(null);
				}
			},errorDB);
		})
	},

	get_all_ratings : function(idea_id,callback){
		db.transaction(function(tx){
			tx.executeSql("SELECT rating, chapter_id FROM rating WHERE idea_id = "+idea_id,[],function(tx,results){
				var response = [];
				for(var i =0; i<results.rows.length; i++){
					console.log("daya",JSON.stringify(results.rows.item(i)));
					response.push(results.rows.item(i));
				}
				callback(response);
			},errorDB);
		});
	},

	get_all_questions : function(chapter_id,callback){
		db.transaction(function(tx){
			tx.executeSql("SELECT id,question FROM questions WHERE chapter_id = "+chapter_id,[],function(tx,results){
				var response = [];
				for(var i=0; i<results.rows.length;i++){
					response.push(results.rows.item(i));
				}
				callback(response);
			},errorDB)
		});
	},

	get_all_answers : function(idea_id,question_id,callback){
		db.transaction(function(tx){
			tx.executeSql("SELECT id, response, response_type FROM answers WHERE idea_id = "+idea_id+" AND question_id = "+question_id,[],function(tx,results){
				var response = [];
				//console.log("db_controller","result_count",results.rows.length);
				for(var i=0; i<results.rows.length;i++){
					response.push(results.rows.item(i));
					//console.log(results.rows.item(i).id,results.rows.item(i).response,results.rows.item(i).response_type);
				}
				callback(response,question_id);
			},errorDB);
		});
	},

	get_all_risks : function(idea_id,question_id,callback){
		db.transaction(function(tx){
			//console.log("SELECT id, response, response_type FROM risks WHERE idea_id = "+idea_id+" AND question_id = "+question_id);
			tx.executeSql("SELECT id, response, response_type FROM risks WHERE idea_id = "+idea_id+" AND question_id = "+question_id,[],function(tx,results){
				var response = [];
				//console.log("db_controller","result_count_risk",results.rows.length);
				for(var i=0; i<results.rows.length;i++){
					response.push(results.rows.item(i));
				}
				callback(response,question_id);
			},errorDB);
		});
	},

	get_risks : function(){
		db.transaction(function(tx){
			tx.executeSql("SELECT * FROM risks",[],function(tx,results){
				//var response = [];
				//console.log("db_controller","result count risk",results.rows.length);
				for(var i=0; i<results.rows.length;i++){
					console.log(JSON.stringify(results.rows.item(i)));
				}
			},errorDB);
		})
	},	

	get_chapter_data : function(chapter_id,callback){
		db.transaction(function(tx){
			tx.executeSql("SELECT name, summary FROM chapters WHERE id = "+chapter_id,[],function(tx,results){
				var res = results.rows.item(0);
				callback(res);
			},errorDB);
		});
	},

	insertIdea : function(name,problem,segment,solution,industry,callback){
		var user_id = 1;
		db.transaction(function(tx){
			tx.executeSql("INSERT INTO ideas (user_id,name,problem,segment,solution,industry) VALUES (?,?,?,?,?,?)",
				[user_id,name,problem,segment,solution,industry],function(tx,results){
					if( results.rowsAffected == 1 ){
						callback(true);
					}
					else{
						callback(false);
					}
				})
		});
	},

	getIdeasCount : function(callback){
		db.transaction(function(tx){
			tx.executeSql("SELECT id from ideas",[],function(tx,results){
				callback(results.rows.length);
			});
		});
	},

	getAllIdeas : function(callback){
		db.transaction(function(tx){
			tx.executeSql("SELECT id,name,active from ideas",[],function(tx,results){
				var response = [];
				for(var i=0;i<results.rows.length;i++){
					response.push(results.rows.item(i));
				}
				callback(response);
			})
		});
	},

	insertJudgement : function(idea_id,chapter_id,judgement,callback){
		db.transaction(function(tx){
			tx.executeSql("INSERT INTO judgements (idea_id,chapter_id,judgement) VALUES (?,?,?)",
				[idea_id,chapter_id,judgement], function(tx,results){
					if( results.rowsAffected == 1 ){
						callback(true);
					}
					else{
						callback(false);
					}
				}
			);
		});
	},

	getAllJudgements : function(idea_id,chapter_id,callback){
		db.transaction(function(tx){
			tx.executeSql("SELECT id,judgement from judgements WHERE idea_id = ? AND chapter_id = ?",
				[idea_id,chapter_id],function(tx,results){
					var response = [];
					for( var i=0; i<results.rows.length; i++ ){
						response.push(results.rows.item(i));
					}
					callback(response);
				}
			);
		});
	},

	updateJudgement : function(id,judgement,callback){
		db.transaction(function(tx){
			tx.executeSql("UPDATE judgements SET judgement = ? WHERE id = ?",
				[judgement,id], function(tx, results){
					if( results.rowsAffected == 1 ){
						callback(true);
					}
					else{
						callback(false);
					}
				}
			);
		});
	}

}

function errorDB(err){
	alert("Error processing SQL: "+JSON.stringify(err));
}