document.addEventListener('DOMContentLoaded', () => {

    /* =======================
       SWIPER
    ======================= */
    if (document.querySelector('.swiper')) {
        new Swiper('.swiper', {
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            slidesPerView: 2,
            spaceBetween: 10,
            breakpoints: {
                600: {
                    slidesPerView: 3,
                    spaceBetween: 15,
                },
            },
        });
    }

    /* =======================
       MODAIS BASE
    ======================= */
    document.querySelectorAll('.openmodal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById(btn.dataset.modal)?.showModal();
        });
    });

    document.querySelectorAll('.closemodal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('dialog')?.close();
        });
    });

    document.querySelectorAll('dialog').forEach(dialog => {
        dialog.addEventListener('click', e => {
            if (e.target === dialog) dialog.close();
        });
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('dialog[open]').forEach(d => d.close());
        }
    });

    /* =======================
       ❤️ CURTIR / ✔ GUARDAR
       (LOCALSTORAGE)
    ======================= */

    const pageKey = location.pathname;

    const getState = (key) =>
        JSON.parse(localStorage.getItem(key)) || {};

    const saveState = (key, data) =>
        localStorage.setItem(key, JSON.stringify(data));

    const likeState = getState('likes_' + pageKey);
    const saveStateLS = getState('saved_' + pageKey);

    document.querySelectorAll('.icon.curtir').forEach((btn, index) => {
        if (likeState[index]) btn.classList.add('ativo');

        btn.addEventListener('click', () => {
            btn.classList.toggle('ativo');
            likeState[index] = btn.classList.contains('ativo');
            saveState('likes_' + pageKey, likeState);
        });
    });

    document.querySelectorAll('.icon.guardar').forEach((btn, index) => {
        if (saveStateLS[index]) btn.classList.add('ativo');

        btn.addEventListener('click', () => {
            btn.classList.toggle('ativo');
            saveStateLS[index] = btn.classList.contains('ativo');
            saveState('saved_' + pageKey, saveStateLS);
        });
    });

    /* =======================
       🎵 MODAL DE MÚSICA
    ======================= */

    const modal = document.getElementById('hoverMusicModal');
    if (!modal) return;

    const modalImg = document.getElementById('hoverMusicImg');
    const modalTitle = document.getElementById('hoverMusicTitle');
    const playBtn = document.getElementById('hoverPlayPause');
    const progress = document.getElementById('musicProgress');
    const volume = document.getElementById('musicVolume');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const addToMyListBtn = document.getElementById('addToMyList');

    let audio = new Audio();
    let isPlaying = false;
    let currentMusicData = null;

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    const getMyList = () =>
        JSON.parse(localStorage.getItem('myList')) || [];

    const saveMyList = (list) =>
        localStorage.setItem('myList', JSON.stringify(list));

    document.querySelectorAll('.hover-music').forEach(card => {
        card.addEventListener('click', () => {

            currentMusicData = {
                id: card.dataset.id,
                title: card.dataset.title,
                img: card.dataset.img,
                audio: card.dataset.audio
            };

            modalImg.src = currentMusicData.img;
            modalTitle.textContent = currentMusicData.title;

            modalImg.style.objectPosition = 'center 60%';
            if (card.dataset.img.includes('img8')) modalImg.style.objectPosition = 'center 100%';
            if (card.dataset.img.includes('img6')) modalImg.style.objectPosition = 'center 40%';
            if (card.dataset.img.includes('img10')) modalImg.style.objectPosition = 'center 25%';
            if (card.dataset.img.includes('imgs4')) modalImg.style.objectPosition = 'center 13%';
            if (card.dataset.img.includes('imgs3')) modalImg.style.objectPosition = 'center 20%';

            const myList = getMyList();
            addToMyListBtn.classList.toggle(
                'ativo',
                myList.some(item => item.id === currentMusicData.id)
            );

            audio.pause();
            audio.currentTime = 0;
            audio.src = currentMusicData.audio;
            audio.volume = volume.value;

            progress.value = 0;
            currentTimeEl.textContent = '0:00';
            durationEl.textContent = '0:00';
            isPlaying = false;
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';

            modal.showModal();
        });
    });

    audio.addEventListener('loadedmetadata', () => {
        progress.max = Math.floor(audio.duration);
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        progress.value = Math.floor(audio.currentTime);
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    playBtn.addEventListener('click', () => {
        if (!isPlaying) {
            audio.play();
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
            audio.pause();
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
        isPlaying = !isPlaying;
    });

    progress.addEventListener('input', () => {
        audio.currentTime = progress.value;
    });

    volume.addEventListener('input', () => {
        audio.volume = volume.value;
    });

    modal.addEventListener('close', () => {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    });

    addToMyListBtn.addEventListener('click', () => {
        if (!currentMusicData) return;

        let myList = getMyList();
        const index = myList.findIndex(item => item.id === currentMusicData.id);

        if (index === -1) {
            myList.push(currentMusicData);
            addToMyListBtn.classList.add('ativo');
        } else {
            myList.splice(index, 1);
            addToMyListBtn.classList.remove('ativo');
        }

        saveMyList(myList);
    });

    /* =======================
   🎬 MODAL REVIVER (VÍDEO)
======================= */

    const modalInfo = document.getElementById('modal1');
    const modalReviver = document.getElementById('modalReviver');
    const videoReviver = document.getElementById('videoReviver');

    /* ---- Abrir Reviver corretamente ---- */
    document.querySelectorAll('[data-modal="modalReviver"]').forEach(btn => {
        btn.addEventListener('click', () => {

            // Fecha QUALQUER modal aberto antes
            document.querySelectorAll('dialog[open]').forEach(d => d.close());

            // Abre o modal do vídeo
            modalReviver.showModal();

            // NÃO força play — só garante reset
            videoReviver.currentTime = 0;
        });
    });

    /* ---- Ao fechar o modal do vídeo ---- */
    modalReviver.addEventListener('close', () => {
        videoReviver.pause();
        videoReviver.currentTime = 0;
    });



});
