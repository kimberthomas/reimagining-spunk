function initAudioPlayer(targetId, songs) {
  const container = document.getElementById(targetId);
  if (!container) return;

  let currentIndex = 0;
  let loadedIndex = -1;

  const audio = document.createElement('audio');
  audio.preload = "metadata";
  container.appendChild(audio);

  const playerHTML = `
    <div>
      <div class="song-info text-center mb-4">
        <span class="current-title"></span><br>
        <span class="song-artist"></span>
      </div>
      <div class="player_img mb-3"><img src="img/audio_equalizer.gif" alt="" /></div>
        <div class="mb-4 pb-2">
            <div class="time-display mb-0 d-flex justify-content-between align-items-center w-100 mb-2">
                <span class="player-time current-time">00:00</span>
                <span class="player-time end-time">00:00</span>
            </div>
            <input type="range" class="progress-bar w-100 d-none" value="0" min="0" step="1" aria-label="Seek">
        </div>
      <div class="controls d-flex justify-content-center align-items-center gap-4">
        <button type="button" class="player-control prev-btn" aria-label="Previous track"><img src="img/audio_prev.svg" alt="" /></button>
        <button type="button" class="player-control mx-2 play-btn" aria-label="Play"><img src="img/audio_play.svg" alt="" /></button>
        <button type="button" class="player-control mx-2 pause-btn" aria-label="Pause" style="display:none;"><img src="img/audio_pause.svg" alt="" /></button>
        <button type="button" class="player-control next-btn" aria-label="Next track"><img src="img/audio_next.svg" alt="" /></button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', playerHTML);

  const playBtn = container.querySelector(".play-btn");
  const pauseBtn = container.querySelector(".pause-btn");
  const prevBtn = container.querySelector(".prev-btn");
  const nextBtn = container.querySelector(".next-btn");
  const progressBar = container.querySelector(".progress-bar");
  const currentTitle = container.querySelector(".current-title");
  const artist = container.querySelector(".song-artist");
  const currentTime = container.querySelector(".current-time");
  const endTime = container.querySelector(".end-time");

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "--:--";
    const mins = Math.floor(seconds / 60) || 0;
    const secs = Math.floor(seconds % 60) || 0;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function loadTrack(index) {
    audio.src = songs[index].src;
    audio.load();
    loadedIndex = index;
    currentTitle.textContent = songs[index].title;
    artist.textContent = songs[index].artist ? `Score by ${songs[index].artist}` : "";
    endTime.textContent = songs[index].length || "--:--";
  }

  function showPlaying(playing) {
    playBtn.style.display = playing ? "none" : "flex";
    pauseBtn.style.display = playing ? "flex" : "none";
  }

  function playTrack() {
    if (loadedIndex !== currentIndex) loadTrack(currentIndex);
    audio.play().then(() => showPlaying(true)).catch(() => showPlaying(false));
  }

  function pauseTrack() {
    audio.pause();
    showPlaying(false);
  }

  function changeTrack(step) {
    currentIndex = (currentIndex + step + songs.length) % songs.length;
    if (songs.length === 1) audio.currentTime = 0;
    playTrack();
  }

  playBtn.addEventListener("click", playTrack);
  pauseBtn.addEventListener("click", pauseTrack);
  nextBtn.addEventListener("click", () => changeTrack(1));
  prevBtn.addEventListener("click", () => changeTrack(-1));

  let probingDuration = false;

  function showDuration() {
    if (!Number.isFinite(audio.duration)) return;
    progressBar.max = audio.duration;
    endTime.textContent = formatTime(audio.duration);
  }

  // Some servers don't support byte-range requests, so the browser reports the
  // MP3 length as Infinity. Seeking far past the end forces it to work out the
  // real length, then we jump back to the start.
  audio.addEventListener("loadedmetadata", () => {
    if (audio.duration === Infinity) {
      probingDuration = true;
      audio.currentTime = 1e101;
      return;
    }
    showDuration();
  });

  audio.addEventListener("durationchange", () => {
    if (!Number.isFinite(audio.duration)) return;
    showDuration();
    if (probingDuration) {
      probingDuration = false;
      audio.currentTime = 0;
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (probingDuration || !Number.isFinite(audio.duration)) return;
    const percent = (audio.currentTime / audio.duration) * 100 || 0;
    progressBar.max = audio.duration;
    progressBar.value = audio.currentTime;
    progressBar.style.setProperty('--progress-percent', percent);
    currentTime.textContent = formatTime(audio.currentTime);
  });

  progressBar.addEventListener("input", () => {
    audio.currentTime = progressBar.value;
  });

  audio.addEventListener("ended", () => {
    if (songs.length > 1) {
      changeTrack(1);
    } else {
      showPlaying(false);
    }
  });

  loadTrack(currentIndex);
}

const songs = [
  {
    title: "Spunk (Original Score)",
    artist: "Anaya Patel",
    src: "music/spunk_score_final.mp3",
    length: "09:22",
  }
];

$(function () {
  initAudioPlayer("myAudioPlayer", songs);

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const slider = $('.owl-carousel');

  slider.owlCarousel({
    loop: false,
    margin: 0,
    nav: true,
    navText: [
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg><span class="sr-only">Previous slide</span>',
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg><span class="sr-only">Next slide</span>',
    ],
    dots: true,
    items: 1,
    autoHeight: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    smartSpeed: 700,
    responsiveClass: true,
    touchDrag: isTouch,
    mouseDrag: false,
  });

  // The browser can scroll this overflow:hidden box sideways when inner content changes; undo it.
  $('.main_sec .owl-stage-outer').on('scroll', function () {
    if (this.scrollLeft !== 0) this.scrollLeft = 0;
  });

  // Decode every slide background up front so a slide never fades in before its image is ready.
  slider.find('.item').each(function () {
    const match = /url\(["']?([^"')]+)["']?\)/.exec(getComputedStyle(this).backgroundImage);
    if (!match) return;
    const img = new Image();
    img.src = match[1];
    if (img.decode) img.decode().catch(function () {});
  });

  // 'instant' overrides the smooth scroll-behavior in CSS, which would otherwise
  // be interrupted by the slide's height change and leave the page scrolled down.
  function jumpToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  let heldItem = null;

  // Before scrolling to the top, shift the outgoing slide up by the current scroll offset
  // so it stays visually where the reader left it while the next slide fades in over it.
  slider.on('change.owl.carousel', function (e) {
    if (e.property.name !== 'position') return;
    const offset = window.scrollY;
    if (offset > 0) {
      heldItem = slider.find('.owl-item.active').get(0) || null;
      if (heldItem) heldItem.style.transform = 'translateY(' + -offset + 'px)';
    }
    jumpToTop();
  });
  slider.on('changed.owl.carousel', jumpToTop);
  slider.on('translated.owl.carousel', function () {
    if (heldItem) {
      heldItem.style.transform = '';
      heldItem = null;
    }
    jumpToTop();
  });

  const scrollHints = $('.scroll_hint');
  const primaryHint = $('.scroll_hint_left');

  function updateScrollHint() {
    const remaining = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
    const hasMore = remaining > 40;
    document.body.classList.toggle('has_more', hasMore);
    primaryHint.attr('tabindex', hasMore ? '0' : '-1');
  }

  scrollHints.on('click', function () {
    window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
  });

  $(window).on('scroll resize', updateScrollHint);
  slider.on('changed.owl.carousel translated.owl.carousel refreshed.owl.carousel resized.owl.carousel', function () {
    requestAnimationFrame(updateScrollHint);
  });
  $(window).on('load', updateScrollHint);
  // autoHeight animates the stage height, so re-check whenever it actually changes size.
  if ('ResizeObserver' in window) {
    const stageOuter = document.querySelector('.main_sec .owl-stage-outer');
    if (stageOuter) new ResizeObserver(updateScrollHint).observe(stageOuter);
  }
  updateScrollHint();

  $(".custom_btn").on('click', function () {
    slider.trigger('next.owl.carousel');
  });

  $(".back_btn").on('click', function () {
    window.location.reload();
  });

  let videoSrc = '';
  $('.video-btn').on('click', function () {
    videoSrc = $(this).data("src");
  });

  $('#myModal').on('shown.bs.modal', function () {
    if (!videoSrc) return;
    const separator = videoSrc.includes('?') ? '&' : '?';
    $('#video').attr('src', videoSrc + separator + 'autoplay=1');
  });

  $('#myModal').on('hide.bs.modal', function () {
    $('#video').attr('src', '');
  });

  $('[data-component="image-comparison-slider"]').each(function () {
    const $element = $(this);
    const $sliderRange = $element.find('[data-image-comparison-range]');
    const $slider = $element.find('[data-image-comparison-slider]');
    const $imageWrapperOverlay = $element.find('[data-image-comparison-overlay]');
    const $thumb = $element.find('[data-image-comparison-thumb]');

    if (!$sliderRange.length) return;

    function setSliderstate(e) {
      if (e.type === 'input') {
        $sliderRange.addClass('image-comparison__range--active');
        return;
      }
      $sliderRange.removeClass('image-comparison__range--active');
      $element.off('mousemove', moveSliderThumb);
    }

    function moveSliderThumb(e) {
      let position = e.originalEvent.layerY - 20;

      if (e.originalEvent.layerY <= $sliderRange[0].offsetTop) {
        position = -20;
      }
      if (e.originalEvent.layerY >= $sliderRange[0].offsetHeight) {
        position = $sliderRange[0].offsetHeight - 20;
      }

      $thumb.css('top', position + 'px');
    }

    function moveSliderRange(e) {
      const value = e.target.value;
      $slider.css('left', value + '%');
      $imageWrapperOverlay.css('width', value + '%');

      $element.on('mousemove', moveSliderThumb);
      setSliderstate(e);
    }

    if (!('ontouchstart' in window)) {
      $sliderRange.on('mouseup', setSliderstate);
      $sliderRange.on('mousedown', moveSliderThumb);
    }

    $sliderRange.on('input change', moveSliderRange);
  });
});
