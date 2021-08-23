import { songList } from './musiclist.mjs';

const trckImg = document.querySelector('.current-media__img');
const trckName = document.querySelector('.current-media__title');
const playBtn = document.querySelector('.play-pause-btn');
const prevBtn = document.querySelector('.fa-step-backward');
const nextBtn = document.querySelector('.fa-step-forward');
const progressBar = document.querySelector('.progress-bar__progress');
const currTime = document.querySelector('.progress-bar__current-time');
const totalTime = document.querySelector('.progress-bar__total-time');

// Creation de l'element audio
const currentTrack = document.createElement('audio');

let trackIndex = 0;
let playing = false; // pour affichage picto lecture/pause
let progressTimer; // timer pour MAJ barre progression

// Chargement de la piste au chargement de la page + MAJ des infos
function loadTrack(){
  // RAZ de l'intervale pour l'update de la barre de temps
  clearInterval(progressTimer);
  
  currentTrack.src = songList[trackIndex].trackSource;
  trckImg.src = songList[trackIndex].trackImg;
  trckName.innerText = `${songList[trackIndex].trackName} 
  ${songList[trackIndex].trackArtist}`;

  
  // Update de la barre de temps
  progressTimer = setInterval(timeUpdate, 1000);
}

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
  let timePosition = 0;// RAZ de la valeur du temps de la piste en cours
  if(!isNaN(currentTrack.duration)){
     timePosition = (currentTrack.currentTime*100)/currentTrack.duration;
    progressBar.value = timePosition;
  
  // MAJ des infos duree
  currTime.innerText = toMinutes(currentTrack.currentTime);
  totalTime.innerText = toMinutes(currentTrack.duration);
  
     // MAJ de la barre de progression
     progressBar.style.backgroundSize = `${timePosition}% 100%`;
    console.log("fonction OK");
    }
}

function toMinutes(time){
 let minutes = Math.floor(time/60);
  let seconds = Math.floor(time - (minutes*60));
  
  if (minutes<10){minutes = `0${minutes}`;}
  if (seconds<10){seconds = `0${seconds}`;}
  
  return `${minutes}:${seconds}`;
}

window.addEventListener('load', loadTrack);
playBtn.addEventListener('click', playPauseTrack);
// Random function for shuffle :
// return (trckImg.src = songList[Math.floor(Math.random() * songList.length)].trackImg);
