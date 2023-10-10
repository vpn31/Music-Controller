import React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

const MusicPlayer = (props) => {

    console.log(props.song)

    const skipSong = () => {
        const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/skip", requestOptions);
    }

    const pauseSong = () => {
        const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/pause", requestOptions);
    }

    const playSong = () => {
        const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/play", requestOptions);
    }

    const songProgress = (props.song.time / props.song.duration) * 100;

    return (
        <div style={{paddingLeft: "5%"}}>
        <Card>
            <Grid container alignItems="center">
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Grid item align="center" xs={11} md={6}>
                        <img src={props.song.image_url} style={{paddingTop: "10%", height: "auto", maxWidth: "100%"}}/>
                    </Grid>
                    <Grid item align="center" xs={10} md={6} style={{paddingTop: "5%"}}>
                        <Typography component="h5" variant="h5">
                            {props.song.title}
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1">
                            {props.song.artist}
                        </Typography>
                        <div style={{display:"flex", flexDirection: "row", justifyContent: "center"}}>
                            <IconButton
                            onClick={() => {
                                props.song.is_playing ? pauseSong() : playSong();
                            }}
                            style={{paddingLeft: "20%"}}
                            >
                                {props.song.is_playing ? <PauseIcon/> : <PlayArrowIcon/>}
                            </IconButton>
                            <IconButton onClick={() => skipSong()}>
                                {/* {props.votes} / {props.votes_required} */}
                                <SkipNextIcon/>
                            </IconButton>
                        </div>
                    </Grid>
                </div>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
      </Card>
      </div>
    );
}


export default MusicPlayer;