import { songList } from './musiclist.mjs';

// selection des elements du DOM
const trckImg = document.querySelector('.current-media__img');
const trckName = document.querySelector('.current-media__title');
const progressBar = document.querySelector('.progress-bar__progress');
const currTime = document.querySelector('.progress-bar__current-time');
const totalTime = document.querySelector('.progress-bar__total-time');
const playBtn = document.querySelector('.play-pause-btn');
const playBtnIcon = document.querySelector('.fa-play-circle');
const prevBtn = document.querySelector('.previous');
const nextBtn = document.querySelector('.next');
const repeatBtn = document.querySelector('.repeat');
const repeatBtnIcon = document.querySelector('.fa-redo');
const repeatTxt = document.querySelector('.repeat-text');
const rdmBtn = document.querySelector('.random');
const rdmBtnIcon = document.querySelector('.fa-random');
const playlistBtn = document.querySelector('.playlist-icon');
const playlistBtnLeft = document.querySelector('.left-bar');
const playlistBtnRight = document.querySelector('.right-bar');
const playlistBtnHide = document.querySelectorAll('.to-hide-bar');
const playlistSection = document.querySelector('.playlist-container');

// Creation de l'element audio
const currentTrack = document.createElement('audio');

// Variables des fonctions
let trackIndex = 0;
let progressTimer; // timer pour MAJ barre progression
let playing = false; // pour affichage picto lecture/pause
let repeatOn = 0; // compteur repeat
let noPlaylistRepeat = true; // variable activant la répétition de playlist ou non
let shuffle = 0; // compteur shuffle
let shuffleOn = false; // toggle shuffle
let shuffleArray = []; // tableau pour stocker les indexs de piste an shuffle

// Fonction principale - Chargement de la piste au chargement de la page + MAJ des infos
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

// Play et pause de la piste
function playPauseTrack() {
  if (!playing) {
    playTrack();
  } else {
    pauseTrack();
  }
}

function playTrack() {
  currentTrack.play();
  playBtnIcon.classList.remove('fa-play-circle');
  playBtnIcon.classList.add('fa-pause-circle');
  playing = true;
}

function pauseTrack() {
  currentTrack.pause();
  playBtnIcon.classList.add('fa-play-circle');
  playBtnIcon.classList.remove('fa-pause-circle');
  playing = false;
}

// Fonctions barre de temps
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

  // if(playing){
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
    repeatBtnIcon.style.color = '#b83f87';
    repeatTxt.innerText = '';
    repeatBtnIcon.blur();
  } else {
    repeatOn++;

    if (repeatOn === 1) {
      noPlaylistRepeat = false;
      repeatBtnIcon.style.color = '#fff';
      repeatTxt.innerText = ' all';
    }
    if (repeatOn === 2) {
      noPlaylistRepeat = true;
      repeatBtnIcon.style.color = '#fff';
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
    rdmBtnIcon.style.color = '#b83f87';
  } else {
    shuffleOn = true;
    rdmBtnIcon.style.color = '#fff';
    rdmBtnIcon.blur();
    if (!playing) {
      // trackIndex = Math.floor(Math.random() * songList.length);
      nextTrack();
    }
  }
}

function shuffleTrack() {
  let currentTrackIndex; // Stock l'index en cours pour ne pas le lire à nouveau à la suite

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
  while (
    shuffleArray.includes(trackIndex) ||
    trackIndex === currentTrackIndex
  ) {
    trackIndex = Math.floor(Math.random() * songList.length);
  }
  //   inserer index dans tableau
  shuffleArray.push(trackIndex);

  return trackIndex;
}

// Génération de la playlist
function playlistTableGen() {
  const playlistTable = document.createElement('table');
  const playlistTableBody = document.createElement('tbody');

  playlistTable.innerHTML += `<thead><tr><th colspan="3">${songList[0].trackAlbum}</th></tr></thead>`;

  for (const song of songList) {
    const newRow = `<tr class="song-row"><td class="song-nbr">${
      songList.indexOf(song) + 1
    }</td><td class="song-title">${
      song.trackName
    }</td><td class="song-artist">${song.trackArtist}</td></tr>`;

    playlistTableBody.innerHTML += newRow; // Ajout de la piste dans le body du tableau
  }

  playlistTable.appendChild(playlistTableBody); // Ajout du tbody au tableau

  playlistSection.appendChild(playlistTable); // Ajout du tableau dans la section
}

// Lancement de l'app au chargement de la page
window.addEventListener('load', () => {
  loadTrack();
  playlistTableGen();

  const songRow = document.querySelectorAll('.song-row');

  // lancement piste au clic dans la playlist
  for (const song of songRow) {
    song.addEventListener('click', () => {
      // Remonter en haut de page sur mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Suppression de la classe active pour toutes les lignes
      songRow.forEach((el) => el.classList.remove('row-active'));

      // Fermeture de la playlist au clic sur mobile
      if (
        window.matchMedia('(max-width: 710px)').matches ||
        window.matchMedia('(max-width: 920px) and (orientation: landscape)')
          .matches
      ) {
        playlistSection.classList.toggle('show-playlist');
        playlistBtnEffect();
      }

      // Ajout de la classe active pour la chanson cliquée
      song.classList.add('row-active');

      trackIndex = song.rowIndex - 1;
      loadTrack();
      playTrack();
    });
  }
});

// Actualisation de la barre de temps à chaque modif de l'input
progressBar.addEventListener('change', changeTime);

// control button events
playBtn.addEventListener('click', playPauseTrack);
prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);

// option button events
repeatBtn.addEventListener('click', repeatTrackAction);
rdmBtn.addEventListener('click', shuffleTrackAction);

// affichage playlist
playlistBtn.addEventListener('click', () => {
  playlistSection.classList.toggle('show-playlist');
  playlistBtnEffect();
  playlistScrollEffect();
});

// Effets sur le button playlist
function playlistBtnEffect() {
  playlistBtnLeft.classList.toggle('active-bar-1');
  playlistBtnRight.classList.toggle('active-bar-2');
  playlistBtnHide.forEach((item) => {
    item.classList.toggle('hide-bar');
  });
}

// Effets d'ouverture de la playlist
function playlistScrollEffect() {
  let scrollToPlaylistDelay;

  // Récupération de la position du haut de la playlist
  let scrollHeight = playlistSection.offsetTop;

  function scrollToPlaylist() {
    window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    clearTimeout(scrollToPlaylistDelay);
  }

  if (playlistSection.classList.contains('show-playlist')) {
    scrollToPlaylistDelay = setTimeout(scrollToPlaylist, 25);
  }
}
