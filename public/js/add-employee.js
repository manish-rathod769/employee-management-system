$('#form-add-employee').submit((event) => {
  event.preventDefault();
  const payload = {
    lastName: $('#lastName').val(),
    firstName: $('#firstName').val(),
    middleName: $('#middleName').val(),
    email: $('#email').val(),
    gender: $("input[type='radio'][name='gender']:checked").val(),
    DOB: $('#dob').val(),
    role: $('#role').val(),
    joiningDate: $('#joiningDate').val(),
    totalExp: $('#totalExp').val(),

    collage: $('#collage').val(),
    highestQualification: $('#highestQualification').val(),
    university: $('#university').val(),
    knownTech: $('#knownTech').val(),
    secondaryEmail: $('#secondaryEmail').val(),
    contactNo: $('#contactNo').val(),
    houseNo: $('#houseNo').val(),
    addressLine1: $('#addressLine1').val(),
    addressLine2: $('#addressLine2').val(),
    landmark: $('#landmark').val(),
    state: $('#state').val(),
    pincode: $('#pincode').val(),
    city: $('#city').val(),
    country: $('#country').val(),
    previousEmployer: $('#preEmployer').val(),
    employerAddress: $('#preEmployerAddress').val(),
    startDate: $('#startDate').val(),
    endDate: $('#endDate').val(),
  };
  console.log(payload);
  $.ajax({
    type: 'POST',
    url: '/employees',
    contentType: 'application/x-www-form-urlencoded',
    data: payload,
    success: (data) => {
      console.log(data);
      $('#addEmployeeFormContainer').addClass('d-none');
      $('#employeeDisplayContainer').removeClass('d-none');
    },
    error: (error) => {
      console.log(error);
    }
  })
});