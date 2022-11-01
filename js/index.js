const textInput = document.querySelector("input");
const box = document.querySelector("#results");
document.querySelector("button.secondary").addEventListener('click', () => searchAlbum(textInput.value));
document.querySelector("button.third").addEventListener('click', () => searchPlaylist(textInput.value));

function downloadTrack(id, type) {

}

function searchAlbum(name) {
  fetch("https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/album?q=" + name).
    then(resp => resp.json()).
    then(resp => drawAlbum(resp.data));
}

function searchPlaylist(name) {
  fetch("https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/playlist?q=" + name).
    then(resp => resp.json()).
    then(resp => drawPlaylist(resp.data));
}

function drawAlbum(albuns) {
  let albunsArray = [];
  albuns.forEach(album => {
    let newdiv = document.createElement('div');
    newdiv.classList.add('result');

    let albumName = document.createElement('p');
    albumName.innerText = album.artist.name + " - " + album.title;
    newdiv.appendChild(albumName);


    let downloads = document.createElement('div')
    downloads.classList.add('download-box')

    let mp3 = document.createElement('button');
    mp3.innerText = "mp3";
    mp3.classList.add("secondary");
    mp3.addEventListener('click', () => downloadList(album.id, "mp3", "album"))
    downloads.appendChild(mp3);

    let flac = document.createElement('button');
    flac.innerText = "flac";
    flac.classList.add("third");
    flac.addEventListener('click', () => downloadList(album.id, "flac", "album"))
    downloads.appendChild(flac);
    newdiv.appendChild(downloads);

    albunsArray.push(newdiv);
  })
  box.replaceChildren(...albunsArray);
}

function drawPlaylist(playlists) {
  let playlistArray = [];
  playlists.forEach(playlist => {
    let newdiv = document.createElement('div');
    newdiv.classList.add('result');

    let playlistName = document.createElement('p');
    playlistName.innerText = playlist.user.name + " - " + playlist.title;
    newdiv.appendChild(playlistName);


    let downloads = document.createElement('div')
    downloads.classList.add('download-box')

    let mp3 = document.createElement('button');
    mp3.innerText = "mp3";
    mp3.classList.add("secondary");
    mp3.addEventListener('click', () => downloadList(playlist.id, "mp3", "playlist"))
    downloads.appendChild(mp3);

    let flac = document.createElement('button');
    flac.innerText = "flac";
    flac.classList.add("third");
    flac.addEventListener('click', () => downloadList(playlist.id, "flac", "playlist"))
    downloads.appendChild(flac);
    newdiv.appendChild(downloads);

    playlistArray.push(newdiv);
  })
  box.replaceChildren(...playlistArray);
}

function downloadList(id, type, list) {
  let commandBox = document.createElement('p');
  commandBox.innerText = "[ "
  fetch(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/${list}/${id}`).
    then(resp => resp.json()).
    then(resp => resp.tracks.data.forEach(track => { console.log(track); commandBox.innerText += track.id + ", "})).
    then(() => {
      commandBox.innerText.slice(0, -2);
      commandBox.innerText += `].forEach(id => {
  fetch("https://free-mp3-download.net/dl.php?", {
    "body": \`{\"i\":\${id},\"f\":\"${type}\",\"h\":\"\"}\`,
    "method": "POST",
    }).then(resp => resp.blob()).then(resp => resp.text()).then(resp => window.open(resp, '_blank'));
  })`;
      box.replaceChildren(commandBox);
    })

}
