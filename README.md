# Distant Bot App

Remote Control Software for autonomous robot navigation and control - A comprehensive web-based control system for robotic corn planting automation.

## Overview

This project is a web-based remote control system designed for an autonomous agricultural robot (Auto Corn Plant). It provides real-time robot control, GPS navigation, video streaming, and autonomous operation modes through a modern web interface.

## Features

- **Multiple Control Modes**
  - Manual Mode: Direct robot control via web interface
  - Semi-Automatic Mode: GPS-assisted navigation with manual supervision
  - Automatic Mode: Fully autonomous operation
  - GPS Mode: GPS-based navigation
  - Map Mode: Map-based route planning and control

- **Real-time Monitoring**
  - Robot status monitoring
  - GPS position tracking
  - MCU (Microcontroller) connectivity status
  - Live video streaming via FFmpeg

- **Robot Control**
  - Forward/Backward movement
  - Left/Right rotation
  - Speed control (PWM-based motor control)
  - Emergency stop functionality

- **Navigation**
  - GPS-based positioning
  - Google Maps integration
  - Heading and orientation tracking
  - PID controller for precise navigation

- **Sensors Integration**
  - GPS module
  - Gyroscope
  - Accelerometer
  - Barometer
  - Motion sensors

## Technology Stack

### Frontend
- **Angular Material** (v1.0.0-rc1) - UI components and layout
- **AngularJS** (v1.4.7) - Web application framework
- **Google Maps API** - Map visualization and GPS tracking
- **HTML5/CSS3** - Modern web interface

### Backend
- **Meteor** - Full-stack JavaScript platform
- **Node.js** - Server-side runtime
- **Johnny-Five** (v0.9.39) - JavaScript robotics framework
- **FFmpeg** - Video streaming
- **rtsp-ffmpeg** (v0.0.10) - RTSP stream handling

### Additional Libraries
- **pid-controller** (v1.0.3) - PID control algorithm
- **jimp** (v0.2.21) - Image processing
- **color-convert** (v1.0.0) - Color space conversions

## Project Structure

```
distant-bot-app/
├── prototype/              # HTML/CSS/JS prototype interface
│   ├── index.html         # Main prototype UI
│   ├── index.js           # Angular controller and Google Maps initialization
│   ├── index.css          # Styling
│   └── icon/              # UI icons
├── webapp/
│   └── distant-bot-app/   # Meteor application
│       ├── client/        # Client-side code
│       ├── server/        # Server-side code
│       │   ├── board.js   # Johnny-Five board and motor setup
│       │   ├── method.js  # Meteor methods for robot control
│       │   ├── rtsp.js    # Video streaming
│       │   └── pid-controller-utils.js  # Navigation algorithms
│       ├── model/         # Data models
│       └── packages.json  # NPM dependencies
├── ffmpeg-command.txt     # FFmpeg streaming commands
└── README.md              # This file
```

## Hardware Requirements

- Arduino-compatible microcontroller board
- Motor driver (PWM-capable)
- DC motors (left and right)
- GPS module
- IMU (Inertial Measurement Unit) with:
  - Gyroscope
  - Accelerometer
  - Barometer
- Webcam or camera module (for video streaming)

## Installation

### Prerequisites
- Node.js and NPM
- Meteor framework
- Arduino IDE (for microcontroller programming)
- FFmpeg (for video streaming)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/pacozaa/distant-bot-app.git
   cd distant-bot-app
   ```

2. **Install Meteor** (if not already installed)
   
   Visit [https://www.meteor.com/install](https://www.meteor.com/install) for installation instructions, or use:
   ```bash
   curl https://install.meteor.com/ | sh
   ```
   Note: Review the installation script before running if you have security concerns.

3. **Install dependencies**
   ```bash
   cd webapp/distant-bot-app
   meteor npm install
   ```

4. **Configure hardware**
   - Connect Arduino board via USB
   - Ensure proper pin connections for motors (PWM: pin 4, DIR: pin 50, CDIR: pin 51)
   - Connect sensors to appropriate pins

5. **Start the application**
   ```bash
   meteor run
   ```

6. **Access the interface**
   - Open browser and navigate to `http://localhost:3000`

## Video Streaming Setup

The application supports video streaming using FFmpeg. Example commands are provided in `ffmpeg-command.txt`:

### For 320x240 resolution at 5 fps:
```bash
ffmpeg -f dshow -i video="Lenovo EasyCamera" -vcodec mpeg4 -r 5 -vf scale=320:240 -tune fastdecode -preset ultrafast -f mpegts udp://localhost:1234/1234
```

### For 160x120 resolution at 5 fps (low latency):
```bash
ffmpeg -f dshow -i video="Lenovo EasyCamera" -vcodec mpeg4 -r 5 -vf scale=160:120 -tune zerolatency -preset ultrafast -f mpegts udp://localhost:1234/1234
```

Replace `"Lenovo EasyCamera"` with your camera device name.

## Usage

1. **Start the Robot**
   - Click the "START" button to initialize the robot
   - Check status indicators for Robot, GPS, and MCU connectivity

2. **Select Control Mode**
   - Use the rotary switch to select desired mode:
     - STATUS: View current status
     - MAN: Manual control
     - SEMI: Semi-automatic with GPS assist
     - AUTO: Fully autonomous operation
     - GP: GPS mode
     - MAP: Map-based control

3. **Manual Control**
   - Use directional buttons (GO, BACK, LEFT, RIGHT)
   - Click STOP for emergency stop

4. **Autonomous Operation**
   - Set waypoints on the map (in MAP mode)
   - Switch to AUTO mode
   - Robot will navigate autonomously using GPS and sensors

## Screenshots

- `gr-without-videostream.PNG` - Interface without video stream
- `indi-without-video-stream.PNG` - Alternative interface view

## Development

This project was developed as a final year project for autonomous agricultural robot control. It demonstrates the integration of web technologies with robotics hardware for real-world applications.

## Future Improvements

- Enhanced image processing for plant detection
- Path planning algorithms
- Multi-robot coordination
- Mobile responsive interface
- WebRTC for lower latency video streaming

## License

This project is available as-is for educational purposes.

## Author

Created by pacozaa

## Acknowledgments

- Johnny-Five community for robotics framework
- Meteor Development Group for the full-stack platform
- Google for Maps API integration
