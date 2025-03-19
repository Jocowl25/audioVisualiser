let audio=document.querySelector("audio")
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
const canvasCtx=canvas.getContext("2d");
function draw(){
    if(audio.paused){
        requestAnimationFrame(draw)
        return;
    }
    const w=600;
    const h=300;
    analyser.getByteFrequencyData(freqArray);
    analyser.getByteTimeDomainData(timeArray);
    canvasCtx.fillStyle = "#b1d4e6";
    canvasCtx.fillRect(0, 0, w, h);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "#601ec9";
    canvasCtx.beginPath();
    const sw = w / bufferLength;
    let x = 0;  
    for(let i=0;i<bufferLength;i+=2){
    const v = timeArray[i] / 128.0;
  const y = v * (h / 4);

  if (i === 0) {
    canvasCtx.moveTo(x, y);
  } else {
    canvasCtx.lineTo(x, y);
  }
  x += sw;
    }
    canvasCtx.lineTo(w, h / 2);
    canvasCtx.stroke();

    for(let i=0;i<bufferLength;i+=2){
        const v = freqArray[i] / 128.0;
      const y = v * (h / 2);
    
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sw;
        }
        canvasCtx.lineTo(w, h / 2);
        canvasCtx.stroke();
    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)

