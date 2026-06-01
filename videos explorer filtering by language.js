<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Video List</title>

</head>

<body>

<div style="font-family:Arial; margin:auto; max-width:750px; text-align:center;">

<h2>🎬 Video List</h2>

<select
id="languageFilter"
onchange="filterLanguage()"
style="padding:6px; margin-bottom:10px; width:100%;">

<option value="all">🌎 All Languages</option>

<option value="1">Spanish</option>
<option value="2">English</option>
<option value="3">Italian</option>
<option value="4">French</option>
<option value="5">Portuguese</option>
<option value="6">German</option>
<option value="7">Polish</option>
<option value="8">Ukrainian</option>
<option value="9">Russian</option>
<option value="10">Dutch</option>
<option value="11">Romanian</option>
<option value="12">Greek</option>
<option value="13">Croatian</option>
<option value="14">Indonesian</option>
<option value="15">Albanian</option>
<option value="16">Swedish</option>
<option value="17">Finnish</option>
<option value="18">Armenian</option>
<option value="19">Afrikaans</option>
<option value="20">Turkish</option>
<option value="21">Thai</option>
<option value="22">Urdu</option>
<option value="23">Arabic</option>
<option value="24">Persian</option>
<option value="25">Punjabi-Pakistan</option>
<option value="26">Bengali</option>
<option value="27">Hungarian</option>
<option value="28">Serbian</option>
<option value="29">Pangasinan</option>
<option value="30">Korean</option>
<option value="31">Filipino</option>
<option value="32">Vietnamese</option>
<option value="33">Macedonian</option>
<option value="34">Lombard</option>
<option value="35">Belarusian</option>
<option value="36">Bosnian</option>
<option value="37">Estonian</option>
<option value="38">Slovenian</option>
<option value="39">Slovak</option>
<option value="41">Lithuanian</option>
<option value="42">Punjabi-India</option>
<option value="43">Japanese</option>
<option value="44">Chinese</option>
<option value="45">Hindi</option>
<option value="46">Hebrew</option>
<option value="47">Nepali</option>
<option value="48">Malay</option>
<option value="49">Czech</option>
<option value="50">Danish</option>
<option value="51">Norwegian</option>
<option value="52">Irish</option>
<option value="53">Bulgarian</option>
<option value="54">Swahili</option>
<option value="55">Tamil</option>
<option value="56">Burmese</option>
<option value="57">Amharic</option>
<option value="58">Latin</option>
<option value="59">Hausa</option>
<option value="60">Yoruba</option>
<option value="61">Telugu</option>
<option value="62">Kurdish</option>
<option value="63">Zulu</option>
<option value="64">Mongolian</option>
<option value="65">Pashto</option>
<option value="66">Sundanese</option>
<option value="67">Catalan</option>

</select>

<h3 id="videoTitle"></h3>

<div
id="counter"
style="color:#555; margin-bottom:10px;">
</div>

<iframe
id="player"
width="100%"
height="420"
frameborder="0"
allowfullscreen>
</iframe>

<div style="margin-top:10px;">

<button onclick="firstVideo()">⏮ First</button>

<button onclick="previousVideo()">⟵ Previous</button>

<button onclick="nextVideo()">Next ⟶</button>

<button onclick="lastVideo()">Last ⏭</button>

<button onclick="randomVideo()">🎲 Random</button>

</div>

<div style="margin-top:15px;">

<input
type="text"
id="searchBox"
placeholder="Search video..."
style="padding:6px; width:70%;">

<button onclick="searchVideo()">Search</button>

</div>

</div>

<script>

let videos = [];
let filteredVideos = [];
let current = 0;

const JSON_URL =
"https://raw.githubusercontent.com/leftnright1260-source/lista-posts/main/VIDEOS.json";

async function loadVideos(){

try{

const response =
await fetch(JSON_URL);

videos =
await response.json();

filteredVideos = videos;

let r =
Math.floor(
Math.random()
* filteredVideos.length
);

showVideo(r);

}
catch(error){

alert("Error loading JSON");

console.error(error);

}

}

function showVideo(i){

current = i;

if(current < 0){

current =
filteredVideos.length -1;

}

if(current >= filteredVideos.length){

current = 0;

}

const v =
filteredVideos[current];

document.getElementById("player").src =
"https://www.youtube.com/embed/" + v.id;

document.getElementById("videoTitle").innerHTML =
v.titulo;

document.getElementById("counter").innerHTML =
"Video "
+ (current+1)
+ " of "
+ filteredVideos.length;

}

function nextVideo(){

showVideo(current + 1);

}

function previousVideo(){

showVideo(current - 1);

}

function firstVideo(){

showVideo(0);

}

function lastVideo(){

showVideo(filteredVideos.length -1);

}

function randomVideo(){

let r =
Math.floor(
Math.random()
* filteredVideos.length
);

showVideo(r);

}

function searchVideo(){

let text =
document.getElementById("searchBox")
.value
.toLowerCase();

for(let i=0;i<filteredVideos.length;i++){

if(
filteredVideos[i]
.titulo
.toLowerCase()
.includes(text)
){

showVideo(i);

return;

}

}

alert("Video not found");

}

function filterLanguage(){

const language =
document.getElementById("languageFilter")
.value;

if(language === "all"){

filteredVideos = videos;

}
else{

filteredVideos =
videos.filter(
v => v.idioma == language
);

}

if(filteredVideos.length > 0){

showVideo(0);

}
else{

document.getElementById("videoTitle")
.innerHTML =
"No videos found";

document.getElementById("counter")
.innerHTML = "";

document.getElementById("player")
.src = "";

}

}

window.onload =
loadVideos;

</script>

</body>

</html>
