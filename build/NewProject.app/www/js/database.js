function databaseHandler(db_name,db_version,db_displayname,db_size){

	var db_name = db_name,
	db_version = db_version,
	db_displayname = db_displayname,
	db_size = db_size,
	db;

	this.open = function(){
		this.db = window.openDatabase(db_name, db_version, db_displayname, db_size);
	}

	this.initDB = function(){
		this.db.transaction(this.populateDB,this.errorPopulateDB,this.successPopulateDB);
	}

	this.populateDB = function(tx){
		var id;
		
		tx.executeSql('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL)');
		tx.executeSql('CREATE TABLE questions (id INTEGER PRIMARY KEY AUTOINCREMENT ,chapter_id INTEGER NOT NULL ,question TEXT NOT NULL)');
		tx.executeSql('CREATE TABLE answers (id INTEGER PRIMARY KEY AUTOINCREMENT ,idea_id INTEGER NOT NULL ,question_id INTEGER NOT NULL ,response_type TEXT NOT NULL ,response TEXT NOT NULL)');
		tx.executeSql('CREATE TABLE ideas (id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL ,name TEXT NOT NULL, problem TEXT NOT NULL, segment TEXT NOT NULL, solution TEXT NOT NULL, industry TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 0 )');
		tx.executeSql('CREATE TABLE chapters (id INTEGER PRIMARY KEY AUTOINCREMENT ,name INTEGER NOT NULL ,summary TEXT NOT NULL)');
		tx.executeSql('CREATE TABLE rating (idea_id INTEGER NOT NULL ,chapter_id INTEGER NOT NULL ,rating INTEGER NOT NULL)');
		tx.executeSql('CREATE TABLE risks (id INTEGER PRIMARY KEY AUTOINCREMENT ,idea_id INTEGER NOT NULL ,question_id INTEGER NOT NULL ,response_type TEXT NOT NULL ,response TEXT NOT NULL)');
		tx.executeSql('CREATE TABLE judgements (id INTEGER PRIMARY KEY AUTOINCREMENT, idea_id INTEGER NOT NULL, chapter_id INTEGER NOT NULL, judgement TEXT NOT NULL)');
		console.log('created tables');

		// inserting first chapter and its questions
		tx.executeSql("INSERT INTO chapters (name,summary) VALUES ('Micro-market test', 'In Chapter 2, you’ll read the stories of three product introductions that got their micro-market understanding just right: Japan’s iMode, which shrewdly figured out some of the surprising things Japanese customers wanted from their mobile phones; Miller Lite, which kicked off the long-running light beer craze in the USA way back in 1975; and Nike, today’s runaway leader in athletic footwear and apparel. Even better, you’ll learn from the mistakes of OurBeginning.com, which wasted $5 million on ill-advised Super Bowl advertising, a mistake we hope you won’t make! All topped off with six pages of “What investors want to know” and lessons learned. ')");
		
		db.transaction(function(){
			tx.executeSql("SELECT id FROM chapters WHERE name = 'Micro-market test'");
		},function(err){
			alert("Error processing SQL: "+err.code);
		},function(tx,results){
			if( results.rowsAffected !=0 ){
				var data = results.rows;
				console.log(data);
				var id = data[0].id;
				console.log(id);
				tx.executeSql("INSERT INTO questions (chapter_id,question) VALUES ("+id+",'Who, precisely,are the customers who have the pain or will be given delight?')");
				tx.executeSql("INSERT INTO questions (chapter_id,question) VALUES ("+id+",'What differentiated benefits does your offering provide ?')");
				tx.executeSql("INSERT INTO questions (chapter_id,question) VALUES ("+id+",'What evidence do you have that customers will buy?')");
				tx.executeSql("INSERT INTO questions (chapter_id,question) VALUES ("+id+",'Does your target market have the potential to grow? Evidence?')");
				tx.executeSql("INSERT INTO questions (chapter_id,question) VALUES ("+id+",'What other segments could benefit?')")
				tx.executeSql("INSERT INTO questions (chapter_id,question) VALUES ("+id+",'Can you develop capabilities that are transferable?')");
			}
		});
		
		
	}

	this.errorPopulateDB = function(err){
		alert("Error processing SQL: "+err.code);
	}

	this.successPopulateDB = function(tx,results){
		alert("affected rows "+results.rowsAffected);
	}

}