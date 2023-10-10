import React, { useEffect, useState } from 'react';
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/user-in-room")
        .then((response) => response.json())
        .then((data) => {
            if(data.code !== null)
            navigate(`/room/${data.code}`);
        });
    }, [])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} align="center">
                <Typography variant="h3" compact="h3">
                    House Party
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <ButtonGroup disableElevation variant="contained" color="primary">
                    <Button color="primary" to="/join" component={Link}>
                        Join a Room
                    </Button>
                    {/* <Button color="default" to="/info" component={Link}>
                        Info
                    </Button> */}
                    <Button color="secondary" to="/create" component={Link}>
                        Create a Room
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    )
}

export default HomePage;