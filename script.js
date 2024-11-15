const micBtn = document.getElementById("mic");
const playback = document.querySelector(".playback");
const downloadLink = document.getElementById("download-link");
let mic = document.querySelector(".mic-toggle");

micBtn.addEventListener("click", ToggleMic);

let can_record = false;
let is_recording = false;
let recorder = null;
let chunks = [];

function SetupAudio() {
  console.log("Setup"); //logs setup
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //checks for webrtc api
    //requests audio access
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      //catch errors
      .then(SetupStream)
      .catch((err) => {
        console.error(err);
      });
  }
}
SetupAudio();

function SetupStream(stream) {
  recorder = new MediaRecorder(stream);
  //create audio chunk data to turn into blob later
  recorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  recorder.onstop = (e) => {
    const blob = new Blob(chunks, { type: "audio/webm" });
    chunks = []; //make chunks into an empty array again because we made the blob
    const audioURL = window.URL.createObjectURL(blob);
    playback.src = audioURL; //playback and download
    //download link
    downloadLink.href = audioURL;
    downloadLink.download = "quickMemoRecording.webm";
    console.log(blob.type); // Check the type of the recorded audio
  };

  can_record = true;
}

function ToggleMic() {
  if (!can_record) return;

  is_recording = !is_recording;

  if (is_recording) {
    recorder.start();
  } else {
    recorder.stop();
  }
}

mic.addEventListener("click", function () {
  mic.classList.toggle("listening");
});
