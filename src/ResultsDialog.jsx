/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import React, { useMemo } from "react";

export default function ResultsDialog(props) {
    const { socketID, results, winners, users } = props;
    return (
        useMemo(() => (
            <Dialog fullWidth open={props.open} onClose={props.onClose} disableBackdropClick disableEscapeKeyDown>
                <DialogTitle>Results</DialogTitle>
                <DialogContent>

                    <Typography variant="h5" gutterBottom>Times:{" "}</Typography>
                    <br />
                    {Object.keys(results).map(r => (
                        <span key={r}>
                            {r !== socketID ? users[r] : "You"}: {(results[r] / 1000).toFixed(1)}{" "}
                            s <br />
                        </span>
                    ))}
                    <br />
                    <Typography variant="h5" gutterBottom>{winners.length > 0 && winners.length > 1
                        ? "Tie between " +
                        winners.map(w => (w !== socketID ? users[w] : "You")).join(", ") + ". oooo, too close to call!"
                        : winners[0] !== socketID
                            ? users[winners[0]] + " beat you to it this time. Unlucky!"
                            : "You Won. Nice one!"}</Typography>

                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        ), [props.open])
    )
}