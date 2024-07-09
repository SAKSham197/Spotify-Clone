let currentsong = new Audio()
let songs
let currfolder
function secondsToMinutesSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ":" + ("0" + remainingSeconds).slice(-2);
}

// Fetch songs
async function getsongs(folder) {
    currfolder=folder
    let songsdata = await fetch(`http://127.0.0.1:3000/songs/${folder}/`)
    songsdata = await songsdata.text();
    let div = document.createElement("div")
    div.innerHTML = songsdata
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith("mp3"))
        {
            songs.push(element.href)
        }
        
    }
    


    

  
   



     // Show all songs in playlist 
     let songlists = document.querySelector(".songlists").querySelector("ul")
     songlists.innerHTML=""
     for (const song of songs) {
            songlists.innerHTML = songlists.innerHTML +
            `<li>
        <img class="filter" src="img/music.svg" alt="">
            <div class="info">
                <div class="songname"> ${song.replaceAll("%20"," ").split(`/songs/${currfolder}/`)[1]}</div>
               
            </div>
            <span>Play now</span>
            <img class="filter" src="img/pause.svg" alt="">
        </li>`
        
       
        
     }
 
 
 
     // Add an event listener to each song
     Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(e => {
         e.addEventListener("click", () => {
            console.log(e.querySelector(".songname").innerHTML.replaceAll("  ", " ").trim());
             playMusic(e.querySelector(".songname").innerHTML.replaceAll("  ", " ").trim())
         })
 
 
     })



      // Add event listener to each img of li when clicked
    Array.from(document.querySelector(".songlists ").getElementsByTagName("li")).forEach((e) => {

        e.addEventListener("click", () => {
            Array.from(document.querySelector(".songlists ").getElementsByTagName("li")).forEach((element) => {
                element.querySelector("img:last-child").src = "img/pause.svg"
            })

            let target = e.querySelector("img:last-child")
            target.src = "img/play.svg"
        })
    })

    
}

// Function for playing music

const playMusic = (track) => {
    console.log(`/songs/${currfolder}/`+track);
    currentsong.src = (`/songs/${currfolder}/`+track)
    currentsong.play()
    pause.src = "img/play.svg"
    document.querySelector(".songinfo").innerHTML = track
}

//Function for display albums
async function displayalbum()
{
    let cards=document.querySelector(".cards")
    let albums=await fetch("http://127.0.0.1:3000/songs/")
    albums= await albums.text()
    let div = document.createElement("div")
    div.innerHTML = albums
    let as=div.getElementsByTagName("a")
    as= Array.from(as)
        for (let index = 0; index < as.length; index++) {
            const e = as[index];
            
        
        if(e.href.includes("/songs/"))
        {
            let folder=e.href.split("/songs/")[1].replace("/","");
            // Get metadata of folder
            let infodata=await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            infodata= await infodata.json()

            cards.innerHTML=cards.innerHTML+` <div >
                    <div data-folder=${folder}  class="card ">
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h3>${infodata.title}</h3>
                        <p>${infodata.description}</p>
                        <div class="play-container">
                            <svg class="play-button" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <polygon points="30,20 30,80 80,50" />
                            </svg>
                        </div>
                    </div>`
        }}
           
    

      // Add event listener to load the songs of playlist in card
      Array.from(document.getElementsByClassName("card")).forEach((e)=>{
        e.addEventListener("click",async (item)=>{
            
             await getsongs(`${item.currentTarget.dataset.folder.replace("%20"," ")}`)
            let track= document.querySelector(".songlists").getElementsByTagName("li")[0].querySelector(".songname").innerHTML.trim()
            playMusic(track)
            document.querySelector(".songlists").getElementsByTagName("li")[0].querySelector("img:last-child").src="img/play.svg"
        })
    })


}




async function main() {


    // Get all songs
    await getsongs(`Sigma mood`)
    // First song load info 
    currentsong.src = songs[0]
    // console.log(songs[1]);
    let a = songs[0].split("3000")[1]
    // console.log(a);
    document.querySelector(".songinfo").innerHTML = a.replaceAll("%20", " ").replace(`/songs/${currfolder}/`,"");

    //Display albums or playlists on page
    displayalbum()

    // Add event listener to pause,prev and next buttons

    pause.addEventListener("click", () => {
        if ((currentsong.paused)) {
            pause.src = "img/play.svg"
            currentsong.play()
          
            Array.from(document.querySelector(".songlists ").getElementsByTagName("li")).forEach((e) => {
                if (e.querySelector(".songname").innerHTML.trim().replaceAll("  ", " ") === currentsong.src.replaceAll("%20", " ").split(`/songs/${currfolder}/`)[1]) {
                    e.querySelector("img:last-child").src = "img/play.svg"
                }


            })


        }
        else {
            pause.src = "img/pause.svg"
            currentsong.pause()
            Array.from(document.querySelector(".songlists ").getElementsByTagName("li")).forEach((e) => {
                if (e.querySelector(".songname").innerHTML.trim().replaceAll("  ", " ") === currentsong.src.replaceAll("%20", " ").split(`/songs/${currfolder}/`)[1]) {
                   
                    e.querySelector("img:last-child").src = "img/pause.svg"
                   
                }

            })

        }


    })



    // Add event listener to current song for current time and duration

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".duration").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`
    })


    // Add event listener to seekbar 
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        percent = (e.offsetX) / (e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = (percent * (currentsong.duration)) / 100

    })



    // Add event listener to next 
    next.addEventListener("click", () => {

        let index = songs.indexOf(currentsong.src)



        if ((index + 1) <= (songs.length - 1)) {
            playMusic(songs[index + 1].replaceAll("%20"," ").split(`/songs/${currfolder}/`)[1])
          
           
            }
            Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(
                (e)=>{
                    if(currentsong.src.replaceAll("%20"," ").split(`/songs/${currfolder}/`)[1]===e.querySelector(".songname").innerHTML.trim().replaceAll("  ", " "))
                    {
                        Array.from(document.querySelector(".songlists ").getElementsByTagName("li")).forEach((element) => {
                            element.querySelector("img:last-child").src = "img/pause.svg"
                        })
                         e.querySelector("img:last-child").src = "img/play.svg"
                        
                    }})
           
        
    })

    // Add event listener to prev
    prev.addEventListener("click", () => {

        let index = songs.indexOf(currentsong.src)



        if ((index - 1) >= 0) {
            playMusic(songs[index - 1].replaceAll("%20", " ").split(`/songs/${currfolder}/`)[1])
        }

        Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(
            (e)=>{
                if(currentsong.src.replaceAll("%20"," ").split(`/songs/${currfolder}/`)[1]===e.querySelector(".songname").innerHTML.trim().replaceAll("  ", " "))
                {
                    Array.from(document.querySelector(".songlists ").getElementsByTagName("li")).forEach((element) => {
                        element.querySelector("img:last-child").src = "img/pause.svg"
                    })
                     e.querySelector("img:last-child").src = "img/play.svg"
                     
                    
                }})
    })


    // Add event listener to volume rocker

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        let img = document.querySelector(".volduration").getElementsByTagName("img")[0]
        currentsong.volume = (e.target.value) / 100;
        if(currentsong.volume==0)
        {
           img.src="http://127.0.0.1:3000/img/mute.svg"
        }
        else
        {
            img.src = "http://127.0.0.1:3000/img/vol.svg"
        }
    })

    //Add event listener to volume button for mute and unmute
    document.querySelector(".volduration").getElementsByTagName("img")[0].addEventListener("click", () => {
        let img = document.querySelector(".volduration").getElementsByTagName("img")[0]
        if (img.src === "http://127.0.0.1:3000/img/vol.svg") {
            img.src = "http://127.0.0.1:3000/img/mute.svg"
            currentsong.volume=0
            document.querySelector(".volume").getElementsByTagName("input")[0].value=0
        }
        else {
            img.src = "http://127.0.0.1:3000/img/vol.svg"
            currentsong.volume=0.1
            document.querySelector(".volume").getElementsByTagName("input")[0].value=10
        }
    })

    // Add event listener for open hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0%"
        })

    // Add event listener for close hamburger
    document.querySelector(".cross").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-200%"
        })



  





   



}










main()





















