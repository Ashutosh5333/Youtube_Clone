import Navbar from "./components/Navbar.js";
let navbar = document.getElementById("navbar");
navbar.innerHTML = Navbar();



document.getElementById("logo").addEventListener("click", function () {
  location.href = "index.html";
});

let api_key = "AIzaSyBQZ-F1RTsMY7cNVGmDShioDwiP9Kn5Xtg"

let getData = async () => {
  try {
    let text = document.getElementById("search_bar").value;

    let response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&maxResults=20&q=${text}&key=${api_key}`
    );
    let data = await response.json();
    let actual_data = data.items;
    appendVideos(actual_data);
  } catch (err) {
    console.log("error :", err);
  }
};

let search_btn = document.getElementById("search_btn_div");
search_btn.addEventListener("click", getData);


var input = document.getElementById("search_bar");
input.addEventListener("keypress", function (e) {
  
  if (e.key === "Enter") {
    e.preventDefault();
    search_btn.click();
  }
});


function appendVideos(data) {
  document.getElementById("videos_container").innerHTML = "";
  data.forEach(({ snippet, id: { videoId } }) => {
    let div = document.createElement("div");

    let img = document.createElement("img");
    img.src = snippet.thumbnails.high.url;

    let title = document.createElement("p");
    title.innerText = snippet.title;

    let channel_title = document.createElement("p");
    channel_title.innerText = snippet.channelTitle;

    div.append(img, title, channel_title);
    document.getElementById("videos_container").append(div);

    div.onclick = () => {
      let data = {
        snippet,
        videoId,
      };
      localStorage.setItem("clickedVideo", JSON.stringify(data));
      location.href = "video.html";
    };
  });
}

//---------- Popular Video--------------

const getPopularVideos = async () => {
  try {
    let response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=20&regionCode=IN&key=${api_key}`
    );
    let data = await response.json();
    let actual_data = data.items;
    console.log(actual_data);
    appendPopularVideos(actual_data);
  } catch (err) {
    console.log(`Error : ${err}`);
  }
};

function appendPopularVideos(data) {
  document.getElementById("videos_container").innerHTML = "";
  data.forEach(({ snippet, id }) => {
    let div = document.createElement("div");

    let img = document.createElement("img");
    img.src = snippet.thumbnails.high.url;

    let title = document.createElement("p");
    title.innerText = snippet.title;

    let channel_title = document.createElement("p");
    channel_title.innerText = snippet.channelTitle;

    div.append(img, title, channel_title);
    document.getElementById("videos_container").append(div);

    div.onclick = () => {
      let data = {
        snippet,
        videoId: id,
      };
      localStorage.setItem("clickedVideo", JSON.stringify(data));
      location.href = "video.html";
    };
  });
}

window.onload = () => {
  if (sessionStorage.getItem("keyword") != null) {
    document.getElementById("search_bar").value =
      sessionStorage.getItem("keyword");
    getData();
    sessionStorage.removeItem("keyword");
  } else {
    getPopularVideos();
  }
};
