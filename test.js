$(document).ready(function () {
  $('#example').DataTable({
    dom: 'Bfrtip',
    columns: [
      { data: 'name' },
      { data: 'surname' },
      { data: 'position' },
      { data: 'office' },
      { data: 'salary' }
    ],
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

// console.log($('#example'))