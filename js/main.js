$(document).ready(function () {
  // Variable to hold request
  var request;

  // Bind to the submit event of our form
  $('#myform').submit(function (event) {
    // Prevent default posting of form - put here to work in case of errors
    event.preventDefault();

    // Abort any pending request
    if (request) {
      request.abort();
    }

    //functions to validate form
    function validate(input) {
      if (
        $(input).attr('type') == 'email' ||
        $(input).attr('name') == 'email'
      ) {
        if (
          $(input)
            .val()
            .trim()
            .match(
              /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
            ) == null
        ) {
          return false;
        }
      } else {
        if ($(input).val().trim() == '') {
          return false;
        }
      }
    }

    //funcs to show or hide validate alerts
    function showValidate(input) {
      var thisAlert = $(input).parent();
      $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
      var thisAlert = $(input).parent();
      $(thisAlert).removeClass('alert-validate');
    }

    //func to hide alert on input focu
    $('.validate-form .input100').each(function () {
      $(this).focus(function () {
        hideValidate(this);
      });
    });

    function formvalidation() {
      var input = $('.validate-input .input100');
      var check = [];
      for (var i = 0; i < input.length; i++) {
        if (validate(input[i]) == false) {
          showValidate(input[i]);
          check.push(false);
        } else {
          check.push(true);
        }
      }
      return check;
    }
    console.log(formvalidation());

    //returns true if a validation criteria was not met. Returns false if all validations
    //criteria were met
    var valid = formvalidation().some((x) => x === false);

    if (valid === false) {
      // setup some local variables
      var $form = $(this);

      // Let's select and cache all the fields
      var $inputs = $form.find('input, select, button, textarea');
      var $submit = $('#btn-submit').val();

      // Serialize the data in the form
      var serializedData = $form.serialize();
      serializedData += '&submit=' + $submit;

      // Let's disable the inputs for the duration of the Ajax request.
      // Note: we disable elements AFTER the form data has been serialized.
      // Disabled form elements will not be serialized.
      $inputs.prop('disabled', true);

      // Fire off the request to /form.php
      request = $.ajax({
        url: 'mail/mail.php',
        type: 'POST',
        data: serializedData,
      });

      // Callback handler that will be called on success
      request.done(function (response, textStatus, jqXHR) {
        // Log a message to the console
        console.log('Hooray, it worked!');
        $('#btn-submit').css('background-color', '#474388');
        $('.sent').html('Message Sent!');
        $('#btn-submit').focus().fadeOut(1500);
        $('#myform')[0].reset();
      });

      // Callback handler that will be called on failure
      request.fail(function (jqXHR, textStatus, errorThrown) {
        // Log the error to the console
        console.error(
          'The following error occurred: ' + textStatus,
          errorThrown
        );
      });

      // Callback handler that will be called regardless
      // if the request failed or succeeded
      request.always(function () {
        // Reenable the inputs
        $inputs.prop('disabled', false);
      });
    }
  });
});
