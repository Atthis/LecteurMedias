import { songList } from './musiclist.mjs';

const trckImg = document.querySelector('.current-media__img');
const trckName = document.querySelector('.current-media__title');
const playBtn = document.querySelector('.play-pause-btn');
const prevBtn = document.querySelector('.fa-step-backward');
const nextBtn = document.querySelector('.fa-step-forward');
const progressBar = document.querySelector('.progress-bar__progress');

const currentTrack = document.createElement('audio');

let trackIndex = 0;
let playing = false; // pour affichage picto lecture/pause
let progressTimer; // timer pour MAJ barre progression

window.addEventListener('load', () => {
  currentTrack.src = songList[trackIndex].trackSource;
  trckImg.src = songList[trackIndex].trackImg;
  trckName.innerText = `${songList[trackIndex].trackName} 
  ${songList[trackIndex].trackArtist}`;

  clearInterval(progressTimer);

  progressTimer = setInterval(timeUpdate, 1000);
});

playBtn.addEventListener('click', playPauseTrack);

function playPauseTrack() {
  if (!playing) {
    playTrack();
  } else {
    pauseTrack();
  }
}

function playTrack() {
  currentTrack.play();
  playBtn.classList.toggle('fa-play-circle');
  playBtn.classList.toggle('fa-pause-circle');
  playing = true;
}

function pauseTrack() {
  currentTrack.pause();
  playBtn.classList.toggle('fa-play-circle');
  playBtn.classList.toggle('fa-pause-circle');
  playing = false;
}

function timeUpdate (){
    // temps en cours * 100 / temps total
    progressBar.style.backgroundSize = `${(currentTrack.currentTime*100)/currentTrack.duration}% 100%`;
}
// Random function for shuffle :
// return (trckImg.src = songList[Math.floor(Math.random() * songList.length)].trackImg);
