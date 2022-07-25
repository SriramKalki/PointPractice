const videoElement = document.getElementsByClassName('input_video')[0];
    const canvasElement = document.getElementsByClassName('output_canvas')[0];
    const rectangleElement = document.getElementsByClassName('rectangle')[0];
    const canvasCtx = canvasElement.getContext('2d');
    const rectCtx = rectangleElement.getContext('2d');
    
    var automatic = true;
    var indexX = 0;
    var indexY = 0;
    var leftX = 100 + Math.floor(Math.random() * 800);
    var leftY = Math.floor(Math.random() * 500);
    var checkTime = 0;
    var good = 0;
    var bad = 0;
    var correct = false;
    var newRect = true;
    var buffer = 0;
    

    function pressZ(opacityString){
        var pressZ = document.getElementById("pressZ");
        pressZ.style.opacity = opacityString

    }
    function draw(color){

        rectCtx.clearRect(0, 0, 1280, 720);

        const rectWidth = 50
        const rectHeight = 30
        
        leftX = 100 + Math.floor(Math.random() * 800);
        leftY = 100 + Math.floor(Math.random() * 400);

        rectCtx.beginPath();
        rectCtx.lineWidth = "6";
        rectCtx.strokeStyle = color;
        rectCtx.rect(leftX, leftY, rectWidth, rectHeight);
        rectCtx.stroke();
        return leftX, leftY
    }

    function check(indexX,indexY){
        const rectWidth = 50
        const rectHeight = 30

        if(indexX >= leftX && indexX <= leftX + rectWidth && indexY >= leftY && indexY <= leftY + rectHeight){
            rectCtx.clearRect(0, 0, 1280, 720);
            rectCtx.beginPath();
            rectCtx.lineWidth = "6";
            var color = 'red'
            if(checkTime >= 50){
                if(good/checkTime >= 0.4) {color = 'green'; correct = true;}

                checkTime = 0
                good = 0
                bad = 0
            }
            rectCtx.strokeStyle = color;
            rectCtx.rect(leftX, leftY, rectWidth, rectHeight);
            rectCtx.stroke();
            return true;
        }else{
            rectCtx.clearRect(0, 0, 1280, 720);
            rectCtx.beginPath();
            rectCtx.lineWidth = "6";
            rectCtx.strokeStyle = 'red';
            rectCtx.rect(leftX, leftY, rectWidth, rectHeight);
            rectCtx.stroke();
            return false;
        }
    }
    function onResults(results) {
      
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
          results.image, 0, 0, canvasElement.width, canvasElement.height);
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {

            indexX = landmarks[8].x * 1280
            indexY = landmarks[8].y * 720

            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                {color: '#00FF00', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
            
            if(newRect) checkTime = 0
            
            if(correct){
                if(automatic){
                    buffer++;

                    if(buffer >= 20){
                        draw("red")
                        newRect = true;
                        correct = false;
                        pressZ("0")
                        buffer = 0
                    }
                    
                }else{
                    pressZ("1"); 
                }
                continue
            }

            if(check(indexX,indexY)){
                console.log(good + " " + bad + " " + checkTime + " " + newRect)    
                good++;
                checkTime++;
                newRect = false
            }else {
                if(!newRect){bad++; checkTime++;}
                
            }
            
            
         
        }
      }
      
      canvasCtx.restore();
    }
    
    const hands = new Hands({locateFile: (file) => {
      
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    hands.onResults(onResults);
    
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({image: videoElement});
      },
      width: 1280,
      height: 720
    });
    camera.start();

    draw('red') //need to call it once at the start

    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'z':
                
                draw("red")
                newRect = true;
                correct = false;
                pressZ("0")
                break
        }
    })
 
