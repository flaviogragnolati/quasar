//JS to make navbar solid out of home

$(window).scroll(function () {
  $('nav').toggleClass('scrolled', $(this).scrollTop() > 700);
});

//JS to make navbar dropdown solid out of home

$(document).ready(function () {
  $(window).scroll(function () {
    $('.dropdown-menu').toggleClass('scrolled', $(window).scrollTop() > 700);
  });
});

//scrollspy
$('body').scrollspy({ target: '#mynav', offset: 60 });

//hide collapisble navbar on click

$('.navbar-collapse a:not(.dropdown-toggle)').on('click', function () {
  $('.navbar-collapse').collapse('hide');
});

//logo until scrolled down past parallax section
$(function () {
  $(window).scroll(function () {
    var x = $(window).scrollTop();

    if (x <= 700) {
      $('#isologo').hide(400);
    } else {
      $('#isologo').removeClass('hide');
      $('#isologo').show(400);
    }
  });
});
