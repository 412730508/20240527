/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

MoveNet is developed by TensorFlow:
https://www.tensorflow.org/hub/tutorials/movenet

*/

let video, bodypose, pose, keypoint, detector;
let poses = [];
let img; // 用於存放您的物件圖片
let studentID = "412730508";
let studentName = "范翔宇";

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
      //flipHorizontal: true,
    });
  }
  requestAnimationFrame(getPoses);
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  await init();
  
  img = loadImage('upload_bc549284c3544930bf04fef1eb154c5d.gif'); // 加載您的物件圖片
  
  stroke(255);
  strokeWeight(5);
}

function draw() {
  image(video, 0, 0);
  drawSkeleton();
  // flip horizontal
  cam = get();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);
}

function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];

    // shoulder to wrist
    for (let j = 5; j < 9; j++) {
      if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
        let partA = pose.keypoints[j];
        let partB = pose.keypoints[j + 2];
        line(partA.x, partA.y, partB.x, partB.y);
      }
    }

    // shoulder to shoulder
    let partA = pose.keypoints[5];
    let partB = pose.keypoints[6];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y);
    }

    // hip to hip
    partA = pose.keypoints[11];
    partB = pose.keypoints[12];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y);
    }

    // draw objects on eyes
    let leftEye = pose.keypoints[1];
    let rightEye = pose.keypoints[2];
    if (leftEye.score > 0.1) {
      image(img, leftEye.x - 25, leftEye.y - 25, 50, 50);
    }
    if (rightEye.score > 0.1) {
      image(img, rightEye.x - 25, rightEye.y - 25, 50, 50);
    }

    // draw objects on shoulders
    let leftShoulder = pose.keypoints[5];
    let rightShoulder = pose.keypoints[6];
    if (leftShoulder.score > 0.1) {
      image(img, leftShoulder.x - 25, leftShoulder.y - 25, 50, 50);
    }
    if (rightShoulder.score > 0.1) {
      image(img, rightShoulder.x - 25, rightShoulder.y - 25, 50, 50);
    }

    // draw text above head
    let nose = pose.keypoints[0];
    if (nose.score > 0.1) {
      fill(255, 0, 0);
      textSize(20);
      textAlign(CENTER);
      text(`${studentID} ${studentName}`, nose.x, nose.y - 50);
    }

    // shoulders to hips
    partA = pose.keypoints[5];
    partB = pose.keypoints[11];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y);
    }
    partA = pose.keypoints[6];
    partB = pose.keypoints[12];
    if (partA.score > 0.1 && partB.score > 0.1) {
      line(partA.x, partA.y, partB.x, partB.y);
    }

    // hip to foot
    for (let j = 11; j < 15; j++) {
      if (pose.keypoints[j].score > 0.1 && pose.keypoints[j + 2].score > 0.1) {
        partA = pose.keypoints[j];
        partB = pose.keypoints[j + 2];
        line(partA.x, partA.y, partB.x, partB.y);
      }
    }
  }
}

/* Points (view on left of screen = left part - when mirrored)
  0 nose
  1 left eye
  2 right eye
  3 left ear
  4 right ear
  5 left shoulder
  6 right shoulder
  7 left elbow
  8 right elbow
  9 left wrist
  10 right wrist
  11 left hip
  12 right hip
  13 left kneee
  14 right knee
  15 left foot
  16 right foot
*/
