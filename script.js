const cards = document.querySelectorAll(".memory-card");
const loveNoteSection = document.querySelector(".love-note-section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("memory-card")) {
          const index = Array.from(cards).indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 90}ms`;
        }
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
);

cards.forEach((card) => observer.observe(card));
if (loveNoteSection) observer.observe(loveNoteSection);

const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const loveNoteBox = document.querySelector(".love-note-box");
let pendingAutoplay = false;

const syncPlayButton = () => {
  playPauseBtn.textContent = audioPlayer.paused ? "🎵 Play" : "🎵 Pause";
};

const tryAutoplay = () => {
  audioPlayer
    .play()
    .then(() => {
      pendingAutoplay = false;
      syncPlayButton();
    })
    .catch(() => {
      pendingAutoplay = true;
      syncPlayButton();
    });
};

tryAutoplay();

const startOnFirstInteraction = () => {
  if (!pendingAutoplay) return;
  tryAutoplay();
  window.removeEventListener("pointerdown", startOnFirstInteraction);
  window.removeEventListener("keydown", startOnFirstInteraction);
  window.removeEventListener("touchstart", startOnFirstInteraction);
};

window.addEventListener("pointerdown", startOnFirstInteraction);
window.addEventListener("keydown", startOnFirstInteraction);
window.addEventListener("touchstart", startOnFirstInteraction);

playPauseBtn.addEventListener("click", () => {
  if (!audioPlayer.src) return;
  if (audioPlayer.paused) {
    audioPlayer.play();
    pendingAutoplay = false;
  } else {
    audioPlayer.pause();
  }
  syncPlayButton();
});

audioPlayer.addEventListener("play", syncPlayButton);
audioPlayer.addEventListener("pause", syncPlayButton);
audioPlayer.addEventListener("loadeddata", syncPlayButton);

if (loveNoteBox) {
  const noteStorageKey = "foreverLoveNote";
  const savedNote = localStorage.getItem(noteStorageKey);

  if (savedNote !== null) {
    loveNoteBox.value = savedNote;
  }

  loveNoteBox.addEventListener("input", () => {
    localStorage.setItem(noteStorageKey, loveNoteBox.value);
  });
}
