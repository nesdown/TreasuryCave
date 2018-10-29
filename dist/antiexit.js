var ww = document.getElementsByTagName('iframe')[0].contentWindow;

function restrict() {
  if (ww.cll300 = true && ww.gameStarted && !confirm('Do not leave the page! We will give you 150 gold!')) {
    location.replace('index.html');
  } else {
    ww.cll300 = true;
  }
}

window.addEventListener('click', restrict);
window.onbeforeunload = function() {
  window.removeEventListener('click', restrict);
  restrict();
  window.onbeforeunload = null;
  return 'Don\'t leave';
};
