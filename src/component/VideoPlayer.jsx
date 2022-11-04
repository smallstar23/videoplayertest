
import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import theme from '../theme/theme';
import VideoController from './VideoController';


let count = 0; 

const VideoPlayer = ()=>{
  const httpUrl= 'https://www.youtube.com/watch?v=_q9TPzEXHvU';
  const chapters= [
    {
        "id": 1360,
        "chapterTitle": 'chapterTitle1',
        "value": 30,
        "chapterUrl": 'https://picsum.photos/500/500'
    },
    {
        "id": 1361,
        "chapterTitle": 'chapterTitle2',
        "value": 120,
        "chapterUrl": 'https://picsum.photos/500/500'
    }
];

  const useStyles= {
    playerWrapper: {
      width: '100%',
      position: 'relative',
    },

    controlsWrapper: {
      position:'absolute',
      top:0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 
      'linear-gradient(to bottom, rgba(20, 20, 20, 0) 30%, rgba(20, 20, 20, 0.25) 60%, rgba(20, 20, 20, 0.5) 70%, rgba(20, 20, 20, 0.75) 90%, rgba(20, 20, 20, 1) 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent:'space-between',
      zIndex: 1,
      opacity: 0
    },
    controlIcons:{
      color: '#777',
      fontSize: 50,
      transform: 'scale(0.9)',
      '&:hover':{
        color: '#fff',
        transform: 'scale(1)'
      }
    },
    textStyle:{
      color:'#fff',
    },
    playspeedBtn:{
      color: '#777',
      fontSize: 50,
      transform: 'scale(0.9)',
      '&:hover':{
        color: '#7950f2',
        transform: 'scale(1)'
      }
    },
    chapterControls:{
      color: 'black',
      backgroundColor: theme.palette.primary.light,
      fontSize: 50,
      transform: 'scale(0.9)',
      '&:hover':{
        color: 'white',
        backgroundColor: theme.palette.primary.light,
        transform: 'scale(1)'
      }
    },
    cardWapper:{
      color: '#777',
      width:'500px',
      alignContent:'space-around',
      marginBottom:'20px',
      flexDirection: 'column',
      '&:hover':{
        color: '#7950f2',
        transform: 'scale(1)'
      }
    },

  };
  // const classes=useStyles();


  // common fn
  const format = (seconds) =>{
    if(isNaN(seconds)){
      return '00:00'
    }

    const date= new Date(seconds * 1000);
    const hh= date.getUTCHours();
    const mm= date.getUTCMinutes();
    const ss= date.getUTCSeconds().toString().padStart(2, '0');
    if(hh){
      return `${hh}:${mm.toString().padStart(2,'0')}:${ss}`
    }

    return `${mm}:${ss}`


  }

  // states
  const [state, setState]= useState({
    playing: true,
    muted: false,
    volume: 0.2,
    playbackRate: 1,
    played: 0,
    seeking:false
  });


  const [timeDisplayFormat, setTimeDisplayFormat] = useState('normal')

  const {playing, muted, volume, playbackRate, played, seeking}= state;

  const handlePlayPause= ()=>{
    setState({...state, playing:!state.playing})

  }

  // refs

  const playerRef= useRef();
  const playerContainerRef= useRef();
  const controlsRef= useRef();

  const handleRewind= ()=>{
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
  };

  const handleFastForward= ()=>{
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)
  }


  // mute

  const handleMute= ()=>{
    setState({...state, muted:!state.muted, volume: muted===false?0:0.2})
  }

  // volume

  const onVolumeChange= (e, newValue )=>{
    setState({...state, volume:parseFloat(newValue/ 100),
      muted: newValue === 0? true: false,
    })

  }

  const onVolumeSeekUp= (e, newValue )=>{
    setState({...state, volume:parseFloat(newValue/ 100),
      muted: newValue === 0? true: false,
    })

  }


  // play speed 
  const onPlaybackRateChange= (rate)=>{
    setState({...state, playbackRate: rate})

  }

  // full screen

  const toggleFullScreen= ()=>{
    screenfull.toggle(playerContainerRef.current)
  }


  // pregress

  const handleProgress= (changeState) =>{
    
    if(count>1){
      controlsRef.current.style.visibility='hidden';
      count=0
    }
    if (controlsRef.current.style.visibility==='visible'){
      count +=1;
    }
    if(!state.seeking){
      setState({...state, ...changeState})
    }
  }


  const handleSeekChange= (e, newValue) => {
    setState({...state, played: parseFloat(newValue / 100)})
  };

  const handleSeekMouseDown = (e) =>{
    setState({...state, seeking: true})
  };

  const handleSeekMouseUp= (e, newValue) =>{
    setState({...state, seeking: false});
    playerRef.current.seekTo(newValue/ 100);
  };


  const currentTime= playerRef.current? playerRef.current.getCurrentTime(): '00:00';
  const duration= playerRef.current? playerRef.current.getDuration(): '00:00';

  console.log(duration)
  
  const intCurrentTime= parseInt(playerRef.current? playerRef.current.getCurrentTime():0);


  const elapsedTime= timeDisplayFormat==='normal'? format(currentTime): `-${format(duration -currentTime)}`;
  const totalDuration= format(duration);


  const handleChangeDisplayFormat = ()=>{
    setTimeDisplayFormat(timeDisplayFormat==='normal'? 'remaining': 'normal')
  }


  const handleMouseMove= ()=>{
    controlsRef.current.style.visibility='visible';
    controlsRef.current.style.opacity='1'
    controlsRef.current.style.transition='all 2s'
    count= 0
  };

  // chapter 이동

  const chapterMoveFn=(item)=>{
    let newValue= item.value;
    playerRef.current.seekTo(newValue/ 100);

    setState({...state, playing: true, played: parseFloat(newValue / 100)})
  }



  

  return (
    <>
      <div 
        className='wapper'
        ref={playerContainerRef} 
        style={useStyles.playerWrapper}
        // className={classes.playerWrapper}
        onMouseMove={handleMouseMove}
        onMouseLeave={()=>{controlsRef.current.style.opacity='0'}}
      >
        <ReactPlayer
          ref={playerRef}
          url={httpUrl}
          width='100%'
          height='800px'
          muted={muted}
          playing={playing}
          volume={volume}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          
        />

        <VideoController
          ref={controlsRef}
          classes={useStyles}
          onPlayPause={handlePlayPause}
          playing={playing}
          handleRewind={handleRewind}
          handleFastForward={handleFastForward}
          muted={muted}
          onMute={handleMute}
          onVolumeChange={onVolumeChange}
          onVolumeSeekUp={onVolumeSeekUp}
          volume={volume}
          playbackRate={playbackRate}
          onPlaybackRateChange={onPlaybackRateChange}
          onToggleFullScreen= {toggleFullScreen}
          played={played}
          onSeek={handleSeekChange}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekMouseUp={handleSeekMouseUp}
          elapsedTime={elapsedTime}
          intCurrentTime={intCurrentTime}
          duration={duration}
          totalDuration={totalDuration}
          onChangeDisplayFormat= {handleChangeDisplayFormat}
          chapterMoveFn={chapterMoveFn}
          chapters={chapters}

        />
      </div>
      
    </>
  )
}

export default VideoPlayer;