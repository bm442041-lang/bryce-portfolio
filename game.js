// Duluth-themed fish catching game: click fish swimming in Lake Superior
(function () {
    var area = document.querySelector('.play-area');
    if (!area) return;

    var target = document.createElement('div');
    target.className = 'target';

    var scoreEl = document.getElementById('score');
    var timeEl = document.getElementById('time');
    var bestEl = document.getElementById('best');
    var startBtn = document.getElementById('start');
    var audio = document.getElementById('bg-music');
    var audioBtn = document.getElementById('toggle-audio');

    var score = 0;
    var timeLeft = 30;
    var timerId = null;
    var moveId = null;
    var best = Number(localStorage.getItem('bestScore') || 0);
    if (bestEl) bestEl.textContent = String(best);
    var musicOn = false;

    // Different fish types found in Lake Superior
    var fishTypes = ['🐟', '🐠', '🐡', '🦈', '🐟', '🐠', '🐡'];
    var currentFishIndex = 0;

    function updateHud() {
        if (scoreEl) scoreEl.textContent = String(score);
        if (timeEl) timeEl.textContent = String(timeLeft);
    }

    function randomIn(range) { return Math.floor(Math.random() * range); }

    function placeTarget() {
        var w = area.clientWidth - 56;
        var h = area.clientHeight - 56;
        var x = randomIn(Math.max(1, w));
        var y = randomIn(Math.max(1, h));
        target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        
        // Cycle through different fish
        target.textContent = fishTypes[currentFishIndex];
        currentFishIndex = (currentFishIndex + 1) % fishTypes.length;
    }

    function tick() {
        timeLeft -= 1;
        updateHud();
        if (timeLeft <= 0) endGame();
    }

    function startGame() {
        score = 0;
        timeLeft = 30;
        currentFishIndex = 0;
        updateHud();
        if (!area.contains(target)) area.appendChild(target);
        placeTarget();
        clearInterval(timerId); clearInterval(moveId);
        timerId = setInterval(tick, 1000);
        moveId = setInterval(placeTarget, 900);
        startBtn.disabled = true;
        ensureMusic();
    }

    function endGame() {
        clearInterval(timerId); clearInterval(moveId);
        startBtn.disabled = false;
        if (score > best) {
            best = score;
            localStorage.setItem('bestScore', String(best));
            if (bestEl) bestEl.textContent = String(best);
        }
    }

    target.addEventListener('click', function (e) {
        e.stopPropagation();
        score += 1;
        updateHud();
        placeTarget();
    });

    area.addEventListener('click', function () {
        // Miss: small penalty
        if (timeLeft > 0) score = Math.max(0, score - 1);
        updateHud();
    });

    if (startBtn) startBtn.addEventListener('click', startGame);
    if (audioBtn) {
        audioBtn.addEventListener('click', function () {
            if (!audio) return;
            if (musicOn) {
                audio.pause();
                musicOn = false;
                audioBtn.textContent = 'Play Background Music';
            } else {
                ensureMusic();
            }
        });
    }

    function ensureMusic() {
        if (!audio) return;
        audio.volume = 0.4;
        var playPromise = audio.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(function () {
                musicOn = true;
                if (audioBtn) audioBtn.textContent = 'Pause Background Music';
            }).catch(function () {
                // Autoplay prevented; user can tap button
                musicOn = false;
                if (audioBtn) audioBtn.textContent = 'Play Background Music';
            });
        } else {
            musicOn = true;
            if (audioBtn) audioBtn.textContent = 'Pause Background Music';
        }
    }

    updateHud();
})();
