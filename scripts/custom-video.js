/* Get our eelements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const media = document.querySelector('video');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

const toggle = player.querySelector('.toggle');
const ranges = player.querySelectorAll('.player__slider');
const skipButtons = player.querySelectorAll('[data-skip]');
const fullScreenButton = player.querySelector('.full__screen');

const timer = document.querySelector('.timer span');

/* Build our functions */

function togglePlay() {
  // .paused is prop that lives on video. There is no playing prop
  const playMethod = video.paused ? 'play' : 'pause';
  video[playMethod]();
}

function updateButton() {
  // this is bound to video itself
  const icon = this.paused ? '►' : '▋▋';
  console.log(icon);
  toggle.textContent = icon;
}

function skip() {
  // parseFloat because a string and we want to convert to a true number
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  /* refers to volume and playbackRate properties that we need to update. Equal to this.value because that's the value that is already being piped in. */
  video[this.name] = this.value;
}

function setTime() {
  let hours = Math.floor(media.currentTime / 3600);
  console.log(hours);
  let minutes = Math.floor(media.currentTime / 60);
  let seconds = Math.floor(media.currentTime - minutes * 60);
  let hourValue;
  let minuteValue;
  let secondValue;

  if (hours < 10) {
    hourValue = `0${hours}`;
  } else {
    hourValue = hours;
  }

  if (minutes < 10) {
    minuteValue = `0${minutes}`;
  } else {
    minuteValue = minutes;
  }
  if (seconds < 10) {
    secondValue = `0${seconds}`;
  } else {
    secondValue = seconds;
  }

  let mediaTime = `${hourValue}:${minuteValue}:${secondValue}`;
  timer.textContent = mediaTime;
}

function handleProgress() {
  const percentage = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percentage}%`;
}

function scrub(e) {
  /* progress is where the width of bar is stored and offsetWidth represents the total width of the progress Bar. e.offsetX is the difference between where user clicked to move the progress bar to and the left edge of the horizontal bar. */
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  // update video
  video.currentTime = scrubTime;
}

// toggle between full-screen and normal-screen mode
function toggleFullScreen() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullScreen) {
    video.webkitRequestFullScreen();
  } else if (player.mozRequestFullScreen) {
    player.mozRequestFullScreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
}

/* Hook up the event listeners */

video.addEventListener('click', togglePlay);

// when this runs, make a function called updateButton()
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
// can also use progress event as well.
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach((button) => button.addEventListener('click', skip));

ranges.forEach((range) => range.addEventListener('input', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
/* callback first checks if mousedown is true and then if it is, it moves onto scrub(e). If mousedown is false, mousedown returns false, and nothing happens. */
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));

fullScreenButton.addEventListener('click', toggleFullScreen);
media.addEventListener('timeupdate', setTime);
