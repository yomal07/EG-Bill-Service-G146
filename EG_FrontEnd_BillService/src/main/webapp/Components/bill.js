$(document).ready(function() {
	if ($("#alertSuccess").text().trim() == "") {
		$("#alertSuccess").hide();
	}
	$("#alertError").hide();
});

// SAVE ============================================
$(document).on("click", "#btnSave", function(event) {
	// Clear alerts---------------------
	$("#alertSuccess").text("");
	$("#alertSuccess").hide();
	$("#alertError").text("");
	$("#alertError").hide();
	// Form validation-------------------
	var status = validateBillForm();
	if (status != true) {
		$("#alertError").text(status);
		$("#alertError").show();
		return;
	}
	// If valid------------------------
	var type = ($("#hidBillIDSave").val() == "") ? "POST" : "PUT";
	$.ajax(
		{
			url: "BillAPI",
			type: type,
			data: $("#formBill").serialize(),
			dataType: "text",
			complete: function(response, status) {
				onBillSaveComplete(response.responseText, status);
			}
		});
});

//Upate==========================================
$(document).on("click", ".btnUpdate", function(event) {
	$("#hidBillIDSave").val($(this).data("billid"));
	$("#billCode").val($(this).closest("tr").find('td:eq(0)').text());
	$("#accountNo").val($(this).closest("tr").find('td:eq(1)').text());
	$("#billMonth").val($(this).closest("tr").find('td:eq(2)').text());
	$("#units").val($(this).closest("tr").find('td:eq(3)').text());
	$("#meterReader_name").val($(this).closest("tr").find('td:eq(5)').text());
});

//Client- model
function validateBillForm() {
	//BILL CODE
	if ($("#billCode").val().trim() == "") {
		return "Insert Bill Code";
	}

	//Account Number
	if ($("#accountNo").val().trim() == "") {
		return "Insert Account Number.";
	}

	//Bill month
	if ($("#billMonth").val().trim() == "") {
		return "Insert bill month";
	}

	//Number of units
	if ($("#units").val().trim() == "") {
		return "Enter number of units";
	}

	//is numeric
	var tmpUnits = $("#units").val().trim();
	if (!$.isNumeric(tmpUnits)) {
		return "Insert a numerical value for Units field.";
	}

	//Meter reader name
	if ($("#meterReader_name").val().trim() == "") {
		return "Insert meter reader name";
	}
	return true;
}

function onBillSaveComplete(response, status) {
	if (status == "success") {
		var resultSet = JSON.parse(response);
		if (resultSet.status.trim() == "success") {
			$("#alertSuccess").text("Successfully saved.");
			$("#alertSuccess").show();
			$("#divBillsGrid").html(resultSet.data);
		} else if (resultSet.status.trim() == "error") {
			$("#alertError").text(resultSet.data);
			$("#alertError").show();
		}
	} else if (status == "error") {
		$("#alertError").text("Error while saving.");
		$("#alertError").show();
	} else {
		$("#alertError").text("Unknown error while saving..");
		$("#alertError").show();
	}
	$("#hidBillIDSave").val("");
	$("#formBill")[0].reset();
}



$(document).on("click", ".btnRemove", function(event) {
	$.ajax(
		{
			url: "BillAPI",
			type: "DELETE",
			data: "billID=" + $(this).data("billid"),
			dataType: "text",
			complete: function(response, status) {
				onBillDeleteComplete(response.responseText, status);
			}
		});
});

function onBillDeleteComplete(response, status) {
	if (status == "success") {
		var resultSet = JSON.parse(response);
		if (resultSet.status.trim() == "success") {
			$("#alertSuccess").text("Successfully deleted.");
			$("#alertSuccess").show();
			$("#divBillsGrid").html(resultSet.data);
		} else if (resultSet.status.trim() == "error") {
			$("#alertError").text(resultSet.data);
			$("#alertError").show();
		}
	} else if (status == "error") {
		$("#alertError").text("Error while deleting.");
		$("#alertError").show();
	} else {
		$("#alertError").text("Unknown error while deleting..");
		$("#alertError").show();
	}
}
