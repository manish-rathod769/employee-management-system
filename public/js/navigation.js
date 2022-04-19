$('#asideProfile').click((event) => {
  event.preventDefault();
  const path = window.location.pathname.split('/')[2];
  window.location = `/employee/${path}/`;
});

$('#asideProject').click((event) => {
  event.preventDefault();
  const path = window.location.pathname.split('/')[2];
  window.location = `/employee/${path}/projects`;
});

$('#asideAttendance').click((event) => {
  event.preventDefault();
  const path = window.location.pathname.split('/')[2];
  console.log(path);
  window.location = `/employee/${path}/attendance`;
});

$('#asidePocs').click((event) => {
  event.preventDefault();
  const path = window.location.pathname.split('/')[2];
  window.location = `/employee/${path}/pocs`;
});

$('#asideLeave').click((event) => {
  event.preventDefault();
  const path = window.location.pathname.split('/')[2];
  window.location = `/employee/${path}/leave`;
});
