import Navbar from "./Components/Navbar.js";

let navbar = document.getElementById("navbar");
navbar.innerHTML = Navbar();

let search_btn = document.getElementById("search_btn_div");
search_btn.addEventListener("click", function () {
  location.href = "index.html";
  sessionStorage.setItem(
    "keyword",
    document.getElementById("search_bar").value
  );
});

// Get the input field
var input = document.getElementById("search_bar");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    search_btn.click();
  }
});

let videoData = JSON.parse(localStorage.getItem("clickedVideo"));

document.getElementById("logo").addEventListener("click", function () {
  location.href = "index.html";
});

function videoAppend({ snippet, videoId }) {
  let iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
  iframe.setAttribute("allowFullscreen", true);

  document.getElementById("iframe_div").append(iframe);

  document.getElementById("title").innerText = snippet.title;
  document.getElementById("channel_name").innerText = snippet.channelTitle;
}

async function getSuggestions(id) {
  try {
    let key = "AIzaSyBQZ-F1RTsMY7cNVGmDShioDwiP9Kn5Xtg";
    let response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&relatedToVideoId=${id}&type=video&videoEmbeddable=true&key=${key}`
    );
    let data = await response.json();
    let actual_data = data.items;
    appendSuggestions(actual_data);
  } catch (err) {
    console.log("Error :", err);
  }
}

function appendSuggestions(data) {
  data.forEach((el) => {
    let main_div = document.createElement("div");

    let img_div = document.createElement("div");
    let img = document.createElement("img");
    img.src = el.snippet.thumbnails.high.url;
    img_div.append(img);

    let detail_div = document.createElement("div");
    let title = document.createElement("h4");
    title.classList.add("sug_title");
    title.innerText = el.snippet.title;
    let channel_name = document.createElement("p");
    channel_name.innerText = el.snippet.channelTitle;

    detail_div.append(title, channel_name);
    main_div.append(img_div, detail_div);

    document.getElementById("rhs").append(main_div);

    let videoId = el.id.videoId;
    let snippet = el.snippet;
    main_div.onclick = () => {
      let obj = {
        snippet,
        videoId,
      };
      localStorage.setItem("clickedVideo", JSON.stringify(obj));
      window.location.reload();
    };
  });
}

window.onload = () => {
  videoAppend(videoData);
  getSuggestions(videoData.videoId);
};
