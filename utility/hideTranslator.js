const triggerHeight = 400;
window.addEventListener("scroll", function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > triggerHeight) {
    $(".project-translator").fadeOut(500);
  } else {
    $(".project-translator").fadeIn(500);
  }
});
