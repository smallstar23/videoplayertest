import React from 'react';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import { ButtonBase, Card, CardContent, CardHeader, CardMedia, Grid, List, Typography } from '@mui/material';

import { makeStyles } from '@mui/styles';

const VideoChapterBox = 
  ({openBox, 
    toggleBoxFn,
    chapters,
    chapterMoveFn,
    marksChapterList,
    contentId,
    chapterEditBoxCloseFn
  }) =>{
    const theme = useTheme();
    const useStyles= {
      
      cardWapper:{
        color: '#777',
        width:'100%',
        '&:hover':{
          color: '#7950f2',
          transform: 'scale(1)'
        }
        
      },
  
    };
    // const styles=useStyles();

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


    };

    

    return (

      <div>
        <Drawer
          anchor={'right'}
          open={openBox}
          onClose={toggleBoxFn}
          BackdropProps={{ invisible: true }}
        >
          
          <Box sx={{marginTop:'60px', padding:'20px', width:'600px'}} >

            <CardHeader
              title='Chapters'
              titleTypographyProps={{ align: 'center' }}
              subheaderTypographyProps={{
                align: 'center',
              }}
              sx={{
                backgroundColor: (theme) => theme.palette.grey[200],
              }}
            />
            <List>
              {chapters.length===0 && 
              <>
                <div style={{width: 'fit-content', margin:'0 auto'}}>
                  <img src='/hungrycat.png' alt="No Chapters"></img>
                  <Typography>no chapters yet!!</Typography>
                </div>
              </>

              }

              {chapters.map((item, index, arr) => (
                <>
                  <Card sx={{ height:'10%', width:'100%', marginBottom:'20px'}} onClick={()=>{
                    chapterMoveFn(marksChapterList[index]);
                  }}>
                    <ButtonBase 
                    style={useStyles.cardWapper}
                    // className={styles.cardWapper}

                    >
                      <Grid container sx={{padding:' 20px'}}>
                        <Grid item sx={{width:'20%', marginRight:'5%'}}>
                          <CardMedia
                            component="img"
                            sx={{ width: '100%' }}
                            image={item.chapterUrl}
                          />
                        </Grid>
                        <Grid item >
                          <Typography component="div" variant="h5">
                            {item.chapterTitle}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary" component="div" sx={{textAlign: 'start'}}>
                            {format(item.value)}
                          </Typography>
                        </Grid>
                      </Grid>
                      


                      
                    
                    </ButtonBase>
                  </Card>
                 
                  
                </>
              
              ))}
            </List>
          </Box>
        </Drawer>
    
      </div>
    )

  } 

export default VideoChapterBox;
