window.addEventListener('click', function () {
  if (window.gameStarted && !confirm(lang.waitPlz)) {
    location.replace('index.html');
  } else {
    cll300 = true;
  }
});
