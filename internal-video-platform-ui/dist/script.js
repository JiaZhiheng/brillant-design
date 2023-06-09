$(document).ready(function () {
  $("a#pageLink").click(function () {
    $("a#pageLink").removeClass("active");
    $(this).addClass("active");
  });

  $(".menu-button").click(function () {
    $(".left-area").removeClass("hide-on-mobile");
  });

  $(".close-menu").click(function () {
    $(".left-area").addClass("hide-on-mobile");
  });

  $(".more-button").click(function () {
    $(".more-menu-list").toggle("hide");
  });

  var owl = $("#owl-slider-1");
  $("#owl-slider-1").owlCarousel({
    navigation: true,
    slideSpeed: 400,
    paginationSpeed: 400,
    items: 1,
    itemsDesktop: false,
    itemsDesktopSmall: false,
    itemsTablet: false,
    itemsMobile: false,
    autoplay: true,
    autoPlaySpeed: 200,
    autoPlayTimeout: 100,
    autoplayHoverPause: true
  });
  // Custom Navigation Events
  $(".owl-next").click(function () {
    owl.trigger("owl.next");
  });
  $(".owl-prev").click(function () {});

  $(".play").click(function () {
    owl.trigger("owl.play", 100);
  });
  $(".stop").click(function () {
    owl.trigger("owl.stop");
  });

  var owl = $("#owl-slider-2");
  owl.owlCarousel({
    navigation: true,
    slideSpeed: 400,
    paginationSpeed: 400,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 4
      }
    }
  });

  var owl = $("#owl-slider-3");
  owl.owlCarousel({
    navigation: true,
    slideSpeed: 400,
    paginationSpeed: 400,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 4
      }
    }
  });
});