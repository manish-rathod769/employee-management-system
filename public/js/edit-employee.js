$('#form-edit-employee').validate({
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
    const editForm = $('#editEmployeeFormContainer');
    const payload = {
      lastName: editForm.find('#lastName').val(),
      firstName: editForm.find('#firstName').val(),
      middleName: editForm.find('#middleName').val(),
      email: editForm.find('#email').val(),
      gender: editForm.find("input[type='radio'][name='gender']:checked").val(),
      DOB: editForm.find('#dob').val(),
      role: editForm.find('#role').val(),
      joiningDate: editForm.find('#joiningDate').val(),
      totalExp: editForm.find('#totalExp').val(),

      collage: editForm.find('#collage').val(),
      highestQualification: editForm.find('#highestQualification').val(),
      university: editForm.find('#university').val(),
      knownTech: editForm.find('#knownTech').val(),
      secondaryEmail: editForm.find('#secondaryEmail').val(),
      contactNo: editForm.find('#contactNo').val(),
      houseNo: editForm.find('#houseNo').val(),
      addressLine1: editForm.find('#addressLine1').val(),
      addressLine2: editForm.find('#addressLine2').val(),
      landmark: editForm.find('#landmark').val(),
      state: editForm.find('#state').val(),
      pincode: editForm.find('#pincode').val(),
      city: editForm.find('#city').val(),
      country: editForm.find('#country').val(),
      previousEmployer: editForm.find('#preEmployer').val(),
      employerAddress: editForm.find('#preEmployerAddress').val(),
      workingTime: `${editForm.find('#workingTimeInYear').val()} years, ${editForm.find('#workingTimeInMonth').val()} months`,
    };
    console.log(payload);
    $.ajax({
      type: 'PUT',
      url: `/employees/${editForm.data('id')}`,
      data: payload,
      success: (data) => {
        //console.log(data);
        $('#editEmployeeFormContainer').addClass('d-none');
        $('#employeeDisplayContainer').removeClass('d-none');
        location.reload();
        //show successfull message in toast
      },
      error: (error) => {
        console.log(error.message);
        // show error in toast and reload window
      }
    });
  }
});

$('#form-edit-employee').submit((event) => {
  event.preventDefault();
});
