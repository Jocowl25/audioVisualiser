const audioMap = new Map();
const colorPallette=[
["#060647","#080896",(i)=>`rgb(105 25 ${(i/bufferLength) * 115+(255-115)})`],
["#fadb61","#b00202",(i)=>`rgb(${(i/bufferLength) * 15+(255-15)} 100 25)`],
["white","#11ff00",(i)=>`rgb(0 0 ${(i/bufferLength) * 115+(255-115)})`]
]
let colorOption=0
document.querySelector(".color").addEventListener("click",()=>
  {colorOption++
    colorOption=colorOption%colorPallette.length
  }
)
audioMap.set("Sample1.mp3","Sample1.mp3")
audioMap.set("Sample2.mp3","Sample2.mp3")
let audio=document.querySelector("audio")
let select=document.querySelector("select")
const fileInput = document.querySelector('input[type="file"]');
audio.play()
const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
source.connect(analyser);
source.connect(audioCtx.destination);
const bufferLength = analyser.frequencyBinCount;
const timeArray = new Uint8Array(bufferLength);
const freqArray = new Uint8Array(bufferLength);
const canvas=document.querySelector("canvas")
canvas.width=600;
canvas.height=300;
const w=canvas.width;
  const h=canvas.height;
const canvasCtx=canvas.getContext("2d");
document.querySelector(".fileButton").addEventListener("click",()=>fileInput.click())
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  canvasCtx.fillStyle = colorPallette[colorOption][0];
  canvasCtx.fillRect(0, 0, w, h);
  select.innerHTML=select.innerHTML+`<option>${file.name}</option>`
audio.src=url
audioMap.set(file.name, url);
select.value=file.name
});
let val=select.value
function draw(){
  if(val!=select.value){
  audio.src=audioMap.get(select.value)
  audio.play()
  val=select.value
  }
    if(!audio.paused){
      analyser.getByteFrequencyData(freqArray);
      analyser.getByteTimeDomainData(timeArray);
    }
    canvasCtx.fillStyle = colorPallette[colorOption][0];
    canvasCtx.fillRect(0, 0, w, h);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = colorPallette[colorOption][1];
    canvasCtx.beginPath();
let x=0
let skip=5
///////////////
///frequency///
///////////////
const barWidth = (w / bufferLength)*1.5*skip;
let barHeight;
x = 0;
for (let i = 0; i < bufferLength; i+=skip) {
    barHeight = freqArray[i];
    canvasCtx.fillStyle = colorPallette[colorOption][2](i);
    canvasCtx.fillRect(x, (h/2)-barHeight/2, barWidth, barHeight+1);
  
    x += (barWidth);
  }
  x = 0;  
  ////////
  //time//
  ////////
  let timeSkip=1
  const sw = (w / bufferLength)*timeSkip;
    for(let i=0;i<bufferLength;i+=timeSkip){
    const v = timeArray[i] / 128.0;
  const y = v * (h / 2);

  if (i === 0) {
    canvasCtx.moveTo(x, y);
  } else {
    canvasCtx.lineTo(x, y);
  }
  x += sw;
    }
    canvasCtx.lineTo(w, h);
    canvasCtx.stroke();
    canvasCtx.closePath();
    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)

