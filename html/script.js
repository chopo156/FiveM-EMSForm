$(function() {
	window.addEventListener('message', function(event) {
		if (event.data.type == 'enableGUI') {
			open_menu();
		}
		if (event.data.type == 'close') {
			close_menu();
		}
		if (event.data.type == 'new') {
			new_form();
		}
		if (event.data.type === 'result') {
			result(event.data); //show Patient info
		}
		if (event.data.type == 'response') {
			response(event.data.message);
		}
	});

	function open_menu() {
		$('.medical_form').css("display", "block");
	}

	function form() {
		$('.new-form').css("display", "none");	
		$('.error').css("display", "none");
		$('.patient-info').css("display", "block");
	}

	function new_form(){
		$('.patient-info').css("display", "none");
		$('.error').css("display", "none");
		$(".new-form").css("display", "block");		
		$('.new-form input').removeAttr("disabled").val('');
		$('#pt-allergies').removeAttr('display').val('');
		$('#reason').removeAttr("display").val('');
	}

	function result(data) {
		form();
		$('#pt-first').text(data.firstName);
		$('#pt-last').text(data.lastName);
		$('#pt-dob').text(data.dob);
		$('#allergies-info').text(data.allergies);
		$('#history').text(data.injuries);
	}

	function response(message) {
		$('.patient-info').css("display", "none");
		$('.new-form').css("display", "none");	
		$('.error').css("display", "block").html(`<h3> ${message} </h3>`);
	}

	function close_menu() {
		$(".medical_form").css("display", "none");
		$(".new-form").css("display", "none");		
		$('.patient-info').css("display", "none");
		window.location.reload(false);
	}

	function validate(first, last) {
		if (!(first) || !(last)) {
			$('.error').css("display", "block").html('<h3> First and last name required </h3>');
			return false;
		} else {
			return true;
		}
	}

	$('#close-button').click(function() {
		$.post('http://medical_id/close', JSON.stringify({}))
	});

	$('#search_button').click(function(){
		var firstName = $('#search_first').val();
		var lastName = $('#search_last').val();
		if (validate(firstName, lastName)) {	
			$.post('http://medical_id/search', JSON.stringify({
				firstName: firstName.toUpperCase(),
				lastName: lastName.toUpperCase()
			}))
		}
	});

	$('#new').click(function() {
		$('#search_text').val('');
		$.post('http://medical_id/new', JSON.stringify({}))
	});

	//SAVE NEW FORM
	$('#save').click(function() {
		var firstName = $('#first_name').val().toUpperCase();
		var lastName = $('#last_name').val().toUpperCase();
		if (validate(firstName, lastName)) {
			$.post('http://medical_id/save', JSON.stringify({
				form: "newForm",
				firstName: firstName,
				lastName: lastName,
				dob: $('#dob-pt').val(),
				allergies: $('#pt-allergies').val(),
				injuries: $('#reason').val(),
			}))
			$('.new-form input').attr("disabled", 'disabled');
			$('#pt-allergies').attr("disabled", 'disabled');
			$('#reason').attr("disabled", 'disabled');
		}
	});

	//UPDATE FORM
	$('#update').parent().on('click', '#update', function(){
		$('#allergies-info').removeAttr("disabled");
		$('#assessment').css("display", "flex");
		$('#update').text('Save');
		$('#update').attr('id', 'saving');
	});

	$('#update').parent().on('click', '#saving', function() {
        if (!$('#assess').val()) {
            $('#allergies-info').attr("disabled", 'disabled');
            $('#assessment').css("display", "none");
            $('#saving').text('Update').attr('id', 'update');
            return false;
        }
		$.post('http://medical_id/save', JSON.stringify({
			form: "updateForm",
			firstName: $('#pt-first').text(),
			lastName: $('#pt-last').text(),
			allergies: $('#allergies-info').val(),
			injuries: $('#assess').val() + "\n"
		}))
        //console.log("Injuries: " + $('#assess' + "\n").val()
		$('#allergies-info').attr("disabled", 'disabled');
		$('#assessment').css("display", "none");
		$('#saving').text('Update').attr('id', 'update');
	});

	//DELETE FORM
	$('#delete').click(function()  {
		$.post('http://medical_id/delete', JSON.stringify({
			firstName: $('#pt-first').text(),
			lastName: $('#pt-last').text()  
		}))
	});
});
