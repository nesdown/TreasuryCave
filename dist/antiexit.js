var ww = document.getElementsByTagName('iframe')[0].contentWindow;

function restrict() {
  if (ww.gameStarted && !confirm('Do not leave the page! We will give you 300 gold!')) {
    location.replace('index.html');
  } else {
    cll300 = true;
  }
}

window.addEventListener('click', restrict);
window.addEventListener('beforeunload', function() {
  restrict();
  return 'Don\'t leave';
});
