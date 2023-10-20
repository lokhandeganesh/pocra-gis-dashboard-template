// Call the dataTables jQuery plugin
$(document).ready(function () {
  $('#dataTable').DataTable({
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'copyHtml5',
        exportOptions: { orthogonal: 'export' }
      },
      {
        extend: 'excelHtml5',
        exportOptions: { orthogonal: 'export' }
      },
      {
        extend: 'pdfHtml5',
        exportOptions: { orthogonal: 'export' }
      }
    ]
  });
});
