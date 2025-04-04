document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM is Ready!");

    const currentSong = new Audio()
    let songs;
    let currFolder;


    const secondToMin = (second) => {
        if (isNaN(second) || second < 0) {
            return "00:00"
        }

        const min = Math.floor(second / 60);
        const remainingSecond = Math.floor(second % 60);

        const formattedMinutes = String(min).padStart(2, "0");
        const formattedSecond = String(remainingSecond).padStart(2, "0");

        return `${formattedMinutes}:${formattedSecond}`;

    }

    async function getSong(folder) {
        currFolder = folder
        let a = await fetch(`http://127.0.0.1:5500/assets/songs/${folder}/`);
        let response = await a.text();
        // console.log(response);
        let div = document.createElement("div")
        div.innerHTML = response
        songs = [];
        let para = [];
        let as = div.getElementsByTagName("a")
        for (let index = 0; index < as.length; index++) {
            const element = as[index];

            // this take elements title 

            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${folder}/`)[1]);
            }

        }

        const songList = document.querySelector(".songs-list").getElementsByTagName("ul")[0];
        songList.innerHTML = "";
        console.log(songList)
        for (const song of songs) {
            songList.innerHTML = songList.innerHTML + `<li class="flex cursor-pointer">
                                        <img class="width-35" src="assets/svg/music.svg" alt="music">
                                        <div class="list-card list-text">
                                            <h6>${decodeURI(song.replaceAll("%20", " "))}</h6>
                                        </div>
                                    </li>`;
            // songList.innerHTML = songList.innerHTML + `<li>${song.replaceAll("%20", " ")}
        }

        Array.from(document.querySelector(".songs-list").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                console.log(e.querySelector(".list-card").firstElementChild.innerHTML)
                playMusic(e.querySelector(".list-card").firstElementChild.innerHTML)
                document.querySelector(".play-btn-img").src = "assets/svg/pause-btn.svg"
                console.log(document.querySelector(".play-btn-img").src = "assets/svg/pause-btn.svg");


            })
        });

    }

    const playMusic = (track, pause = false) => {
        // let audio = new Audio("assets/songs/" + track)
        if (!pause) {
            currentSong.src = (`assets/songs/${currFolder}/` + track)
            currentSong.play()
            document.querySelector(".song-name").innerHTML = decodeURI(track)
        }
        // document.querySelector(".song-duration").innerHTML = "00:00 / 00:00"

    }

    const previousmusic = (previousTrack) => {
        currentSong.src = (`assers/songs/${folder}` + track - 1)
    }

    async function DisplayAlbum() {
        let a = await fetch("http://127.0.0.1:5500/assets/songs/")
        let response = await a.text();
        let div = document.createElement("div")
        div.innerHTML = response;
        // console.log(div);

        let anchours = div.getElementsByTagName("a")
        // console.log(Array.from(anchours))
        // let cardContainer = document.querySelector(".card-container")
        Array.from(anchours).forEach(async e => {
            // let array = Array.from(anchours)
            // for (let index = 0; index < array.length; index++) {
            //     const e = array[index];


            // console.log(array)
            // console.log(e)
            // console.log(e.href)
            console.log(e.href.includes("/songs"))
            if (e.href.includes("/songs")) {
                // console.log(e.href.includes("/songs"))
                // console.log(e.href)
                let folder = e.href.split("/").slice(-1)[0];
                // console.log(folder)
                let a = await fetch(`http://127.0.0.1:5500/assets/songs/${folder}/info.json`);
                let response = await a.json();
                // console.log(response)
                let cardContainer = document.querySelector(".card-container-div")
                // console.log("working")
                cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card card-1 border m-13 m-17">
                                    <div class="card-img m-7"><img class="position-relative" src="assets/songs/${folder}/cover.jpg" alt="card-img-1"></div>
                                    <div class="play-container"><button class="play-btn"><img src="assets/svg/play-btn.svg" alt="playbtn"></button></div>
                                    <h4 class="m-7">${response.title}</h4>
                                    <p class="m-7 fs-14">${response.Discription}</p>
                                </div>
                                `

            }
        })
        setTimeout(() => {
            Array.from(document.getElementsByClassName('card')).forEach(e => {
                e.addEventListener("click", async item => {
                    let folder = item.currentTarget.dataset.folder;
                    console.log(folder)
                    songs = await getSong(`${folder}`);
                    console.log("working");
                    // console.log(getSong(`${folder}`));

                });
            });
        }, 1000)
    }


    async function main() {
        //get the list of all songs
        await getSong("HoneySingh");
        playMusic(songs[0])

        DisplayAlbum();


        const previousBtn = document.querySelector(".previous-btn");
        previousBtn.addEventListener("click", () => {
            console.log("previaus working");

            console.log(currentSong);
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            console.log(index);
            if ((index - 1) >= 0) {
                playMusic(songs[index - 1])
                document.querySelector(".play-btn-img").src = "assets/svg/pause-btn.svg"
            }

        })

        const nextBtn = document.querySelector(".next-btn");
        nextBtn.addEventListener("click", () => {
            console.log("next working");

            console.log(currentSong)

            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if ((index + 1) < songs.length) {
                playMusic(songs[index + 1])
                document.querySelector(".play-btn-img").src = "assets/svg/pause-btn.svg"
            }
            console.log(index)
        })



        const playSong = document.querySelector(".song-play-btn");
        playSong.addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play();
                document.querySelector(".play-btn-img").src = "assets/svg/pause-btn.svg"
            }
            else {
                currentSong.pause()
                document.querySelector(".play-btn-img").src = "assets/svg/song-play-button.svg"
            }
        });

        currentSong.addEventListener("timeupdate", () => {
            secondToMin(currentSong.currentTime, currentSong.duration)
            document.querySelector(".song-information").innerHTML = `${secondToMin(currentSong.currentTime)}/${secondToMin(currentSong.duration)}`
            document.querySelector(".circul").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        })

        document.querySelector(".seekbar").addEventListener("click", (e) => {
            let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
            document.querySelector(".circul").style.left = persent + "%";
            currentSong.currentTime = (currentSong.duration * persent) / 100

        })

        let hamburgar = document.querySelector(".hamburgar")
        hamburgar.addEventListener("click", () => {
            let left = document.querySelector(".left")
            left.style.left = "0vw";
            left.style.zIndex = "1";
            hamburgar.style.opacity = "0"
            hamburgar.style.cursor = "default"
            hamburgar.style.transition = "1.5s ease-out"
            cancel.style.opacity = "1"

        })
        let cancel = document.querySelector(".cancel")
        cancel.addEventListener("click", () => {
            let left = document.querySelector(".left")
            left.style.left = "-100vw";
            left.style.zIndex = "1";
            hamburgar.style.opacity = "1"
            hamburgar.style.cursor = "pointer"
        })

        let range = document.querySelector(".ip-range")
        range.addEventListener("change", (e) => {
            console.log("set volume:", e.target.value)
            currentSong.volume = parseInt(e.target.value) / 100
            console.log(currentSong.value);

            if (e.target.value <= "0") {
                document.querySelector(".volume-img").src = "assets/svg/volume-mute.svg"
            }
            if (e.target.value >= "100") {
                document.querySelector(".volume-img").src = "assets/svg/volume.svg"
            }
        })




    }

    main();
})