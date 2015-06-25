var express = require('express');
var router = express.Router();
var checklists = {};
var ObjectID = require('mongodb').ObjectID;


// display index page with lists
router.get('/', function(req, res, next) {
	var collection = req.db.get('listcollection');
    collection.find({},{}, function(e, checklists) {
        res.render('index', { "checklists": checklists });
    });
});

// add list
router.post('/create', function(req, res) {
	var collection = req.db.get('listcollection');
	var newchecklist = {
		"name": req.body.list_name,
		"items": []
	};
	collection.insert(newchecklist, function(e, list) {
		req.io.emit('list_added', newchecklist, list._id);
		return res.redirect('/' + list._id);
	});
});

// delete list
router.post('/:id/delete', function(req, res) {
	var collection = req.db.get('listcollection');
	var id = req.params.id;
	collection.remove({"_id": id}, function(e, list) {
		req.io.emit('list_deleted', id);
		return res.redirect('/');
	});
});

// display list 
router.get('/:id', function(req, res) {
	var collection = req.db.get('listcollection');
	var id = req.params.id;
	collection.findById(id, {}, function(e, list){
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
	
	collection.update({"_id": id}, {$push: {"items": newitem}}, function(e, number_updated) {
		req.io.emit('item_added', newitem, id);
		return res.redirect('/' + id);
	});
});

// delete item
router.post('/:id/:itemid/delete', function(req, res) {
	var collection = req.db.get('listcollection');
	var id = req.params.id;
	var itemid = req.params.itemid;
	collection.findById(id, {}, function(e, list){
		for (var i = 0; i < list.items.length; i++) {			
			if (list.items[i].itemid == itemid) {
				var itemlist = list.items;
				var deleteditem = itemlist.splice(i,1);
				console.log(itemlist);
				collection.update({"_id": id}, { $set: {"items": itemlist} }, function(e, number_updated) {
					req.io.emit('item_deleted', itemid);
					return res.redirect('/' + id);
				});
				break;
			}
		}
	});
});

// update checkbox
router.post('/:id/:itemid/:check', function(req, res) {
	var collection = req.db.get('listcollection');
	var id = req.params.id;
	var itemid = req.params.itemid;
	var checkstatus = (req.params.check === "true");

	collection.findById(id, {}, function(e, list){
		for (var i = 0; i < list.items.length; i++) {
			if (list.items[i].itemid == itemid) {
				var change = {};
				change["items." + i + ".checked"] = checkstatus;
				collection.update({"_id": id}, { $set: change }, function(e, number_updated) {
					req.io.emit('item_checked', itemid, checkstatus);
					return res.redirect('/' + id);
				});
				break;
			}
		}
	});
});

module.exports = router;