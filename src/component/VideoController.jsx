
import { forwardRef } from 'react';
import { Button, ButtonBase, Divider, Grid, IconButton, List, ListItem, ListItemText, Popover, Slider, Typography } from '@mui/material';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Tooltip from '@mui/material/Tooltip';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { useEffect } from 'react';
import commonFn from '../services/commonFunctions';
import VideoChapterBox from './VideoChapterBox';




const VideoController = forwardRef(({
  classes, 
  onPlayPause, 
  playing,
  handleRewind,
  handleFastForward,
  muted,
  onMute,
  onVolumeChange,
  onVolumeSeekUp,
  volume,
  playbackRate,
  onPlaybackRateChange,
  onToggleFullScreen,
  played,
  onSeek,
  onSeekMouseDown,
  onSeekMouseUp,
  elapsedTime,
  intCurrentTime,
  totalDuration,
  onChangeDisplayFormat,
  duration,
  chapterMoveFn,
  chapters,
  contentId,
  chapterEditBoxOpenFn,
  toggleTopBtns,
  btnSizeChange

}, ref)=>{

  const styleClasses= classes;

  // pop over (control speed)
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // pop over (chapters)
  const [anchorCH, setAnchorCH] = useState(null);

  const handleClickCH = (event) => {
    setAnchorCH(event.currentTarget);
  };

  const handleCloseCH = () => {
    setAnchorCH(null);
  };

  const openCH = Boolean(anchorCH);
  const idCH = openCH ? 'simple-popover' : undefined;

  // mute btn hover
  const [muteBtn, setMuteBtn]= useState(true);


  // chapter box
  const [openBox, setOpenBox] = useState(false);
  const toggleBoxFn= () =>{
    setOpenBox(!openBox)

  }

  // played int
  let playedInt= parseInt(played*100);



  // duration - played

  const newPlayedTime= ((played* duration) / duration) * 100;
  // chapter time duration

  console.log(duration)

  const marksChapterList=JSON.parse(JSON.stringify(chapters));
  for(let x=0; x<=marksChapterList.length-1; x++){
    marksChapterList[x].value=parseInt((marksChapterList[x].value / duration) * 100);
  }

  // title ext

  const [title, setTitle]=useState('view all chapters')



  const thumb=document.getElementsByClassName('MuiSlider-thumb');
  const thumbMakesSlowFn= async (thumb)=>{
    thumb[0].style.transition='left 1s linear'
  };

  const track= document.getElementsByClassName('MuiSlider-track');
  const trackMakesSlowFn = async (track) =>{
    track[0].style.transition='width 1s linear';
  }

  useEffect(()=>{

    trackMakesSlowFn(track)
    thumbMakesSlowFn(thumb)

    // track[0].addEventListener('click', ()=>{
    //   thumb[0].style.transition='';
    //   track[0].style.transition=''

    // })
  }, [])


  const getTitleFn = () =>{
    for(let x=0; x<=marksChapterList.length-1; x++){
      let presentValue=marksChapterList[x].value;
      let nextValue=marksChapterList[x+1]? marksChapterList[x+1].value : 100;
      if(presentValue===playedInt){
        setTitle(marksChapterList[x].chapterTitle)
        return;
      }else if(playedInt<presentValue){
        setTitle(marksChapterList[x-1]? marksChapterList[x-1].chapterTitle: 'view all chapters')
        return;
      }else if(presentValue<playedInt<nextValue){
        setTitle(marksChapterList[x]? marksChapterList[x].chapterTitle: 'view all chapters')
      }else{
        setTitle('view all chapters')
      }

    }
  }

  useEffect(()=>{
    getTitleFn();
  }, [playedInt])



  return (
    <div 
    style={styleClasses.controlsWrapper} 
    ref={ref} >
      {/* 상단 챕터 미리보기 */}
      <Grid container direction="row" alignItems="center" justifyContent="right" style={{paddingTop: '3%', paddingRight:'5%'}}>
        {toggleTopBtns && (
          <>
            <Grid item>
              <Tooltip title="View Chapters">
                <Button 
                  style={styleClasses.chapterControls} 
                  onClick={()=>{
                    toggleBoxFn();
                    handleCloseCH()
                  }} >
                  <ArrowDropDownIcon/>
                  <Typography variant="caption">
                      View Chapters
                  </Typography>
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Edit Chapters">
                <Button style={styleClasses.chapterControls} onClick={()=>{
                  chapterEditBoxOpenFn();
                }} >
                  <ArrowDropDownIcon/>
                  <Typography variant="caption">
                      Edit Chapters
                  </Typography>
                </Button>
              </Tooltip>
            </Grid>
          </>
        )}
      </Grid>

      {/* 중간부분 플레이 버튼들*/}


      <Grid container 
        className='center'
        direction="row" 
        alignItems="center" 
        justifyContent="center" 
        onClick={onPlayPause} 
        sx={{height:'100%'}}>

        <VideoChapterBox 
          openBox={openBox}
          toggleBoxFn={toggleBoxFn}
          chapters={chapters}
          marksChapterList={marksChapterList}
          chapterMoveFn={chapterMoveFn}
          contentId={contentId}
        />
      </Grid>

      {/* 하단 부분 */}

      <Grid container 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between" 
        style={{paddingLeft:35, paddingTop:16, paddingRight:35, paddingBottom:10}}>
        <Grid item xs={12}>

          <Slider 
            min={0}
            max={100}
            value={newPlayedTime}
            valueLabelDisplay='auto'
            onChange={onSeek}
            valueLabelFormat={()=>{return commonFn.format(intCurrentTime)}}
            onMouseDown={onSeekMouseDown}
            onChangeCommitted={onSeekMouseUp}
            marks={marksChapterList}
          />
        </Grid>
        <Grid item>
          <Grid container alignItems='center' direction='row'>
            <Tooltip title="-10 seconds">
              <IconButton style={styleClasses.controlIcons} onClick={handleRewind}>
                <FastRewindIcon fontSize={btnSizeChange}></FastRewindIcon>
              </IconButton>
            </Tooltip>
            <Tooltip title="play">
              <IconButton style={styleClasses.controlIcons} onClick={onPlayPause}>
                {playing? <PauseIcon fontSize={btnSizeChange}/>: <PlayArrowIcon fontSize={btnSizeChange}/>}
              </IconButton>
            </Tooltip>
            <Tooltip title='+10 seconds' onClick={handleFastForward}>
              <IconButton style={styleClasses.controlIcons}>
                <FastForwardIcon fontSize={btnSizeChange}></FastForwardIcon>
              </IconButton>
            </Tooltip>
            <ButtonBase onClick={onChangeDisplayFormat}>
              <Typography variant="body1"  style={styleClasses.textStyle}>
                {elapsedTime} / {totalDuration}
              </Typography>
            </ButtonBase>
            
            {'\u00A0'+'\u00A0'+'\u00A0'}
            <Tooltip title="view chapters">
              <ButtonBase 
                style={styleClasses.textStyle} 
                onClick={toggleBoxFn}>
                <ArrowRightIcon/>
                <Typography gutterBottom >
                  {title}
                </Typography>
              </ButtonBase>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems='center' direction='row'>
            <Tooltip title="mute">
              <IconButton width='fit-content' style={styleClasses.controlIcons} 
                onClick={onMute}>
                {muted? <VolumeOffIcon fontSize='small'/>: <VolumeUpIcon fontSize='small' />}
              </IconButton>
            </Tooltip>

            <Grid item width='100px'>
              <Slider style={{color: '#777'}}
                size='small'
                min={0}
                max={100}
                value={volume * 100}
                onChnage={onVolumeChange}
                onChangeCommitted={onVolumeSeekUp}
              />
            </Grid>
            {/* <Tooltip title="volume max">
              <IconButton width='fit-content' className={styleClasses.controlIcons}>
                <VolumeUpIcon fontSize='small' />
              </IconButton>
            </Tooltip> */}
                
            <Grid item>
              <Tooltip title="speed">
                <Button style={styleClasses.playspeedBtn} aria-describedby={id} onClick={handleClick}>
                  <Typography variant="caption">
                    {playbackRate}x
                  </Typography>
                </Button>
              </Tooltip>
            </Grid>
                
            <Grid item>
              <Tooltip title="full screen">
                <IconButton onClick={onToggleFullScreen} style={styleClasses.playspeedBtn}>
                  <FullscreenIcon />
                </IconButton>
              </Tooltip>
            </Grid>
                
          </Grid>
              
        </Grid>
              
      </Grid>

      {/* 재생속도 */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List>
          {[0.5, 1, 1.5, 2].map((speed, idx, arr)=>(
            <>
              <ListItem button style={styleClasses.playspeedBtn} onClick={()=>{
                onPlaybackRateChange(speed);
                handleClose()}}>
                <ListItemText>{speed}x</ListItemText>
              </ListItem>
              {(idx != arr.length-1) && <Divider />}
            </>
          )
          )}
        </List>
        
      </Popover>

      {/* 챕터 */}

      <Popover
        id={idCH}
        open={openCH}
        anchorEl={anchorCH}
        onClose={handleCloseCH}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{backgroundcolor: 'transparent'}}
      >
        <List>
          {chapters.map((item, idx, arr)=>(
            <>
              <ListItem button style={styleClasses.playspeedBtn} 
                onClick={()=>{
                  handleCloseCH();
                  chapterMoveFn(marksChapterList[idx]);
                }}>
                <ListItemText>{commonFn.format(item.value)} {item.chapterTitle}</ListItemText>
              </ListItem>
            </>
          )
          )}
          <ListItem button sx={{fontSize:13}} 
            onClick={()=>{
              toggleBoxFn();
              handleCloseCH()
            }} >
            View All Chapters
          </ListItem>
        </List>
        
      </Popover>
    </div>
  )
}
)

export default VideoController;