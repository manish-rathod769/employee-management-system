/* eslint-disable no-unused-expressions */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */

const hideShowField = (fieldsToBeHide, fieldsToBeShown) => {
  fieldsToBeHide.forEach((field) => {
    $(field).css('display', 'none');
  });
  fieldsToBeShown.forEach((field) => {
    $(field).css('display', 'block');
  });
};

const populateCityNames = (state, flag) => {
  $.getJSON('../josnData/stateCity.json', (data) => {
    let cityOptions = '';
    data[state].forEach((city) => {
      cityOptions += `<option value='${city}'>${city}</option>`;
    });
    (flag) ? $('#client-edit-city').html(cityOptions) : $('#city').html(cityOptions);
  });
};

const fetchStateNames = () => {
  $.getJSON('../josnData/stateCity.json', (data) => {
    let stateOptions = '';
    Object.keys(data).forEach((key) => {
      stateOptions += `<option value='${key}'>${key}</option>`;
    });
    $('#state').html(stateOptions);
    populateCityNames($('#state').val(), 0);
  });
};

const clientDetails = (clientId) => {
  hideShowField(['#clients-add-div', '#add-client', '#pagination', '#clients-data-body'], ['#clients-view-div', '#all-client']);
  $('#action').text('View Client');
  $.ajax({
    url: `/admin/clients/${clientId}`,
    method: 'GET',
    success: (resData) => {
      $('#client-edit-form')[0].reset();
      $('#client-edit-name').val(resData.data.name);
      $.getJSON('../josnData/stateCity.json', (data) => {
        let stateOptions = '';
        Object.keys(data).forEach((key) => {
          stateOptions += (key === resData.data.state) ? `<option value='${key}' selected>${key}</option>` : `<option value='${key}'>${key}</option>`;
        });
        $('#client-edit-state').html(stateOptions);
      });
      $.getJSON('../josnData/stateCity.json', (data) => {
        let cityOptions = '';
        data[resData.data.state].forEach((city) => {
          cityOptions += (city === resData.data.city) ? `<option value='${city}' selected>${city}</option>` : `<option value='${city}'>${city}</option>`;
        });
        $('#client-edit-city').html(cityOptions);
      });
      $('#client-edit-organization').val(resData.data.organization);
      if (resData.data.isArchived) {
        $('#isArchived').attr('checked', true);
      } else {
        $('#isArchived').attr('checked', false);
      }
      $('#client-edit-submit').val(resData.data.id);
    },
    error: (resData) => {
      alert(resData.responseJSON.errorMessage);
      hideShowField(['#all-client', '#clients-add-div', '#clients-view-div'], ['#add-client', '#pagination', '#clients-data-body']);
    },
  });
};

const fetchClientData = (index) => {
  const recordCount = $('#select-record-count').val();
  const sortBy = $('#sort-by').val();
  const sortOrder = $('#sort-order').val();
  const searchWord = $('#search-by').val();

  $.ajax({
    url: `/admin/client?page=${index}&count=${recordCount}&sortBy=${sortBy}&sortOrder=${sortOrder}&searchWord=${searchWord}`,
    method: 'GET',
    error: (resData) => {
      alert(resData.responseJSON.errorMessage);
      $('#search-by').val('');
    },
    success: (resData) => {
      $('#clients-data').html('');
      if (resData.success) {
        const { totalCount } = resData.data.pop();
        $('#action').text('Clients');
        $('#all-client').css('display', 'none');

        hideShowField(['#all-client', '#clients-add-div', '#clients-view-div'], ['#add-client', '#pagination', '#clients-data-body']);

        $('#previous').attr('data-index', Number(index) - 1);
        $('#next').attr('data-index', Number(index) + 1);
        $('#current').attr('data-index', Number(index));
        const page = $('#current').attr('data-index');
        const beforeCount = (page - 1) * Number(recordCount);
        const afterCount = totalCount - Number(recordCount) - beforeCount;

        // Set pagination oprions
        $('#clients-count').text(totalCount);
        (beforeCount <= 0) ? $('#previous').addClass('disabled') : $('#previous').removeClass('disabled');
        (afterCount <= 0) ? $('#next').addClass('disabled') : $('#next').removeClass('disabled');
        $('#current').text(index);
        if (resData.data.length) {
          resData.data.forEach((client) => {
            $('#clients-data').append(`
            <div class='col-md-6 col-lg-6 col-xl-4'>
              <div class='card'>
                <div class='card-body'>
                  <div class='pro-widget-content'>
                    <div class='profile-info-widget'>
                      <div class='profile-det-info'>
                        <p>Name: <span class='text-primary'>${client.name}</span></p>
                        <p>EmailId: <span class='text-primary'>${client.email}</span></p>
                        <p>SlackId: <span class='text-primary'>${client.slackId}</span></p>
                        <p>Organization: <span class='text-primary'>${client.organization}</span></p>
                      </div>
                    </div>
                  </div>
                  <p onclick='clientDetails("${client.id}")' class='float-right text-danger cursor-pointer'>view</p>
                </div>
              </div>
            </div>
          `);
          });
        } else {
          $('#clients-data').append(`
            <div class='col-12 text-center'>
              <p><h4 class='text-danger'>Nothing to show !!!</h4></p>
            </div>
          `);
        }
      } else {
        alert(resData.errorMessage);
      }
    },
  });
};

const viewClientWithPagination = () => {
  const index = $('#current').attr('data-index');
  fetchClientData(index);
};

$('#previous').on('click', () => {
  const index = $('#previous').attr('data-index');
  fetchClientData(index);
});

$('#next').on('click', () => {
  const index = $('#next').attr('data-index');
  fetchClientData(index);
});

$('#add-client').on('click', () => {
  hideShowField(['#clients-data-body', '#pagination', '#add-client', '#clients-view-div'], ['#all-client', '#clients-add-div']);
  $('#action').text('Add Client');
});

$('#all-client').on('click', () => {
  hideShowField(['#all-client', '#clients-add-div', '#clients-view-div'], ['#clients-data-body', '#pagination', '#add-client']);
  viewClientWithPagination();
});

$('#search-by').on('input paste', () => {
  viewClientWithPagination();
});

$('#client-register-form').on('submit', (event) => {
  event.preventDefault();
});

if (('#client-register-form').length) {
  $('#client-register-form').validate({
    rules: {
      name: {
        required: true,
      },
      email: {
        required: true,
        email: true,
      },
      slackId: {
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
      organization: {
        required: true,
      },
    },
    messages: {
      name: {
        required: 'Name is required !!!',
      },
      email: {
        required: 'EmailId is required !!!',
        email: 'Please enter a valid emailId !!!',
      },
      slackId: {
        required: 'slackId is required !!!',
      },
      city: {
        required: 'City is required !!!',
      },
      state: {
        required: 'State is required !!!',
      },
      country: {
        required: 'Country is required !!!',
      },
      organization: {
        required: 'Organization is required !!!',
      },
    },
    submitHandler: () => {
      const clientData = $('#client-register-form').serializeArray();
      const clientDataObj = {};
      clientData.forEach((obj) => {
        clientDataObj[obj.name] = obj.value;
      });

      $.ajax({
        url: '/admin/clients',
        method: 'POST',
        data: clientDataObj,
        success: () => {
          alert('Client Data Added Successfully...');
          viewClientWithPagination();
        },
        error: (resData) => {
          alert(resData.responseJSON.errorMessage);
        },
      });
    },
  });
}

$('#client-edit-form').on('submit', (event) => {
  event.preventDefault();
});

if (('#client-edit-form').length) {
  $('#client-edit-form').validate({
    rules: {
      name: {
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
      organization: {
        required: true,
      },
    },
    messages: {
      name: {
        required: 'Name is required !!!',
      },
      city: {
        required: 'City is required !!!',
      },
      state: {
        required: 'State is required !!!',
      },
      country: {
        required: 'Country is required !!!',
      },
      organization: {
        required: 'Organization is required !!!',
      },
    },
    submitHandler: () => {
      const clientData = $('#client-edit-form').serializeArray();
      const clientDataObj = {};
      clientData.forEach((obj) => {
        clientDataObj[obj.name] = obj.value;
      });
      if ($('#isArchived').is(':checked')) {
        clientDataObj.isArchived = true;
      } else {
        clientDataObj.isArchived = false;
      }
      const clientId = $('#client-edit-submit').val();
      $.ajax({
        url: `/admin/clients/${clientId}`,
        method: 'PUT',
        data: clientDataObj,
        success: () => {
          alert('Client Data Updated Successfully...');
          viewClientWithPagination();
        },
        error: (resData) => {
          alert(resData.responseJSON.errorMessage);
        },
      });
    },
  });
}

hideShowField(['#all-client', '#clients-add-div', '#clients-view-div'], ['#add-client', '#pagination', '#clients-data-body']);
fetchClientData(1);
fetchStateNames();
