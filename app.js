import { songList } from './musiclist.mjs';

const trckImg = document.querySelector('.current-media__img');
const trckName = document.querySelector('.current-media__title');
const progressBar = document.querySelector('.progress-bar__progress');
const currTime = document.querySelector('.progress-bar__current-time');
const totalTime = document.querySelector('.progress-bar__total-time');
const playBtn = document.querySelector('.play-pause-btn');
const prevBtn = document.querySelector('.fa-step-backward');
const nextBtn = document.querySelector('.fa-step-forward');
const repeatBtn = document.querySelector('.fa-redo');
const repeatTxt = document.querySelector('.repeat-text');

// Creation de l'element audio
const currentTrack = document.createElement('audio');

let trackIndex = 0;
let progressTimer; // timer pour MAJ barre progression
let playing = false; // pour affichage picto lecture/pause
let repeatOn = 0;

// Chargement de la piste au chargement de la page + MAJ des infos
function loadTrack() {
  // RAZ de l'intervale pour l'update de la barre de temps
  clearInterval(progressTimer);

  currentTrack.src = songList[trackIndex].trackSource;
  trckImg.src = songList[trackIndex].trackImg;
  trckName.innerText = `${songList[trackIndex].trackName} 
  ${songList[trackIndex].trackArtist}`;

  // Update de la barre de temps
  progressTimer = setInterval(timeUpdate, 1000);

  // Lancement de la piste suivante à la fin ou de la meme si repeat actif
  currentTrack.addEventListener('ended', nextTrack);
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
  playBtn.classList.remove('fa-play-circle');
  playBtn.classList.add('fa-pause-circle');
  playing = true;
}

function pauseTrack() {
  currentTrack.pause();
  playBtn.classList.add('fa-play-circle');
  playBtn.classList.remove('fa-pause-circle');
  playing = false;
}

function timeUpdate() {
  let timePosition = 0; // RAZ de la valeur du temps de la piste en cours
  if (!isNaN(currentTrack.duration)) {
    timePosition = (currentTrack.currentTime * 100) / currentTrack.duration;
    progressBar.value = timePosition;

    // MAJ des infos duree
    currTime.innerText = toMinutes(currentTrack.currentTime);
    totalTime.innerText = toMinutes(currentTrack.duration);

    // MAJ de la barre de progression
    progressBar.style.backgroundSize = `${timePosition}% 100%`;
  }
}

// convertir le temps de seconde à minutes:secondes
function toMinutes(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time - minutes * 60);

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

// fonction pour selection du temps de la piste par l'utilisateur
function changeTime() {
  // recuperation du clic de l'utilisateur
  let userTime = (currentTrack.duration * progressBar.value) / 100;

  // Definition de la durée en cours
  currentTrack.currentTime = userTime;
}

// Piste suivante et precedente
function nextTrack() {
  // variable activant la répétition de playlist ou non
  let noPlaylistRepeat = true;

  switch (repeatOn) {
    case 0: // Si aucun repeat activé
      // Controle si arrive en fin de liste de lecture
      if (trackIndex < songList.length - 1) {
        trackIndex++;
      } else {
        trackIndex = 0;
        noPlaylistRepeat = true;
      }
      break;
    case 1:
      if (trackIndex === songList.length - 1) {
        trackIndex = 0;
        noPlaylistRepeat = false;
      } else {
        trackIndex++;
      }
      break;
    case 2:
      noPlaylistRepeat = true;
      break;
    default:
      console.log('Valeur non-reconnue');
  }

  // chargement de la nouvelle piste
  loadTrack(trackIndex);

  if (noPlaylistRepeat && trackIndex === 0 && repeatOn !== 2) {
    // Derniere piste atteinte et pas de repetition de playlist
    currentTrack.pause();
    currentTrack.currentTime = 0;
  } else {
    // lecture de la piste
    playTrack();
    console.log(repeatOn);
  }
}

function prevTrack() {
  // Controle si arrive en fin de liste de lecture
  if (trackIndex > 0) {
    trackIndex--;
  } else {
    trackIndex = songList.length - 1;
  }

  // chargement de la nouvelle piste
  loadTrack(trackIndex);

  // lecture de la piste
  playTrack();
}

// Repetition des pistes
function repeatTrack() {
  if (repeatOn >= 2) {
    repeatOn = 0;
    repeatBtn.style.color = '#fff';
    repeatTxt.innerText = '';
  } else {
    repeatOn++;

    if (repeatOn === 1) {
      repeatBtn.style.color = '#95c1c4';
      repeatTxt.innerText = ' all';
    }
    if (repeatOn === 2) {
      repeatBtn.style.color = '#95c1c4';
      repeatTxt.innerText = ' 1';
    }
  }
}

window.addEventListener('load', loadTrack);
playBtn.addEventListener('click', playPauseTrack);
progressBar.addEventListener('change', changeTime);

prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);

repeatBtn.addEventListener('click', repeatTrack);

// Random function for shuffle :
// return (trckImg.src = songList[Math.floor(Math.random() * songList.length)].trackImg);
