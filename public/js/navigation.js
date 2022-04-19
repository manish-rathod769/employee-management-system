$('#asideProfile, #headerProfile, #asideHomeProfile').click((event) => {
  event.preventDefault();
  const path = window.location.pathname.split('/')[2];
  window.location = `/employee/${path}/`;
});

$('#asideProjects, #headerProjects').click((event) => {
  event.preventDefault();
  const path = window.location.pathname.split('/')[2];
  console.log('hello');
  window.location = `/employee/${localStorage.getItem('id')}/projects`;
});

$('#asideAttendance, #headerAttendance').click((event) => {
  event.preventDefault();
  const path = window.location.pathname.split('/')[2];
  window.location = `/employee/${localStorage.getItem('id')}/attendance`;
});

$('#asidePocs, #headerPocs').click((event) => {
  event.preventDefault();
  const path = window.location.pathname.split('/')[2];
  window.location = `/employee/${localStorage.getItem('id')}/poc`;
});

$('#asideLeave, #headerLeave').click((event) => {
  event.preventDefault();
  const path = window.location.pathname.split('/')[2];
//  window.location = `/employee/${path}/leave`; 
window.location = `/leave/add-view`;   
});

$('#change-password').click((event) => {
  event.preventDefault();
  window.location = `/employee/${localStorage.getItem('id')}/change-password`
});