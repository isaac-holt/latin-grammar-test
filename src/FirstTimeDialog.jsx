import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import { useState } from "react";

export default function FirstTime(props) {
    const
        [open, setOpen] = useState(true),
        [name, setName] = useState(""),
        [school, setSchool] = useState(""),
        choose = () => {
            /*if (value === "Isaac Holt") {
                localStorage.used = "yes";
                setOpen(false);
            } else {
                setError(true);
                setHelperText("Wrong");
            }*/
            localStorage.setItem("username", name);

            localStorage.used = "yes";
            localStorage.setItem("school", school);
            setOpen(false);
            props.set(name, school);

        };
    return (
        <Dialog
            open={open}
            maxWidth="xl"
            fullWidth
        >
            <DialogTitle>Welcome!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter a username and your school name:
                </DialogContentText>
                <TextField value={name} fullWidth margin="dense" label="Username" onChange={e => setName(e.target.value)} />
                <TextField value={school} fullWidth margin="dense" label="School" onChange={e => setSchool(e.target.value)} />
                {/*<FormControl
                    component="fieldset"
                    error={error}
                >
                    <RadioGroup
                        value={value}
                        onChange={handleChange}
                    >
                        {options.map(name => (
                            <FormControlLabel value={name} control={<Radio />} label={name} key={name} />
                        ))}
                    </RadioGroup>
                    <FormHelperText>{helperText}</FormHelperText>
                        </FormControl>*/}
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={choose}
                    disabled={name === "" || school === ""}
                >
                    go
                </Button>
            </DialogActions>
        </Dialog>
    );
}