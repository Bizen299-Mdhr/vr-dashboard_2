$(function () {
  $(".main-sidebar .with-sub").on("click", function (a) {
    a.preventDefault(),
      $(this).parent().toggleClass("show"),
      $(this).parent().siblings().removeClass("show");
  }),
    $(document).on("click touchstart", function (a) {
      (a.stopPropagation(),
      $(a.target).closest(".main-header-menu-icon").length) ||
        $(a.target).closest(".main-sidebar").length ||
        $("body").removeClass("main-sidebar-show");
    }),
    $(document).on("click", "#mainSidebarToggle", function (a) {
      a.preventDefault(),
        window.matchMedia("(min-width: 992px)").matches
          ? $("body").toggleClass("main-sidebar-hide")
          : $("body").toggleClass("main-sidebar-show");
    }),
    $(".side-menu").hover(
      function () {
        $("body").hasClass("main-sidebar-hide") &&
          $("body").addClass("main-sidebar-open");
      },
      function () {
        $("body").hasClass("main-sidebar-hide") &&
          $("body").removeClass("main-sidebar-open");
      }
    );

  var current = location.pathname.split("/");
  current = current[1];

  function addActiveClass(element) {
    if (current === "") {
        if (element.attr('href').indexOf("#") !== -1) {
            element.parents('.main-sidebar .nav-item').last().removeClass('active');
            if (element.parents('.main-sidebar .nav-sub').length) {
                element.closest(".main-sidebar .nav-item.active").addClass("show")
            }
        }
    } else {
        if (element.attr('href').indexOf(current) !== -1) {
            element.parents('.main-sidebar .nav-item').last().addClass('active');
            if (element.parents('.main-sidebar .nav-sub').length) {
                element.closest(".main-sidebar .nav-item.active").addClass("show")
            }
        }
    }
}

$('.main-sidebar .nav li a').each(function () {
    let $this = $(this);
    addActiveClass($this);
});
    if($('.side-menu').length > 0){
      new PerfectScrollbar(".side-menu", { suppressScrollX: !0 });
    }
});
