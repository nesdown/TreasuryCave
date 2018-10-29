var ww = document.getElementsByTagName('iframe')[0].contentWindow;
var confirMsg = 'Do not leave the page! We will give you 150 gold!';

function restrict() {
  if (!ww.cll300 && ww.gameStarted) {
    if (!confirm(confirMsg)) {
      location.replace('index.html');
    } else {
      ww.cll300 = true;
      window.onbeforeunload = null;
    }
  }
}

window.addEventListener('click', restrict);
window.onbeforeunload = function() {
  window.removeEventListener('click', restrict);
  ww.cll300 = true;
  window.onbeforeunload = null;
  return confirMsg;
};
