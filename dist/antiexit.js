var ww = document.getElementsByTagName('iframe')[0].contentWindow;
window.addEventListener('click', function () {
  if (ww.gameStarted && !confirm('Do not leave the page! We will give you 300 gold!')) {
    location.replace('index.html');
  } else {
    cll300 = true;
  }
});
