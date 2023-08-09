(function ($) {
  'use strict';

  var browserWindow = $(window);

  // :: 1.0 Preloader Active Code
  browserWindow.on('load', function () {
    $('#preloader').fadeOut('slow', function () {
      $(this).remove();
    });
  });

  // :: 9.0 prevent default a click
  $('a[href="#"]').click(function ($) {
    $.preventDefault()
  });

})(jQuery);