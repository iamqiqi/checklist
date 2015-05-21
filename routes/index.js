var express = require('express');
var router = express.Router();
var checklists = {};
//var listid = 1;


/* GET home page. */
router.get('/', function(req, res, next) {
	var collection = req.db.get('listcollection');
    collection.find({},{}, function(e, checklists) {
        res.render('index', { "checklists": checklists });
    });
});


router.post('/create', function(req, res) {
	var collection = req.db.get('listcollection');
	//var id = listid++;
	var newchecklist = {
		"name": req.body.list_name,
		//"id": id,
		"items2": []
	};
	//checklists[id] = newchecklist;
	collection.insert(newchecklist, function(e, list) {
		//console.log("new list", l);
		// console.log(l._id);
		return res.redirect('/' + list._id);
	});
});

router.get('/:id', function(req, res) {
	var collection = req.db.get('listcollection');
	var id = req.params.id;
	//res.render('list', checklists[id]);  ////////////////////
	collection.findById(id, {}, function(e, list){
 		//console.log("found:", list);
 		res.render('list', list); 
    });		
});

//var itemid = 1;

// add item
router.post('/:id/add', function(req, res) {
	var collection = req.db.get('listcollection');
	//var item_id = itemid++;
	var list_id = req.params.id;
	var newitem = {
		"itemname": req.body.item_name,
		"checked": false,
		"id": item_id
	};	
	//checklists[list_id]['items'][item_id] = newitem;
	collection.update({"id": list_id}, {$push: {"items2": newitem}}, function(e, list) {
		//console.log(e);
		//console.log(list);
		return res.redirect('/' + list._id);
	});
});

// update checkbox
router.post('/:id/:itemid/:check', function(req, res) {
	var collection = req.db.get('listcollection');
	var item_id = req.params.itemid;
	var list_id = req.params.id;
	var checkstatus = (req.params.check === "true");	

	checklists[list_id]['items'][item_id].checked = checkstatus;

	return res.redirect('/' + list_id);
});



module.exports = router;