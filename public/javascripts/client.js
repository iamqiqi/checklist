$(document).ready(function(){
	// Bind change event to all checkboxes, even if they are created later
	$(document).on("change", "[type=checkbox]", function() {
		var is_checked = $(this).is(":checked");
		var item_id = $(this).parent().attr("data-itemid");
		var list_id = $("[data-listid]").attr("data-listid");

		$.ajax({
		  type: "POST",
		  url: "/" + list_id + "/" + item_id + "/" + is_checked
		});
	});
});


// $(document).ready(function(){
// 	console.log('ready');
// 	$('[type=checkbox]').change(function() {
// 		var is_checked = $(this).is(":checked");
// 		var item_id = $(this).attr("data-itemid");

// 		console.log(item_id);
// 		console.log(is_checked);

// 		$.ajax({
// 		  type: "POST",
// 		  url: "/{{ id }}/" + item_id + "/" + is_checked
// 		});
// 	});
// });
