//colors
window.addEventListener("load", function () {
const colorPallette=[
["#060647","#0209d1",(i)=>`rgb(105 25 ${(i/FreqBufferLength) * 115+(255-115)})`],
["#fadb61","#b00202",(i)=>`rgb(${(i/FreqBufferLength) * 15+(255-15)} 100 25)`],
]
let colorOption=0
//set up list of default songs
const audioMap = new Map();
audioMap.set("Sample1.mp3","./Sample1.mp3")
audioMap.set("Sample2.mp3","./Sample2.mp3")
//set up select and file input
const select=document.querySelector("select")
const fileInput = document.querySelector('input[type="file"]');
//set up audio
const audio=document.querySelector("audio")
const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audio);
//set up analyser
const analyser = audioCtx.createAnalyser();
source.connect(analyser);
source.connect(audioCtx.destination);
//set up analyser arrays
const FreqBufferLength = analyser.frequencyBinCount;
const TimeBufferLength = analyser.fftSize;
const timeArray = new Uint8Array(TimeBufferLength);
const freqArray = new Uint8Array(FreqBufferLength);
//set up canvas
const canvas=document.querySelector("canvas")
canvas.width=600;
canvas.height=300;
const w=canvas.width;
const h=canvas.height;
const canvasCtx=canvas.getContext("2d");
canvasCtx.lineWidth = 2;
//set up document events
document.querySelector(".color").addEventListener("click",()=>
  {colorOption++
    colorOption=colorOption%colorPallette.length
  })
document.querySelector(".fileButton").addEventListener("click",()=>fileInput.click())
  fileInput.addEventListener('change', (event) => {
    for (const file of fileInput.files){
      const url = URL.createObjectURL(file);
      canvasCtx.fillStyle = colorPallette[colorOption][0];
      canvasCtx.fillRect(0, 0, w, h);
      select.innerHTML=`<option>${file.name}</option>`+select.innerHTML
      audio.src=url
      audioMap.set(file.name, url);
      select.value=file.name
    }
  })
//start
let val=select.value
requestAnimationFrame(draw)

function draw(){
  //set song
  if(val!=select.value){
  audio.src=audioMap.get(select.value)
  val=select.value
  }
  //pause visualizer if paused
    if(!audio.paused){
      analyser.getByteFrequencyData(freqArray);
      analyser.getByteTimeDomainData(timeArray);
    }
    //set up canvas colors
    canvasCtx.fillStyle = colorPallette[colorOption][0];
    canvasCtx.fillRect(0, 0, w, h);
let x=0
let skip=5
///////////////
///frequency///
///////////////
const barWidth = (w / FreqBufferLength)*1.5*skip;
let barHeight;
x = 0;
for (let i = 0; i < FreqBufferLength; i+=skip) {
    barHeight = freqArray[i];
    canvasCtx.fillStyle = colorPallette[colorOption][2](i);
    canvasCtx.fillRect(x, (h/2)-barHeight/2, barWidth, barHeight+1);
  
    x += (barWidth);
  }
  canvasCtx.strokeStyle = colorPallette[colorOption][1];
  canvasCtx.beginPath();
  x = 0;  
  ////////
  //time//
  ////////
  let timeSkip=1
  const sw = (w / TimeBufferLength)*timeSkip;
    for(let i=0;i<TimeBufferLength;i+=timeSkip){
    const v = timeArray[i] / 128.0;
  const y = v * (h / 2);

  if (i === 0) {
    canvasCtx.moveTo(x, y);
  } else {
    canvasCtx.lineTo(x, y);
  }
  x += sw;
    }
    canvasCtx.stroke();
    canvasCtx.closePath();
    requestAnimationFrame(draw)
}
})


