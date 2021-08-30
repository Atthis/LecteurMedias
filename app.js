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
const rdmBtn = document.querySelector('.fa-random');

// Creation de l'element audio
const currentTrack = document.createElement('audio');

let trackIndex = 0;
let progressTimer; // timer pour MAJ barre progression
let playing = false; // pour affichage picto lecture/pause
let repeatOn = 0; // compteur repeat
let noPlaylistRepeat = true; // variable activant la répétition de playlist ou non
let shuffle = 0; // compteur shuffle
let shuffleOn = false; // toggle shuffle
let shuffleArray = []; // tableau pour stocker les indexs de piste an shuffle

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

// Piste precedente et suivante
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

function nextTrack() {
  repeatTrack();

  // chargement de la nouvelle piste
  loadTrack(trackIndex);

  if (noPlaylistRepeat && trackIndex === 0 && repeatOn !== 2 && !shuffleOn) {
    // condition shuffle
    // Derniere piste atteinte et pas de repetition de playlist
    pauseTrack();
    currentTrack.currentTime = 0;
  } else {
    // lecture de la piste
    playTrack();
  }
}

// Repetition des pistes
function repeatTrackAction() {
  // Gestion du bouton de repeat
  if (repeatOn >= 2) {
    repeatOn = 0;
    noPlaylistRepeat = true;
    repeatBtn.style.color = '#b83f87';
    repeatTxt.innerText = '';
  } else {
    repeatOn++;

    if (repeatOn === 1) {
      noPlaylistRepeat = false;
      repeatBtn.style.color = '#fff';
      repeatTxt.innerText = ' all';
    }
    if (repeatOn === 2) {
      noPlaylistRepeat = true;
      repeatBtn.style.color = '#fff';
      repeatTxt.innerText = ' 1';
    }
  }
}

function repeatTrack() {
  // generation de l'index de piste selon le type de repetition
  switch (repeatOn) {
    case 0: // Si aucun repeat activé
      //      Si shuffle on : fonction shuffle
      if (shuffleOn) {
        shuffleTrack();
      } else {
        // Controle si arrive en fin de liste de lecture
        if (trackIndex < songList.length - 1) {
          trackIndex++;
        } else {
          trackIndex = 0;
          //         noPlaylistRepeat = true;
        }
      }
      break;
    case 1:
      //      Si shuffle on : fonction shuffle
      if (shuffleOn) {
        shuffleTrack();
      } else {
        if (trackIndex === songList.length - 1 && !shuffleOn) {
          trackIndex = 0;
          //         noPlaylistRepeat = false;
        } else {
          trackIndex++;
        }
      }
      break;
    case 2:
      //       noPlaylistRepeat = true;
      break;
    default:
      console.log('Valeur non-reconnue');
  }

  return trackIndex;
}

// Activation du shuffle
function shuffleTrackAction() {
  // Gestion du bouton de shuffle
  shuffle++;
  if (shuffle > 1) {
    shuffle = 0;
    shuffleOn = false;
    rdmBtn.style.color = '#b83f87';
  } else {
    shuffleOn = true;
    rdmBtn.style.color = '#fff';
    if (!playing) {
      // trackIndex = Math.floor(Math.random() * songList.length);
      nextTrack();
    }
  }
}

function shuffleTrack() {
  let currentTrackIndex; // Stock l'index en cours pour en pas le lire à nouveau à la suite

  // Controle si toutes les pistes ont été jouées
  if (shuffleArray.length >= songList.length && repeatOn !== 1) {
    //   si longueur tableau sup ou egale à lg playlist, arrêter le shuffle :
    shuffleOn = false;
    trackIndex = 0;
    return trackIndex;
  }
  if (shuffleArray.length >= songList.length && repeatOn === 1) {
    //     si repeat all activé, vider le tableau :
    shuffleArray = [];
    currentTrackIndex = trackIndex; 
  }

  trackIndex = Math.floor(Math.random() * songList.length);

  //   tant que trackIndex présent dans le tableau, generer un nouvel index
  while (shuffleArray.includes(trackIndex) || trackIndex === currentTrackIndex) {
    trackIndex = Math.floor(Math.random() * songList.length);
  }
  //   inserer index dans tableau
  shuffleArray.push(trackIndex);

  return trackIndex;
}


window.addEventListener('load', loadTrack);
progressBar.addEventListener('change', changeTime);

// control button events
playBtn.addEventListener('click', playPauseTrack);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);

// option button events
repeatBtn.addEventListener('click', repeatTrackAction);
rdmBtn.addEventListener('click', shuffleTrackAction);
