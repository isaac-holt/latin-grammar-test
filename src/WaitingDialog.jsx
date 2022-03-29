import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import React from "react";

export default function Waiting(props) {
    return (
        <Dialog fullWidth open={props.open} onClose={props.onClose} disableBackdropClick disableEscapeKeyDown>
            <DialogTitle>Live challenge</DialogTitle>
            <DialogContent>
                {Object.keys(props.users).length} users online <br /> <br />
                {props.timer === null ? <>{props.owner ? "Waiting for participants to join..." : "Waiting for " + props.users[props.ownerID] + " to start the live challenge..."}<br /><br />
                    Participants: {props.members.filter(m => m !== props.socketID && props.users[m]).map(m => props.users[m] + ", ")}</> : (
                    <Typography variant="h2">{props.timer !== null && Math.round(props.timer / -1000)}</Typography>
                )}
            </DialogContent>
            <DialogActions>
                {props.owner && <Button onClick={props.startChallenge} disabled={props.challengeID === "" || props.members.length < 2}>Start</Button>}
                <Button onClick={props.onClose}>{!props.owner ? "Leave" : "Cancel"}</Button>
            </DialogActions>
        </Dialog>
    )
}