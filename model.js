
  // Declare global variables
  let classifier;        // This will hold the Teachable Machine image classifier
  let video;             // This will hold the video feed from the webcam
  let label = "Waiting..."; // Initial label while waiting for predictions
  let emoji = "❓";       // Emoji to show based on prediction

  // Teachable Machine model URL (replace if using a different model)
  const modelURL = 'https://teachablemachine.withgoogle.com/models/7lCGQ6pvI/';

  // Runs once when the page loads
  function setup() {
    createCanvas(640, 480);             // Create canvas for video display
    video = createCapture(VIDEO);       // Access webcam
    video.size(640, 480);               // Set webcam size
    video.hide();                       // Hide raw video (we draw it ourselves)

    // Load the image classifier model from Teachable Machine
    classifier = ml5.imageClassifier(modelURL + "model.json", () => {
      console.log("✅ Model loaded successfully");
      classifyVideo(); // Start classifying once the model is loaded
    });
  }

  // Continuously classify the current video frame
  function classifyVideo() {
    classifier.classify(video, gotResult);
  }

  // Runs repeatedly to draw content on canvas
  function draw() {
    background(0);        // Black background
    image(video, 0, 0);   // Draw webcam video feed

    // Set up text styling
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text(label, width / 2, height - 16);  // Display the label at the bottom

    if (label === "Smile") {
      emoji = "😊";
      displayLabel = "Smile";
    } else if (label === "No Smile") {
      emoji = "😐";
      displayLabel = "No Smile";
    } else {
      emoji = "❓";
      displayLabel = label;
    }
    textSize(64);
    text(emoji, width / 2, 40); // Show emoji at the top center
  }

  // Called when classification results are available
  function gotResult(error, results) {
    if (error) {
      console.error(error);
      return;
    }

    console.log(results);
    if (results[0].confidence < 0.3) {
      label = "Uncertain";
    } else {
      label = results[0].label;
    }
  
    classifyVideo();
  }