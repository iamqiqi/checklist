var express = require('express');
var router = express.Router();
var checklists = {};
var ObjectID = require('mongodb').ObjectID;


/* GET home page. */
router.get('/', function(req, res, next) {
	var collection = req.db.get('listcollection');
    collection.find({},{}, function(e, checklists) {
        res.render('index', { "checklists": checklists });
    });
});


router.post('/create', function(req, res) {
	var collection = req.db.get('listcollection');
	var newchecklist = {
		"name": req.body.list_name,
		"items": []
	};
	collection.insert(newchecklist, function(e, list) {
		return res.redirect('/' + list._id);
	});
});

router.get('/:id', function(req, res) {
	var collection = req.db.get('listcollection');
	var id = req.params.id;
	collection.findById(id, {}, function(e, list){
 		console.log("FOUND:", list);
 		res.render('list', list); 
    });		
});

// add item
router.post('/:id/add', function(req, res) {
	var collection = req.db.get('listcollection');
	var id = req.params.id;
	var itemid = new ObjectID();
	var newitem = {
		"itemname": req.body.item_name,
		"checked": false,
		"itemid": itemid
	};
	
	collection.update({"_id": id}, {$push: {"items": newitem}}, function(e, list) {
		return res.redirect('/' + id);
	});
});

// update checkbox
router.post('/:id/:itemid/:check', function(req, res) {
	var collection = req.db.get('listcollection');
	var id = req.params.id;
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!???????????????id");
	console.log(id);
	var itemid = req.params.itemid;
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!???????????????itemid");
	console.log(itemid);
	var a = typeof(itemid);
	console.log("---------------a-------------------------",a);	
	
	var checkstatus = (req.params.check === "true");
	console.log(checkstatus);	

	collection.findById(id, {}, function(e, list){
		for (var i = 0; i < list.items.length; i++) {
			var itemid = req.params.itemid;
			if (list.items[i].itemid === itemid) {
				console.log(list.items[i].itemid);
				collection.update({"_id": id}, { $set: {"items.i.checked": checkstatus} }, function(e, list) {
					return res.redirect('/' + id);
				});				
			}
		} 
    });	

	// collection.update({"_id": id}, { $set: {"items.0.checked": checkstatus} }, function(e, list) {
	// 	return res.redirect('/' + id);
	// });
});

module.exports = router;