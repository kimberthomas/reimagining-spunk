function initAudioPlayer(targetId, songs) {
  const container = document.getElementById(targetId);
  let currentIndex = 0;
  let isPlaying = false;

  const audio = document.createElement('audio');
  audio.preload = "auto";
  container.appendChild(audio);

  const playerHTML = `
    <div>
      <div class="song-info text-center mb-4">
        <span class="current-title"></span><br>
      </div>
      <div class="player_img mb-3"><img src="img/audio_equalizer.gif" /></div>
        <div class="mb-4 pb-2">
            <div class="time-display mb-0 d-flex justify-content-between align-items-center w-100 mb-2">
                <span class="player-time start-time d-none">00:00</span>
                <span class="player-time current-time">00:00</span>
                <span class="player-time end-time">00:00</span>
            </div>
            <input type="range" class="progress-bar w-100 d-none" value="0" min="0" step="1">
        </div>
      <div class="controls d-flex justify-content-center align-items-center gap-4">
        <button class="player-control prev-btn"><img src="img/audio_prev.svg" /></button>
        <button class="player-control mx-2 play-btn"><img src="img/audio_play.svg" /></button>
        <button class="player-control mx-2 pause-btn" style="display:none;"><img src="img/audio_pouse.svg" /></button>
        <button class="player-control next-btn"><img src="img/audio_next.svg" /></button>
      </div>

        <!--<div class="up-next d-flex flex-column align-items-center gap-3 mt-5">
            <span class="up-next-title">Up Next</span>
            <span class="next-title"></span>
        </div>-->
    </div>
  `;
  container.insertAdjacentHTML('beforeend', playerHTML);

  const playBtn = container.querySelector(".play-btn");
  const pauseBtn = container.querySelector(".pause-btn");
  const prevBtn = container.querySelector(".prev-btn");
  const nextBtn = container.querySelector(".next-btn");
  const progressBar = container.querySelector(".progress-bar");
  const currentTitle = container.querySelector(".current-title");
  const nextTitle = container.querySelector(".next-title");

  const startTime = container.querySelector(".start-time");
  const currentTime = container.querySelector(".current-time");
  const endTime = container.querySelector(".end-time");

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60) || 0;
    const secs = Math.floor(seconds % 60) || 0;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function setAudioSource(index) {
    audio.innerHTML = `
      <source src="${songs[index].m4a}" type="audio/mp4">
      <source src="${songs[index].mp3}" type="audio/mpeg">
      Your browser does not support the audio element.
    `;
    audio.load();
  }

  function updateDisplay() {
    currentTitle.textContent = songs[currentIndex].title;
    const nextIndex = (currentIndex + 1) % songs.length;
    nextTitle.textContent = songs[nextIndex].title;
  }

  function playTrack() {
    setAudioSource(currentIndex);
    audio.play();
    isPlaying = true;
    playBtn.style.display = "none";
    pauseBtn.style.display = "flex";
    updateDisplay();
  }

  function pauseTrack() {
    audio.pause();
    isPlaying = false;
    pauseBtn.style.display = "none";
    playBtn.style.display = "flex";
  }

  function nextTrack() {
    currentIndex = (currentIndex + 1) % songs.length;
    playTrack();
  }

  function prevTrack() {
    currentIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    playTrack();
  }

  playBtn.onclick = playTrack;
  pauseBtn.onclick = pauseTrack;
  nextBtn.onclick = nextTrack;
  prevBtn.onclick = prevTrack;

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      progressBar.max = audio.duration;
      progressBar.value = audio.currentTime;
      startTime.textContent = formatTime(0);
      currentTime.textContent = formatTime(audio.currentTime);
      endTime.textContent = formatTime(audio.duration);
        const percent = (audio.currentTime / audio.duration) * 100 || 0;
  progressBar.max = audio.duration || 0;
  progressBar.value = audio.currentTime || 0;
  progressBar.style.setProperty('--progress-percent', percent);
    }
  });

  progressBar.addEventListener("input", () => {
    audio.currentTime = progressBar.value;
  });

  audio.addEventListener("ended", nextTrack);

  // Init
  updateDisplay();
  setAudioSource(currentIndex);
}

const songs = [
  {
    title: "Anaya Patel",
    m4a: "music/spunk_score_final.WAV",
    mp3: "music/spunk_score_final.mp3",
  }
];

$(document).ready(function () {

initAudioPlayer("myAudioPlayer", songs);
  $(".my-carousel").slick({
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToScroll: 1,
    variableWidth: true,
    infinite: true,
    arrows: false,
    centerMode: true,
    initialSlide: 2,
    swipe: true,
    touchMove: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerMode: false,
          variableWidth: false,
          slidesToShow: 1,
        },
      },
    ],
  });
});


$('.owl-carousel').owlCarousel({
    loop:false,
    margin:10,
    nav:true,
    dots:true,
    items:1,
    autoHeight: true,
    responsiveClass:true,
    touchDrag:false,
    mouseDrag:false,
});


var slider = $('.owl-carousel');
  $(".custom_btn").click(function(){
   slider.trigger('next.owl.carousel');
});


$('.btn-close').click(function() {
   $('#video').attr('src', ''); 
});
$(window).click(function() {
   $('#video').attr('src', ''); 
});
//Video Modal js
$(document).ready(function() {
	// Gets the video src from the data-src on each button
	var $videoSrc;  
	$('.video-btn').click(function() {
		$videoSrc = $(this).data( "src" );
	});
	console.log($videoSrc);
	// when the modal is opened autoplay it  
	$('#myModal').on('shown.bs.modal', function (e) {
	// set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
	$("#video").attr('src',$videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" ); 
	})
	// stop playing the youtube video when I close the modal
	$('#myModal').on('hide.bs.modal', function (e) {
		// a poor man's stop video
		$("#video").attr('src',$videoSrc); 
	}) 
	// document ready  
});




$('[data-component="image-comparison-slider"]').each(function () {
  const $element = $(this);
  const $sliderRange = $element.find('[data-image-comparison-range]');
  const $slider = $element.find('[data-image-comparison-slider]');
  const $imageWrapperOverlay = $element.find('[data-image-comparison-overlay]');
  const $thumb = $element.find('[data-image-comparison-thumb]');

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

  // Init
  if (!('ontouchstart' in window)) {
    $sliderRange.on('mouseup', setSliderstate);
    $sliderRange.on('mousedown', moveSliderThumb);
  }

  $sliderRange.on('input', moveSliderRange);
  $sliderRange.on('change', moveSliderRange);
});

