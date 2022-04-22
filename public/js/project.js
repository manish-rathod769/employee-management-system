let projectDetails = projectId => {
  hideShowField(['#projects-add-div', '#add-project', '#pagination', '#projects-data-body'], ['#projects-view-div', '#all-project']);
  $('#action').text('View project');
  $.ajax({
    url: `/projects/${projectId}`,
    method: 'GET',
    success: resData => {
      $('#edit_name').val(resData.data.name);
      $('#edit_type').val(resData.data.type);
      $('#edit_status').val(resData.data.status);
      $('#edit_probable_end_date').val(formatDate(resData.data.probable_end_date));
      //$('#client').val(resData.data.client);
      
      $('#project-edit-submit').val(resData.data.projectId);
      if (resData.data.isArchived) {
        $('#isArchived').attr('checked', true);
      } else {
        $('#isArchived').attr('checked', false);
      }
      let clients = [], pms = [], devs = [];
  
    $.ajax({
      url: `project/${projectId}/employees`,
      method: 'GET',
      success: (resData) => {
        resData.data.forEach( data => {
          if(data.Employee.role === 'PM'){
            pms.push(data.employeeId);
          }else{
            devs.push(data.employeeId);
          }
        });
        fetchDev(devs);
        fetchPM(pms);
      },
      error: (resData) => {
        console.log(resData);
      }
    });

    $.ajax({
      url: `/project/${projectId}/clients`,
      method: 'GET',
      success: (resData) => {
        resData.data.forEach( data => {
          clients.push(data.clientId);
        });
        fetchClient(clients);
      },
      error: (resData) => {
        console.log(resData);
      }
    });

      // $('#client-edit-submit').val(resData.data.id);
    },
    error: resData => {
      alert(resData.responseJSON.errorMessage);
    }
  })
}

function formatDate(dateObject) {
  let d = new Date(dateObject);
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();
  if (day < 10) {
      day = '0' + day;
  }
  if (month < 10) {
      month = '0' + month;
  }
  let date = year + '-' + month + '-' + day;
  return date;
};

let fetchprojectData = (index) => {
  const recordCount = $('#select-record-count').val();
  $.ajax({
    url: `/fetchproject?page=${index}&count=${recordCount}`,
    method: 'GET',
    error: (resData) => {
      console.log(resData);
      alert(resData.responseJSON.errorMessage);
    },
    success: (resData) => {
      $('#projects-data').html('');
      if(resData.success){  
        const paginationDetails = resData.data.pop();
        $('#action').text('projects');
        $('#all-project').css('display','none');

        hideShowField(['#all-project', '#projects-add-div', '#projects-view-div'], ['#add-project', '#pagination', '#projects-data-body']);

        $('#projects-count').text(resData.data.length + paginationDetails.before + paginationDetails.after);
        (!paginationDetails.before) ? $('#previous').addClass('disabled') : $('#previous').removeClass('disabled');
        (!paginationDetails.after) ? $('#next').addClass('disabled') : $('#next').removeClass('disabled');
        
        $('#previous').attr('data-index', Number(index)-1);
        $('#next').attr('data-index', Number(index)+1);
        $('#current').attr('data-index', Number(index));

        $('#current').text(index);
        if(resData.data.length){
          resData.data.forEach( project => {
            $('#projects-data').append(`
              <div class='col-md-6 col-lg-6 col-xl-4'>
                <div class='card'>
                  <div class='card-body'>
                    <div class='pro-widget-content'>
                      <div class='profile-info-widget'>
                        <div class='profile-det-info'>
                          <p>Name: <span class='text-primary'>${project.name}</span></p>
                          <p>Type: <span class='text-primary'>${project.type}</span></p>
                          <p>Status: <span class='text-primary'>${project.status}</span></p>
                          <p>End Date: <span class='text-primary'>${formatDate(project.probable_end_date)}</span></p>
                        </div>
                      </div>
                    </div>
                    <p onclick='projectDetails("${project.projectId}")' class='float-right text-danger cursor-pointer'>view</p>
                  </div>
                </div>
              </div>
            `);
          });
        }else{
          alert('No more data found !!!');
        }
    }else{
      alert(resData.errorMessage);
    }
    }
  });
}

let showThisMuchRecord = () => {
  const index = $('#current').attr('data-index');
  fetchprojectData(index);
}

let hideShowField = (fieldsToBeHide, fieldsToBeShown) => {
  fieldsToBeHide.forEach(field => {
    $(field).css('display', 'none');
  });
  fieldsToBeShown.forEach(field => {
    $(field).css('display', 'block');
  });
}

$('#previous').on('click', () => {
  const index = $('#previous').attr('data-index');
  fetchprojectData(index);
});

$('#next').on('click', () => {
  const index = $('#next').attr('data-index');
  fetchprojectData(index);
});

$('#add-project').on('click', () => {
  hideShowField(['#projects-data-body', '#pagination', '#add-project', '#projects-view-div'], ['#all-project', '#projects-add-div']);
  $('#action').text('Add project');
});

$('#all-project').on('click', () => {
  hideShowField(['#all-project', '#projects-add-div', '#projects-view-div'], ['#projects-data-body', '#pagination', '#add-project']);
  const index = $('#current').attr('data-index');
  fetchprojectData(index);
});

if(('#project-add-form').length){
  $('#project-add-form').validate({
    rules: {
      name: {
        required: true,
      },
      type: {
        required: true,
      },
      end_date: {
        required: true,
      }
    },
    messages: {
      name: {
        required: 'Name is required !!!',
      },
      type: {
        required: 'Type is required !!!',
      },
      end_date: {
        required: 'End date is required !!!',
      }
    }
  });
}

let viewClientWithPagination = () => {
  const index = $('#current').attr('data-index');
  fetchprojectData(index);
}

$('#project-edit-form').on('submit', (event) => {
  event.preventDefault();
  const projectData = $('#project-edit-form').serializeArray();
  const projectDataObj = {};
  projectData.forEach( obj => {
    projectDataObj[obj.name] = obj.value;
  });
  if ($('#isArchived').is(':checked')) {
    projectDataObj.isArchived = true;
  } else {
    projectDataObj.isArchived = false;
  }
  const projectId = $('#project-edit-submit').val();
  let clients = Array.from(document.getElementById("client").options).filter(option => option.selected).map(option => option.value);
  let pms = Array.from(document.getElementById("pm").options).filter(option => option.selected).map(option => option.value);
  let devs = Array.from(document.getElementById("dev").options).filter(option => option.selected).map(option => option.value);
  projectDataObj.client = clients;
  projectDataObj.pm = pms;
  projectDataObj.dev = devs;
  console.log(projectDataObj);
  $.ajax({
    url: `/projects/${projectId}`,
    method: 'PUT',
    data: projectDataObj,
    success: () => {
      alert('Project data updated successfully...');
      const index = $('#current').attr('data-index');
      fetchprojectData(index);
    },
    error: (resData) => {
      console.log(resData);
      alert(resData.responseJSON.errorMessage);
    }
  });
});

if(('#project-edit-form').length){
  $('#project-edit-form').validate({
      rules: {
          name: {
            required: true,
          },
          type: {
            required: true,
          },
          end_date: {
            required: true,
          }
      },
      messages: {
          name: {
            required: 'Name is required !!!',
          },
          type: {
            required: 'Type is required !!!',
          },
          end_date: {
            required: 'End date is required !!!',
          }
      }
  });
}

$('#project-add-form').on('submit', (event) => {
  event.preventDefault();
  const projectData = $('#project-add-form').serializeArray();
  const projectDataObj = {};
  projectData.forEach( obj => {
    projectDataObj[obj.name] = obj.value;
  });
  
  $.ajax({
    url:'/project',
    method: 'POST',
    data: projectDataObj,
    success: (res) => {
      alert('Project Data Added Successfully...');
      const index = $('#current').attr('data-index');
      fetchprojectData(index);
    },
    error: (resData) => {
      console.log(resData);
      // alert(resData.errorJSON.errorMessage);
    }
  });
}); 
let fetchClient = (clients) => {
  $.ajax({
    url: '/getClients',
    method: 'GET',
    success: (resData) => {
      resData.data.pop();
      let clientOption = '';
      resData.data.forEach(client => {
        clientOption += (clients.includes(client.id)) ? `<option value=${client.id} selected>${client.email}</option>` : `<option value=${client.id}>${client.email}</option>`;
        // clientOption += `<option value=${client.id}>${client.email}</option>`;
      });
      $('#client').html(clientOption);
    },
    error: (errData) => {
      console.log(errData);
    }
  });
}

let fetchPM = (pms) => {
  $.ajax({
    url: '/employees/?role=PM',
    method: 'GET',
    success: (resData) => {
      // console.log(resData);
      //resData.data.employee.pop();
      let pmOption = '';
      resData.data.employee.forEach(employee => {
        pmOption += (pms.includes(employee.id)) ? `<option value=${employee.id} selected>${employee.email}</option>` : `<option value=${employee.id}>${employee.email}</option>`;
        // pmOption += `<option value=${employee.id}>${employee.email}</option>`;
      });
      $('#pm').html(pmOption);
    },
    error: (errData) => {
      console.log(errData);
    }
  });
}

let fetchDev = (devs) => {
  $.ajax({
    url: '/employees/?role=DEV',
    method: 'GET',
    success: (resData) => {
      let devOption = '';
      resData.data.employee.forEach(employee => {
        devOption += (devs.includes(employee.id)) ? `<option value=${employee.id} selected>${employee.email}</option>` : `<option value=${employee.id}>${employee.email}</option>`;
        // devOption += `<option value=${employee.id}>${employee.email}</option>`;
      });
      $('#dev').html(devOption);
    },
    error: (errData) => {
      console.log(errData);
    }
  });
}

hideShowField(['#all-project', '#projects-add-div', '#projects-view-div'], ['#add-project', '#pagination', '#projects-data-body']);
fetchprojectData(1);
// fetchClient();
// fetchPM();
// fetchDev();
