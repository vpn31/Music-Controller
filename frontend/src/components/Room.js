import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer';

const Room = () => {

    //const {roomCode} = useParams();
    const navigate = useNavigate();

    const { roomCode } = useParams();

    const [guestCanPause, setGuestCanPause] = useState(false);
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState({});

    const getRoomDetails = () => {
        fetch('/api/get-room' + '?code=' + roomCode)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if(data != null) {
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host)
            }
        })
        if(isHost) {
            authenticateSpotify();
        }
    }

    useEffect(() => {
        const interval = setInterval(getCurrentSong(), 1000);

        return () => clearInterval(interval);
    },[song])

    useEffect(() => {
        getRoomDetails();
    })

    useEffect(() => {
        getRoomDetails();
    }, [votesToSkip, guestCanPause, isHost])

    const authenticateSpotify = () => {
        fetch("/spotify/is-authenticated")
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((data) => {
            console.log(data)
            setSpotifyAuthenticated(data.status);
            console.log(data.status);
            if (!data.status) {
                fetch("/spotify/get-auth-url")
                .then((response) => response.json())
                .then((data) => {
                    window.location.replace(data.url);
                });
            }
        });
    }

    const getCurrentSong = () => {
        fetch("/spotify/current-song")
        .then((response) => {
            if (!response.ok) {
            return {};
            } else {
                return response.json();
            }
        })
        .then((data) => {
            setSong(data);
            //console.log(data);
        });
    }

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((response) => {
            navigate("/");
        });
    }

    const renderSettings = () => {
        return (
            <Grid container spacing={1} >
              <Grid item xs={12} align="center">
                <CreateRoomPage
                  update={true}
                  votesToSkip={votesToSkip}
                  guestCanPause={guestCanPause}
                  roomCode={roomCode}
                  updateCallback={getRoomDetails}
                />
              </Grid>
              <Grid item xs={12} align="center">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => updateShowSettings(false)}
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          );
    }

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center" style={{paddingTop: "5%", paddingBottom: "2.5%"}}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => updateShowSettings(true)}
              >
                Settings
              </Button>
            </Grid>
          );
    }

    const updateShowSettings = (value) => {
        setShowSettings(value);
    }

    return (
        <div>
            {showSettings ? 
                renderSettings() 
                :   
                <Grid container spacing={1}>
                    <Grid item xs={12} align="center" style={{paddingBottom: "5%"}}>
                        <Typography variant="h4" component="h4">
                            Code: {roomCode}
                        </Typography>
                    </Grid>
                    <MusicPlayer song = {song}/>
                    {isHost ? renderSettingsButton() : null} 
                    <Grid item xs={12} align="center" style={{paddingTop: isHost ? "" : "5%"}}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={leaveButtonPressed}
                        >
                            Leave Room
                        </Button>
                    </Grid>
                </Grid>
            }       
        </div>
    )
}

export default Room;