/* eslint-disable prettier/prettier */
import requestCameraAndAudioPermission from './permission';
import React, {Component} from 'react';
import {
  View,
  NativeModules,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {RtcEngine, AgoraView} from 'react-native-agora';
import styles from './Style';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const {Agora} = NativeModules; //Define Agora object as a native module

const {FPS30, AudioProfileDefault, AudioScenarioDefault, Adaptative} = Agora; //Set defaults for Stream

const config = {
  //Setting config of the app
  appid: '06b4058077b440f199426760a37f5ef4', //Enter the App ID generated from the Agora Website
  channelProfile: 0, //Set channel profile as 0 for RTC
  videoEncoderConfig: {
    //Set Video feed encoder settings
    width: 720,
    height: 1080,
    bitrate: 1,
    frameRate: FPS30,
    orientationMode: Adaptative,
  },
  audioProfile: AudioProfileDefault,
  audioScenario: AudioScenarioDefault,
};

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peerIds: [], //Array for storing connected peers
      buttons: this.buttonsBeforeCall,
      uid: Math.floor(Math.random() * 100), //Generate a UID for local user
      appid: config.appid,
      channelName: 'channel-x', //Channel Name for the current session
      joinSucceed: false, //State variable for storing success
      timeEnded: false, //State variable to figure out if 30s has passed
      timer: 10, // Countdown someone sees on their screen
      extended: false // if someone extends the timer, there should be no interval.
    };
    if (Platform.OS === 'android') {
      //Request required permissions from Android
      requestCameraAndAudioPermission().then((_) => {
        console.log('requested!');
      });
    }
  }
  componentDidMount() {
    RtcEngine.on('userJoined', (data) => {
      const {peerIds} = this.state; //Get currrent peer IDs
      if (peerIds.indexOf(data.uid) === -1) {
        //If new user has joined
        this.setState({
          peerIds: [...peerIds, data.uid], //add peer ID to state array
        });
      }
    });
    RtcEngine.on('userOffline', (data) => {
      //If user leaves
      this.setState({
        peerIds: this.state.peerIds.filter((uid) => uid !== data.uid), //remove peer ID from state array
      });
    });
    RtcEngine.on('joinChannelSuccess', (data) => {
      //If Local user joins RTC channel
      RtcEngine.startPreview(); //Start RTC preview
      this.setState({
        joinSucceed: true, //Set state variable to true
        buttons: this.buttonsDuringCall
      });

    });
    this.interval = setInterval(
      () => {
        this.setState((prevState)=> ({ timer: prevState.timer - 1 }))
        if(this.state.timer <= 0) {
          this.setTimePassed();
        }
      },
      1000
    );
    RtcEngine.init(config); //Initialize the RTC engine
  }

  /**
   * @name startCall
   * @description Function to start the call
   */
  startCall = () => {
    RtcEngine.joinChannel(this.state.channelName, this.state.uid); //Join Channel
    RtcEngine.enableAudio(); //Enable the audio
    console.log("START")
    this.setState({
      timer: 10
    });
  };

  componentDidUpdate(){
    if(this.state.timer === 10){
      clearInterval(this.interval);
      this.interval = setInterval(
        () => {
          this.setState((prevState)=> ({ timer: prevState.timer - 1 }))
          if(this.state.timer <= 0) {
            this.setTimePassed();
          }
        },
        1000
      );
    }
  }

  /**
   * @name endCall
   * @description Function to end the call
   */
  endCall = () => {
    RtcEngine.leaveChannel();
    this.setState({
      peerIds: [],
      joinSucceed: false,
      timer: 10,
      buttons: this.buttonsBeforeCall,
    });
  };

  extendedCall = () => {
    this.setState({
      extended: true
    });
    clearInterval(this.interval);
  }

  /**
   * @name setTimePassed
   * @description Function to start the timer
   */
  setTimePassed() {
    this.setState({timeEnded: true});
    RtcEngine.leaveChannel();
    this.setState({
      peerIds: [],
      joinSucceed: false,
      timer: 10,
      buttons: this.buttonsBeforeCall
    });
  }

  buttonsBeforeCall = [
    <TouchableOpacity
    title="Start Call"
    onPress={this.startCall}
    style={styles.button}>
    <Text style={styles.buttonText}> Start Call </Text>
  </TouchableOpacity>,
  ]

  buttonsDuringCall = [
  <TouchableOpacity
    title="End Call"
    onPress={this.endCall}
    style={styles.button}>
    <Text style={styles.buttonText}> End Call </Text>
  </TouchableOpacity>,
    <TouchableOpacity
    title="End Call"
    onPress={this.extendedCall}
    style={styles.button}>
    <Text style={styles.buttonText}> Extend Call </Text>
  </TouchableOpacity>,
  ]

  config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };


  /**
   * @name videoView
   * @description Function to return the view for the app
   */
  videoView() {
    return (
      <View style={styles.max}>
        {
          <View style={styles.max}>
            <View style={styles.buttonHolder}>
            {this.state.buttons}
            </View>
            {!this.state.joinSucceed ? (
              <View />
            ) : (
            <GestureRecognizer onSwipeLeft={this.endCall} config={this.config}>
              <View style={styles.fullView}>
                {this.state.peerIds.length > 1 && !this.state.timeEnded ? ( //view for two videostreams
                  <View style={styles.full}>
                    <AgoraView
                      style={styles.full}
                      remoteUid={this.state.peerIds[0]}
                      mode={1}
                    />
                    <AgoraView
                      style={styles.full}
                      remoteUid={this.state.peerIds[1]}
                      mode={1}
                    />
                  <Text> {this.state.timer} </Text>
                  </View>
                ) : this.state.peerIds.length > 0 && !this.state.timeEnded ? ( //view for videostream
                  <View style={styles.fullView}>
                  <AgoraView
                    style={styles.full}
                    remoteUid={this.state.peerIds[0]}
                    mode={1}
                  />
                  <Text> {this.state.timer} </Text>
                </View>
                ) : (
                  <View>
                    <Text> {this.state.timer} </Text>
                    <Text style={styles.noUserText}> No users connected </Text>
                  </View>
                )}
                <AgoraView
                  style={styles.localVideoStyle}
                  zOrderMediaOverlay={true}
                  showLocalVideo={true}
                  mode={1}
                />
              </View>
              </GestureRecognizer>
            )}
          </View>
        }
      </View>
    );
  }
  render() {
    return this.videoView();
  }
}
export default Video;
