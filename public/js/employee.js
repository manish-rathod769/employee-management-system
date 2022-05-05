const getTimeBetweenDates = (startDate, endDate) => {
  const sDate = new Date(startDate);
  const eDate = new Date(endDate);
  let year = eDate.getFullYear() - sDate.getFullYear();
  let month = eDate.getMonth() - sDate.getMonth();

  if (month < 0) {
    year -= 1;
    month += 11;
  }
  return `${year} years, ${month + 1} months`;
};

$('#addEmployeeBtn').click((event) => {
  event.preventDefault();
  $('#addEmployeeFormContainer').removeClass('d-none');
  $('#employeeDisplayContainer').addClass('d-none');

  // populate tech table
  $.ajax({
    type: 'GET',
    url: '/technologies',

    success: ({ data }) => {
      $('#knownTech').html('<option selected disabled>Known Technology</option>');
      data.forEach((elem) => {
        const val = elem.techName;
        // append to select group
        $('#knownTech').append(
          `<option value="${val}">${val}</option>`,
        );
      });
      // append data to #knownTech
    },

    error: (error) => {
      console.log(error);
    },
  });

  fetchStateNames($('#employee-add-state'));
});

// eslint-disable-next-line no-unused-vars
const populateCityNames = (flag) => {
  $.getJSON('../josnData/stateCity.json', (data) => {
    let cityOptions = '';

    if (flag) {
      data[$('#employee-add-state').val()].forEach((city) => {
        cityOptions += `<option value='${city}'>${city}</option>`;
      });
      $('#employee-add-city').html(cityOptions);
    } else {
      data[$('#employee-edit-state').val()].forEach((city) => {
        cityOptions += `<option value='${city}'>${city}</option>`;
      });
      $('#employee-edit-city').html(cityOptions);
    }
  });
};

const fetchStateNames = (elem) => {
  $.getJSON('../josnData/stateCity.json', (data) => {
    let stateOptions = '';
    Object.keys(data).forEach((key) => {
      stateOptions += `<option value='${key}'>${key}</option>`;
    });
    elem.append(stateOptions);
    // populateCityNames($('#state').val(), 0);
  });
};

const deleteButton = (id, name) => {
  $('#EmployeeDeleteConcentModal').find('.modal-body').html(`<p> Employee <b>${name}</b> will get deleted.are you sure? </p>`);

  $('#employeeConfirmDelete').click(() => {
    $.ajax({
      type: 'DELETE',
      url: '/employees/',
      data: {
        id,
      },

      success: () => {
        $('.toast-header').removeClass('bg-danger').addClass('bg-success').addClass('text-dark');
        $('.toast-title').text('Employee Delete');
        $('.toast-body').text('employee deleted successfully!');
        $('.toast').toast({
          delay: 5000,
        });
        $('.toast').toast('show');
        displayEmployee();
      },

      error: (error) => {
        $('.toast-header').removeClass('bg-success').addClass('bg-danger').addClass('text-dark');
        $('.toast-title').text('Employee Delete');
        $('.toast-body').text(error.responseJSON.errorMessage);
        $('.toast').toast({
          delay: 5000,
        });
        $('.toast').toast('show');
      },

    });
  });
};

const populateKnownTech = (techArray = []) => {
  $.ajax({
    type: 'GET',
    url: '/technologies',

    success: ({ data }) => {
      const form = $('#form-edit-employee');
      form.find('#knownTech').html('<option disabled>Known Technology</option>');
      data.forEach((elem) => {
        const val = elem.techName;
        // append to select group
        if (techArray.includes(val)) {
          form.find('#knownTech').append(
            `<option selected value="${val}">${val}</option>`,
          );
        } else {
          form.find('#knownTech').append(
            `<option value="${val}">${val}</option>`,
          );
        }
      });
      // append data to #knownTech
    },

    error: (error) => {
      // console.log(error);
    },
  });
};

const editButton = (id) => {
  $.ajax({
    type: 'GET',
    url: `/employees/${id}`,
    success: ({ data }) => {
      // remove employee display and show edit div
      $('#editEmployeeFormContainer').removeClass('d-none');
      $('#employeeDisplayContainer').addClass('d-none');
      const tech = data.Technologies.map(elem => elem.techName);

      // change edit div and add edit and cancel button;
      const form = $('#form-edit-employee');
      form.data('id', id);
      form.find('#lastName').val(data.lastName || null);
      form.find('#firstName').val(data.firstName || null);
      form.find('#middleName').val(data.middleName || null);
      form.find('#email').val(data.email).prop('disabled', true);
      form.find("input[type='radio'][name='gender']:checked").val(data.gender || null);
      form.find('#dob').val(data.DOB.split('T')[0]);
      form.find(`#role option[value=${data.role}]`).attr('selected', 'selected');
      form.find('#joiningDate').val(data.joiningDate.split('T')[0]);
      form.find('#careerStartDate').val(data.careerStartDate.split('T')[0] || null);
      $('.avatar-preview').find('div').css('background-image', `url(${data.avatar || '../img/logo2.png'})`);
      // console.log(data.careerStartDate);

      form.find('#collage').val(data.EmployeeAcademic.collage || '');
      form.find('#highestQualification').val(data.EmployeeAcademic.highestQualification || '');
      form.find('#university').val(data.EmployeeAcademic.university || null);
      populateKnownTech(tech);

      form.find('#secondaryEmail').val(data.EmployeeContact.secondaryEmail || null);
      form.find('#contactNo').val(data.EmployeeContact.contactNo || '');
      form.find('#houseNo').val(data.EmployeeContact.houseNo || '');
      form.find('#addressLine1').val(data.EmployeeContact.addressLine1 || null);
      form.find('#addressLine2').val(data.EmployeeContact.addressLine2 || null);
      form.find('#landmark').val(data.EmployeeContact.landmark || null);
      form.find('#state').val(data.EmployeeContact.state || null);

      $.getJSON('../josnData/stateCity.json', (states) => {
        let stateOptions = '';
        Object.keys(states).forEach((key) => {
          stateOptions += (key.toLowerCase() === data.EmployeeContact.state.toLowerCase()) ? `<option value='${key}' selected>${key}</option>` : `<option value='${key}'>${key}</option>`;
        });
        $('#employee-edit-state').append(stateOptions);
      });

      form.find('#pincode').val(data.EmployeeContact.pincode || null);
      form.find('#city').val(data.EmployeeContact.city || null);
      // temp camelcase function  remove afterwords
      const state = data.EmployeeContact.state.charAt(0).toUpperCase() + data.EmployeeContact.state.slice(1);

      $.getJSON('../josnData/stateCity.json', (cityData) => {
        let cityOptions = '';
        // console.log(state);
        cityData[state].forEach((city) => {
          cityOptions += (city.toLowerCase() === data.EmployeeContact.city.toLowerCase()) ? `<option value='${city}' selected>${city}</option>` : `<option value='${city}'>${city}</option>`;
        });
        $('#employee-edit-city').append(cityOptions);
      });
      form.find('#country').val(data.EmployeeContact.country || null);

      form.find('#preEmployer').val(data.EmployeePreWork.previousEmployer || 'NA');
      form.find('#preEmployerAddress').val(data.EmployeePreWork.employerAddress || 'NA');
      form.find('#workingTimeInYear').val(Number(data.EmployeePreWork.workingTime.split(' ')[0]) || 0);
      form.find('#workingTimeInMonth').val(Number(data.EmployeePreWork.workingTime.split(' ')[2]) || 0);
    },

    error: (error) => {
      // display toast for error
      $('.toast-header').removeClass('bg-success').addClass('bg-danger').addClass('text-dark');
      $('.toast-title').text('Employee Delete');
      $('.toast-body').text(error.responseJSON.errorMessage);
      $('.toast').toast({
        delay: 4000,
      });
      $('.toast').toast('show');
    },
  });
};

$('#previousEmployeeRecord').click((event) => {
  event.preventDefault();
  const page = $('#employeeRecordPageCount').data('page') - 1;
  $('#employeeRecordPageCount').data('page', page);
  $('#employeeRecordPageCount').text(page);
  displayEmployee();
});

$('#nextEmployeeRecord').click((event) => {
  event.preventDefault();
  const page = $('#employeeRecordPageCount').data('page') + 1;
  $('#employeeRecordPageCount').data('page', page);
  $('#employeeRecordPageCount').text(page);
  // console.log(page)
  displayEmployee();
});

const cancelBtnEmployeeDetails = (id) => {
  $('html, body').delay(200).animate({
    scrollTop: $(`#employee-card-${id}`).offset().top,
  }, 1000);
  $('#employee-details').remove();
};

const displayEmployee = () => {
  $('#displayEmployeeDetails').html('');
  const page = $('#employeeRecordPageCount').data('page');
  const limit = $('#employeeRecordLimit').val() || 9;
  const order = $('#order').val();
  let query = `page=${page}&limit=${limit}&order=${order}`;
  const search = $('#searchKeyword').val();
  if (search) {
    query = `${query}&search=${search}`;
    // console.log(query);
  }

  // console.log(order, limit);
  $.ajax({
    type: 'GET',
    url: `/employees?${query}`,
    success: (result) => {
      // console.log(result);
      $('#previousEmployeeRecord').removeClass('disabled');
      $('#nextEmployeeRecord').removeClass('disabled');
      if (!result.data.pre) {
        $('#previousEmployeeRecord').addClass('disabled');
      }
      if (!result.data.next) {
        $('#nextEmployeeRecord').addClass('disabled');
      }
      result.data.employee.forEach((element, index) => {
        // console.log(element);
        const avatar = element.avatar.split('/').length > 2 ? element.avatar : 'assets/img/profiles/img-6.jpg';
        const tech = element.Technologies.map(elem => elem.techName);
        $('#displayEmployeeDetails').append(
          `<div class="col-md-6 col-lg-6 col-xl-4" id="employee-card-${element.id}">
            <div class="card widget-profile">
              <div class="card-body">
                <div class="pro-widget-content text-center">
                  <div class="profile-info-widget">
                    <a class="booking-doc-img">
                      <img
                        src=${avatar}
                        onerror="this.src='assets/img/profiles/img-6.jpg';"
                        alt="User Image"
                      />
                    </a>
                    <div class="profile-det-info">
                      <h4>
                        <a href="" id="employeeName" onclick="enlargeEmployee(event,'${element.id}', ${index})" data-id='${element.id}' class="text-primary"
                          >${element.firstName} ${element.lastName}</a
                        >
                      </h4>
                      <div>
                        <p class="mb-0"><b>${tech}</b></p>
                        <p class="mb-0 ctm-text-sm">
                          ${element.email}
                        </p>
                        <p class="mb-0 ctm-text-sm">
                          <b>Role</b>
                          ${element.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  ${result.data.role === 'ADMIN'
    ? `<div class="team-action-icon float-right">
                        <button type="button" 
                          class="btn btn-theme ctm-border-radius text-white" 
                          title="Edit"
                          onclick="editButton('${element.id}')"
                          id="employeeEditButton" >
                          <i class="fa fa-pencil"></i>
                        </button>
                        <button type="button" 
                          class="btn btn-theme ctm-border-radius text-white" 
                          title="Delete"
                          onclick="deleteButton('${element.id}', '${element.firstName} ${element.lastName}')"
                          id="employeeDeleteButton"
                          data-toggle="modal"
                          data-target="#delete">
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>`
    : ''}
                </div>
              </div>
            </div>
          </div>`,
        );
      });
    },

    error: (err) => {
      $('#displayEmployeeDetails').html(`
                    <div class="card text-center shadow-sm grow ctm-border-radius">
                    <div class="card-body align-center">
                    <h4> No Record Found Try again !!</h4>
                    </div>
                    </div>`);
    },
  });
};
displayEmployee();

$('#search').click(() => {
  displayEmployee();
});

const enlargeEmployee = (event, id, index) => {
  event.preventDefault();
  // console.log('hello', index);
  // event.preventDefault();
  // const id = $('#employeeName').data('id');
  const lastcard = $(`#employee-card-${id}`);
  $('#employee-details').remove();
  // if(index%3 === 0){
  //   lastcard = lastcard;
  // } else if (index%3 === 2) {
  //   lastcard = lastcard.next();
  // } else if (index%3 === 1) {
  //   lastcard = lastcard.next().next();
  // }
  // console.log(id);
  $.ajax({
    type: 'GET',
    url: `/employees/${id}`,
    success: (result) => {
      // console.log(result);
      const { data } = result;
      const totalExp = getTimeBetweenDates(data.careerStartDate, new Date());
      const tech = data.Technologies.map(elem => elem.techName);
      lastcard.after(
        `<div class="col-md-12 col-lg-12 col-xl-12">
        <div class="row ctm-border-radius shadow-sm grow border-dark bg-dark" id="employee-details"> 
              <div class="col-12"> 
              <div class="team-action-icon float-right">
                <button type="button"
                  class="btn ctm-border-radius text-white"
                  title="Edit"
                  onclick="cancelBtnEmployeeDetails('${id}')"
                  id="employeeEditButton" >
                  <i class="fa fa-times"></i>
                </button>
              </div>
              </div>

              <div class="col-xl-4 col-lg-6 col-md-6 d-flex" data-employeeId=${data.id}>
                <div class="card flex-fill ctm-border-radius shadow-sm grow">
                  <div class="card-header">
                    <h4 class="card-title mb-0">Basic Information</h4>
                  </div>
                  <div class="card-body text-center">
                    <p class="card-text mb-3">
                      <span class="text-primary">First Name :</span><b> ${data.firstName}</b>
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Last Name :</span> ${data.lastName}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Middle Name : </span>${data.middleName}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Email :</span> ${data.email}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Gender :</span> ${data.gender}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">DOB :</span> ${data.DOB.split('T')[0]}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Joining Date :</span> ${data.joiningDate.split('T')[0]}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Total Exp :</span> ${totalExp}
                    </p>
                  </div>
                </div>
              </div>

              <div class="col-xl-4 col-lg-6 col-md-6 d-flex">
                <div class="card flex-fill ctm-border-radius shadow-sm grow">
                  <div class="card-header">
                    <h4 class="card-title mb-0">Contact</h4>
                  </div>
                  <div class="card-body text-center">
                    <p class="card-text mb-3">
                      <span class="text-primary">Phone Number : </span>${data.EmployeeContact.contactNo}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Secondary Email : </span>${data.EmployeeContact.secondaryEmail}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">House No : </span>${data.EmployeeContact.houseNo}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Address Line 1 : </span>${data.EmployeeContact.addressLine1}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Address Line 2 : </span>${data.EmployeeContact.addressLine2}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Landmark : </span>${data.EmployeeContact.landmark}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">City : </span>${data.EmployeeContact.city}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">State : </span>${data.EmployeeContact.state}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Pincode : </span>${data.EmployeeContact.pincode}
                    </p>
                    <p class="card-text mb-3">
                      <span class="text-primary">Coutry : </span>${data.EmployeeContact.country}
                    </p>
                  </div>
                </div>
              </div>

              <div class="col-xl-4 col-lg-12 col-md-12">
                <div class="row">
                  <div class="col-xl-12 col-lg-6 col-md-6 d-flex">
                    <div class="card ctm-border-radius shadow-sm grow flex-fill">
                      <div class="card-header">
                        <h4 class="card-title mb-0"> Academics </h4>
                      </div>
                      <div class="card-body text-center">
                        <p class="card-text mb-3">
                          <span class="text-primary">Highest Qualification : </span>${data.EmployeeAcademic.highestQualification}
                        </p>
                        <p class="card-text mb-3">
                          <span class="text-primary">Collage : </span>${data.EmployeeAcademic.collage}
                        </p>
                        <p class="card-text mb-3">
                          <span class="text-primary">University : </span>${data.EmployeeAcademic.university}
                        </p>
                        <p class="card-text mb-3">
                          <span class="text-primary">Known Tech : </span>${tech}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="col-xl-12 col-lg-6 col-md-6 d-flex">
                    <div class="card ctm-border-radius shadow-sm grow flex-fill">
                      <div class="card-header">
                        <h4 class="card-title mb-0"> previous Employer </h4>
                      </div>
                      <div class="card-body text-center">
                        <p class="card-text mb-3">
                          <span class="text-primary">Employer : </span>${data.EmployeePreWork.previousEmployer}
                        </p>
                        <p class="card-text mb-3">
                          <span class="text-primary">Address : </span>${data.EmployeePreWork.employerAddress}
                        </p>
                        <p class="card-text mb-3">
                          <span class="text-primary">Duration : </span>${data.EmployeePreWork.workingTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>`,
      );
      $('html, body').delay(300).animate({
        scrollTop: $('#employee-details').offset().top,
      }, 1000);
    },

    error: (error) => {
      $('.toast-header').removeClass('bg-success').addClass('bg-danger').addClass('text-dark');
      $('.toast-title').text('Employee Details');
      $('.toast-body').text(error.responseJSON.errorMessage);
      $('.toast').toast({
        delay: 5000,
      });
      $('.toast').toast('show');
    },
  });
};
