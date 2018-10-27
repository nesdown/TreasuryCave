var ww = document.getElementsByTagName('iframe')[0].contentWindow;
window.addEventListener('click', function () {
  if (ww.gameStarted && !confirm(lang.waitPlz)) {
    location.replace('index.html');
  } else {
    cll300 = true;
  }
});
