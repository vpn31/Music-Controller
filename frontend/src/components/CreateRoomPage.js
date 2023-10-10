import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, Collapse } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';

const CreateRoomPage = (props) => {
    //const { update = false, votes = 2, canPause = true, roomCode = null, updateCallback = () => {}} = props;
    console.log(props);
    console.log(Object.keys(props).length);

    const propsIsEmpty = Object.keys(props).length==0 ? true : false; 

    const update = propsIsEmpty ? false : props.update;
    const votes = propsIsEmpty ? 2 : props.votesToSkip;
    const canPause = propsIsEmpty ? true : props.guestCanPause;
    const roomCode = propsIsEmpty ? null : props.roomCode;
    const updateCallback = () => {
        if (propsIsEmpty)
        return;
        props.updateCallback;
    }

    const navigate = useNavigate();

    const [guestCanPause, setGuestCanPause] = useState(canPause);
    const [votesToSkip, setVotesToSkip] = useState(votes);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    console.log(guestCanPause, votesToSkip, canPause, votes);

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    }

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === 'true' ? true : false);
    }

    const handleCreateRoomButton = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              votes_to_skip: votesToSkip,
              guest_can_pause: guestCanPause,
            }),
          };
          fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => navigate('/room/' + data.code));
    }

    const handleUpdateRoomButton = () => {
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: votesToSkip==undefined ? 2 : votesToSkip,
                guest_can_pause: guestCanPause==undefined ? true : guestCanPause,
                code: roomCode,
            }),
        };
        fetch("/api/update-room", requestOptions).then((response) => {
            if (response.ok) {
                setSuccessMsg("Room updated successfully!");
            } else {
                setErrorMsg("Error updating room...");
            }
            updateCallback();
        });
    }

    const title = update ? "Update Room" : "Create Room" ;

    useEffect(() => {
        updateCallback();
    })

    useEffect(() => {
        updateCallback();
    }, [votesToSkip])

    const renderCreateButton = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleCreateRoomButton}
                    >
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        )
    }

    const renderUpdateButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleUpdateRoomButton}
                >
                    Update Room
                </Button>
            </Grid>
        )
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse
                    in={errorMsg != "" || successMsg != ""}
                >
                    {successMsg != "" ? (
                    <Alert
                        severity="success"
                        onClose={() => {
                            setSuccessMsg("");
                        }}
                    >
                        {successMsg}
                    </Alert>
                    ) : (
                    <Alert
                        severity="error"
                        onClose={() => {
                            setErrorMsg("");
                        }}
                    >
                    {errorMsg}
                    </Alert>
                    )}
                </Collapse>
                <Typography component='h4' variant='h4'>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">Guest Control of Playback State</div>
                    </FormHelperText>
                    <div style={{paddingLeft: "21%"}}>
                    <RadioGroup 
                        row 
                        defaultValue={guestCanPause==undefined ? 'true' : guestCanPause.toString()}
                        onChange={handleGuestCanPauseChange}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        >
                        </FormControlLabel>
                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom">
                        </FormControlLabel>
                    </RadioGroup>
                    </div>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        defaultValue={votesToSkip==undefined ? '2' : votesToSkip}
                        onChange={handleVotesChange}
                        inputProps={{
                            min: 1,
                            style: { textAlign: "center" },
                        }}
                    />
                    <FormHelperText>
                        <div align="center">Votes Required To Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            { update ?
                renderUpdateButton() :
                renderCreateButton()
            }
        </Grid>
    )
}

export default CreateRoomPage;