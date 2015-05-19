var express = require('express');
var router = express.Router();
var checklists = {};
var listid = 1;

/* GET home page. */
router.get('/', function(req, res, next) {
 	res.render('index', { "checklists": checklists });
});


router.post('/create', function(req, res) {
	var id = listid++;
	var newchecklist = {
		"name": req.body.list_name,
		"id": id,
		"items": {}
	};
	checklists[id] = newchecklist;
	return res.redirect('/' + id);
});

router.get('/:id', function(req, res) {
	var id = req.params.id;
	res.render('list', checklists[id]);
});

var itemid = 1;

// add item
router.post('/:id/add', function(req, res) {
	var item_id = itemid++;
	var list_id = req.params.id;
	var newitem = {
		"itemname": req.body.item_name,
		"checked": false,
		"id": item_id
	};	
	checklists[list_id]['items'][item_id] = newitem;
	return res.redirect('/' + list_id);
});

// update checkbox
router.post('/:id/:itemid/:check', function(req, res) {
	var item_id = req.params.itemid;
	var list_id = req.params.id;
	var checkstatus = (req.params.check === "true");	

	checklists[list_id]['items'][item_id].checked = checkstatus;

	return res.redirect('/' + list_id);
});



module.exports = router;