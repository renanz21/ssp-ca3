/*!
 * Code copied from Lecturer Mikhail on github: https://github.com/mikhail-cct/ssp-practical/tree/main/views/js/table.js
 */

function dr_table(){
	$("#results").empty();
	$.getJSONuncached = function (url)
		{
		return $.ajax(
		{
			url: url,
			type: 'GET',
			cache: false,
			success: function (html)
			{
				$("#results").append(html);
				select_row();
			}
		});
	};
$.getJSONuncached("/get/html")
};

/*!
 * Code copied from Lecturer Mikhail on github: https://github.com/mikhail-cct/ssp-practical/tree/main/views/js/table.js
 */

function select_row()
{
	$("#menuTable tbody tr[id]").click(function ()
	{
		$(".selected").removeClass("selected");
		$(this).addClass("selected");
		var section = $(this).prevAll("tr").children("td[colspan='3']").length - 1;
		var entree = $(this).attr("id") - 1;
		delete_row(section, entree);
	})
};

/*!
 * Code copied from Lecturer Mikhail on github: https://github.com/mikhail-cct/ssp-practical/tree/main/views/js/table.js
 */

function delete_row(sec, ent)
{
	$("#delete").click(function ()
	{
		$.ajax(
		{
			url: "/post/delete",
			type: "POST",
			data:
			{
				section: sec,
				entree: ent
			},
			cache: false,
			success: setTimeout(dr_table, 1000)
		})
	})
};


$(document).ready(function(){
    dr_table();
})