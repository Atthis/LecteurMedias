import { songList } from './musiclist.mjs';

const trckImg = document.querySelector('.current-media__img');
const trckName = document.querySelector('.current-media__title');
const playBtn = document.querySelector('.play-pause-btn');
const prevBtn = document.querySelector('.fa-step-backward');
const nextBtn = document.querySelector('.fa-step-forward');
const currentTrack = document.createElement('audio');

let trackIndex = 0;
let playing = false;

window.addEventListener('load', () => {
  currentTrack.src = songList[trackIndex].trackSource;
  trckImg.src = songList[trackIndex].trackImg;
  trckName.innerText = `${songList[trackIndex].trackName} 
  ${songList[trackIndex].trackArtist}`;
});

playBtn.addEventListener('click', playPauseTrack);

function playPauseTrack() {
  if (!playing) {
    // playTrack();
    currentTrack.play();
  playBtn.classList.toggle('fa-play-circle');
  playBtn.classList.toggle('fa-pause-circle');
  playing = true;
  } else {
    // pauseTrack();
    currentTrack.pause();
  playBtn.classList.toggle('fa-play-circle');
  playBtn.classList.toggle('fa-pause-circle');
  playing = false;
  }
}

function playTrack() {
  
}

function pauseTrack() {
  
}
// Random function for shuffle :
// return (trckImg.src = songList[Math.floor(Math.random() * songList.length)].trackImg);
