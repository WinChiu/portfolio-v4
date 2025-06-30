const triggerHeight = 400;
window.addEventListener("scroll", function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > triggerHeight) {
    $(".block__translator").fadeOut(500);
  } else {
    $(".block__translator").fadeIn(500);
  }
});
