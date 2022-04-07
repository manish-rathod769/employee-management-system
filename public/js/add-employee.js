$('#cancelAddEmployee').click((event) => {
  event.preventDefault();
  $(':input', '#form-edit-employee').not(':button, :submit, :reset, :hidden')
    .val('');
  $('#addEmployeeFormContainer').addClass('d-none');
  $('#employeeDisplayContainer').removeClass('d-none');
});
$(document).ready(() => { 
  $('#form-add-employee').validate({
    rules: {
      firstName: {
        required: true,
        minlength: 2
      },
      middleName: {
        required: true,
        minlength: 2,
      },
      lastName: {
        required: true,
        minlength: 2,
      },
      email: {
        required: true,
        email: true,
      },
      dob: {
        required: true,
      },
      role: {
        required: true,
      },
      joiningDate: {
        required: true
      },
      totalExp: {
        required: true,
        number: true,
      },

      // academic details
      highestQualification: {
        required: true,
      },
      collage: {
        required: true,
      },
      university: {
        required: true
      },
      knownTech: {
        required: true,
      },

      // contact details
      houseNo: {
        required: true,
      },
      contactNo: {
        required: true,
        digits: true,
        maxlength: 10,
        minlength: 10,
      },
      secondaryEmail: {
        email: true,
      },
      addressLine1: {
        required: true,
      },
      landmark: {
        required: true,
      },
      city: {
        required: true,
      },
      state: {
        required: true,
      },
      country: {
        required: true,
      },
      pincode: {
        required: true,
        digits: true,
        maxlength: 6,
        minlength: 6,
      },
      workingTimeInYear: {
        min: 0,
        digits: true,
      },
      workingTimeInMonth: {
        max: 12,
        min: 1,
        digits: true,
      }
    },
    messages: {
      firstName: {
        required: "First Name is requrired",
        minlength: "at least 2 character required",
      },
      lastName: {
        required: "Last Name is requrired",
        minlength: "at least 2 character required",
      },
      middleName: {
        required: "Middle Name is requrired",
        minlength: "at least 2 character required",
      },
      email: {
        required: "email is required",
        email: "please enter valid email",
      },
      dob: {
        required: "please select dob",
      },
      role: {
        required: "please select valid role",
      },
      joiningDate: {
        required: "please enter date",
      },
      totalExp: {
        required: "plese enter total experiance",
        number: "select decimal number",
      },

      highestQualification: {
        required: "highest qualification is requrired",
      },
      collage: {
        required: "collage is requrired",
      },
      university: {
        required: "university is requrired"
      },
      knownTech: {
        required: "knownTech is requrired",
      },

      // contact details
      houseNo: {
        required: "house number/name is required",
      },
      contactNo: {
        required: "contact no is required",
        digits: "only digit is allowed",
        maxlength: "lenth should be 10",
        minlength: "lenth should be 10",
      },
      secondaryEmail: {
        email: "eneter valid email address",
      },
      addressLine1: {
        required: "address line required",
      },
      landmark: {
        required: "landmark required",
      },
      city: {
        requrired: "city is required",
      },
      state: {
        required: "state is required",
      },
      country: {
        required: "country is required",
      },
      pincode: {
        required: "pincode is required",
        digits: "only digit allowed",
        maxlength: "pin should be of 6 digit",
        minlength: "pin should be of 6 digit",
      },
      workingTimeInYear: {
        min: "please enter appropriate value",
        digits: "only digits allowed",
      },
      workingTimeInMonth: {
        max: "choose number between 1 to 12",
        min: "choose number between 1 to 12",
        digits: "only digits allowed",
      }
    },
    errorElement: "span",
    errorClass: "text-danger",
    errorPlacement: function (error, element) {
      if (element.attr("name") === "dob" || element.attr("name") === "joiningDate" || element.attr('name') === "role") {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    },
    submitHandler: function (form) {
      const addForm = $('#editEmployeeFormContainer');
      const payload = {
        lastName: addForm.find('#lastName').val(),
        firstName: addForm.find('#firstName').val(),
        middleName: addForm.find('#middleName').val(),
        email: addForm.find('#email').val(),
        gender: addForm.find("input[type='radio'][name='gender']:checked").val(),
        DOB: addForm.find('#dob').val(),
        role: addForm.find('#role').val(),
        joiningDate: addForm.find('#joiningDate').val(),
        totalExp: addForm.find('#totalExp').val(),

        collage: addForm.find('#collage').val(),
        highestQualification: addForm.find('#highestQualification').val(),
        university: addForm.find('#university').val(),
        knownTech: addForm.find('#knownTech').val(),
        secondaryEmail: addForm.find('#secondaryEmail').val(),
        contactNo: addForm.find('#contactNo').val(),
        houseNo: addForm.find('#houseNo').val(),
        addressLine1: addForm.find('#addressLine1').val(),
        addressLine2: addForm.find('#addressLine2').val(),
        landmark: addForm.find('#landmark').val(),
        state: addForm.find('#state').val(),
        pincode: addForm.find('#pincode').val(),
        city: addForm.find('#city').val(),
        country: addForm.find('#country').val(),
        previousEmployer: addForm.find('#preEmployer').val(),
        employerAddress: addForm.find('#preEmployerAddress').val(),
        workingTime: `${addForm.find('#workingTimeInYear')} years, ${addForm.find('#workingTimeInMonth')} months`,
      };
      console.log(payload);
      $.ajax({
        type: 'POST',
        url: '/employees',
        data: payload,
        success: (data) => {
          //console.log(data);
          $('#addEmployeeFormContainer').addClass('d-none');
          $('#employeeDisplayContainer').removeClass('d-none');
          location.reload();
        },
        error: (error) => {
          console.log(error.message);
        }
      });
    }
  });

  $('#form-add-employee').submit((event) => {
    event.preventDefault();
  });
});