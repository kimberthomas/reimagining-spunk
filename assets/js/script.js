$(document).ready(function () {

    $('.video-thumbnail').each(function () {
        const $thumbnail = $(this);
        const $video = $thumbnail.find('.player');

        // Initialize a new Plyr instance for this specific video
        const player = new Plyr($video[0], { fullscreen: { enabled: true } });

        // Flag to track if the video is already playing
        let isPlaying = false;

        $thumbnail.on('click', function () {
            // Prevent interference with other videos if this one is already playing
            if (isPlaying) {
                return; // Stop further processing if video is already playing
            }

            // Hide the thumbnail image and play icon, show the video player
            $thumbnail.find('.play-icon').hide();
            $thumbnail.find('img').hide();
            $video.show();

            // Enter full screen and play video
            player.fullscreen.enter();
            player.play();

            // Set the flag to indicate the video is playing
            isPlaying = true;
        });

        // Event listener for when the video ends
        player.on('ended', function () {
            // Reset to initial state after video ends
            player.pause();
            $thumbnail.find('.play-icon').show();
            $thumbnail.find('img').show();
            $video.hide();

            // Reset the playing flag
            isPlaying = false;
        });

        // Optional: also reset when exiting full screen
        player.on('exitfullscreen', function () {
            if (player.ended) {
                player.pause();
                $thumbnail.find('.play-icon').show();
                $thumbnail.find('img').show();
                $video.hide();

                // Reset the playing flag
                isPlaying = false;
            }
        });
    });


    // // Initialize WaveSurfer
    // const wavesurfer = WaveSurfer.create({
    //     container: '#waveform',
    //     waveColor: '#ff8a34',
    //     progressColor: 'purple',
    //     height: 100, // Adjust height as needed
    //     barWidth: 2,
    // });

    // // Load the audio file
    // wavesurfer.load('./assets/audio/spunk_score_final.mp3'); // Replace with the path to your audio file

    // // Select play/pause icons
    // const playIcon = document.getElementById('icon-play');
    // const pauseIcon = document.getElementById('icon-pause');

    // // Play/Pause functionality
    // document.getElementById('play-button').addEventListener('click', () => {
    //     wavesurfer.playPause();

    //     // Toggle icons based on playback state
    //     if (wavesurfer.isPlaying()) {
    //         playIcon.style.display = 'none';
    //         pauseIcon.style.display = 'inline';
    //     } else {
    //         playIcon.style.display = 'inline';
    //         pauseIcon.style.display = 'none';
    //     }
    // });

    // // Optional: Reset icons when audio finishes
    // wavesurfer.on('finish', () => {
    //     wavesurfer.seekTo(0); // Reset to the start
    //     playIcon.style.display = 'inline';
    //     pauseIcon.style.display = 'none';
    // });

    const sound = new Howl({
        src: ['./assets/audio/spunk_score_final.mp3'],
        onplay: () => requestAnimationFrame(updateProgress),
    });
    
    const playPauseButton = document.getElementById('play-pause');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const progressContainer = document.getElementById('progress-container');
    const progress = document.getElementById('progress');
    const seeker = document.getElementById('seeker');
    
    playPauseButton.addEventListener('click', () => {
        if (sound.playing()) {
            sound.pause();
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        } else {
            sound.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        }
    });
    
    function updateProgress() {
        const progressPercent = (sound.seek() / sound.duration()) * 100;
        progress.style.width = `${progressPercent}%`;
        seeker.style.left = `${progressPercent}%`;
    
        if (sound.playing()) {
            requestAnimationFrame(updateProgress);
        }
    }
    
    progressContainer.addEventListener('click', (e) => {
        const clickPosition = e.offsetX / progressContainer.clientWidth;
        sound.seek(sound.duration() * clickPosition);
    });

})
