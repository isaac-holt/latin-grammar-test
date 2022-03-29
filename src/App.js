/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, Fragment, createRef, useEffect, useRef, useMemo } from "react";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import caseWords from "./caseWords.json";
import verbs from "./verbs.json";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, TextField, Card, IconButton, Snackbar, Chip} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import Autocomplete from '@material-ui/lab/Autocomplete';
import isHotkey from 'is-hotkey';
import io from "socket.io-client";
import { omit } from "lodash";
if (!localStorage.getItem("school")) localStorage.setItem("school", "");
fetch(`https://quiet-falls-42399.herokuapp.com`);
const socket = io(`https://quiet-falls-42399.herokuapp.com`);

let timeout;
let globalUsers = [];
let globalChallenges = [];
let globalChallengeID = [];
let globalMembers = {};
let globalResults = {};
const
    theme = createMuiTheme({
        palette: {
            type: "dark",
            primary: {
                main: "#76ff03"
            },
            secondary: {
                main: "#76ff03"
            },
        },
        shadows: Array(25).fill("none"),
        overrides: {
            MuiExpansionPanelDetails: {
                root: {
                    padding: 8,
                }
            },
            MuiExpansionPanelSummary: {
                root: {
                    backgroundColor: "#212121",
                    minHeight: "48px !important",
                },
                content: {
                    margin: "0 !important",
                }
            },
            MuiExpansionPanel: {
                root: {
                    margin: "0 !important",
                    marginTop: "8px !important",
                }
            },
            MuiDialog: {
                paper: {
                    margin: 16,
                },
                paperFullWidth: {
                    width: "calc(100% - 32px)",
                }
            },
            MuiInputBase: {
                root: {
                    color: "#76ff03 !important",
                },
            },
            MuiAutocomplete: {
                paper: {
                    maxHeight: 256,
                    border: "2px solid gray",
                    overflow: "auto",
                },
                listbox: {
                    padding: 0,
                    margin: 0,
                },
                option: {
                    margin: 0,
                }
            }
        },
        props: {
            MuiTypography: {
                variantMapping: {
                    body1: "span",
                },
            },
            MuiTextField: {
                autoCorrect: "false",
                autoCapitalize: "false",
                spellCheck: "false"
            }
        },
    }),
    styles = {
        paper: {
            borderRadius: 16,
            padding: 16,
            margin: 16,
        },
        container: {
            height: "calc(100vh - 48px)",
            width: "100vw",
            backgroundColor: "#333",
            maxWidth: 2048,
            margin: "0 auto",
            overflowY: "auto"
        },
        title: {
            color: "#76ff03"
        }
    },
    persons = ["I", "You (s)", "He/she/it", "We", "You (p)", "They"],
    forms = ["Imperative active sgl", "Imperative active plu", "Present active infinitive", "Perfect active infinitive", "Future active infinitive", "Present participle", "Future participle", "Gerund", "Supine", "Imperative passive sgl", "Imperative passive plu", "Present passive infinitive", "Perfect passive infinitive", "Future passive infinitive", "Perfect participle", "Gerundive"],
    notes = {
        nouns: (
            <ol>
                <li>
                    Vocative same as nominative for all nouns except group 2 masc ending in '-us' which have vocative singular '-e' and in '-ius' which have vocative singular '-i'. E.g. dominus → domine, filius → fili.
                </li>
                <li>
                    All group 1 nouns are feminine except a few which are masculine e.g. nauta, agricola, scriba.
                </li>
                <li>
                    manus and domus are group 4 feminine. Ablative of domus is domo, locative is domi.
                </li>
                <li>
                    Locative for group 1 singular ends '-ae'. Plural ends '-is'. <br />
                    Locative for group 2 singular ends '-i'. Plural ends '-is'. <br />
                    Locative for group 3 singular ends '-i' or '-e'. Plural ends '-ibus'.
                </li>
            </ol>
        ),
        adjectives: (
            <ol>
                <li>
                    These adjectives are mixed 2nd and 3rd declension (gen sgl ends '-ius', dat sgl ends '-i'): alius, nullus, ullus, solus, totus, unus.
                </li>
                <li>
                    The comparative can also mean 'quite', 'rather' or 'too'.
                </li>
                <li>
                    Adjectives ending '-er' in nominative double the 'r' in the superlative.
                </li>
                <li>
                    Some adjectives ending '-ilis' in nominative double the 'l' in the superlative.
                </li>
                <li>
                    Adverbs are formed for groups 1 and 2 by adding 'e' to the stem, except e.g. subito. <br />
                    Adverbs formed for group 3 by adding 'ter' to the stem. e.g. celer → celeriter.
                </li>
                <li>
                    Comparative adverb same as neut. acc. of comparative adjective. <br />
                    Superlative adverb formed by changing nominative ending 'us' to 'e'.
                </li>
                <li>
                    quam + superlative = as ... as possible.
                </li>
                <li>
                    The comparative of bonus is melior, the superlative is optimus, the adverb is bene.
                </li>
                <li>
                    The comparative of malus is peior, the superlative is pessimus, the adverb is male.
                </li>
                <li>
                    The comparative of magnus is maior, the superlative is maximus, the adverb is magnopere.
                </li>
                <li>
                    The comparative of multus is plus, the superlative is plurimus, the adverb is multum.
                </li>
                <li>
                    The comparative of paruus (small) is minor, the superlative is minimus, the adverb is paul(l)um.
                </li>
                <li>
                    The comparative of senex is natu maior, the superlative is natu maximus.
                </li>
                <li>
                    The comparative of iuvenis is natu minor, the superlative is natu minimus.
                </li>
                <li>
                    The comparative of diu is diutius, the superlative is diutissime.
                </li>
                <li>
                    The comparative of post is posterius, the superlative is postremo.
                </li>
                <li>
                    The comparative of prope is propius, the superlative is proxime.
                </li>
                <li>
                    The comparative of saepe is saepius, the superlative is saepissime.
                </li>
            </ol>
        ),
        pronouns: (
            <ol>
                <li>
                    The ablative of personal pronouns combines with cum to mean e.g. mecum = with me.
                </li>
                <li>
                    Genitives nostri and vestri are objective e.g. desirous of us, nostrum and vestrum are partitve e.g. one of you.
                </li>
                <li>
                    Possesive adjectives: <br />
                    meus, -a, -um <br />
                    tuus, a, -um <br />
                    suus, -a, -um <br />
                    noster, -ra, -rum <br />
                    vester, -ra, -rum <br />
                    suus, -a, -um. <br />
                    All decline like bonus or pulcher.
                </li>
                <li>
                    The vocative of meus is mi.
                </li>
            </ol>
        ),
        numbers: (
            <ol>
                <li>
                    4-100 don't decline, 200-900 decline like boni, -ae, a.
                </li>
                <li>
                    mille doesn't decline, milia declines as a group 3 plural noun.
                </li>
            </ol>
        ),
        participles: (
            <ol>
                <li>
                    Present participles ends in '-ans' for group 1 verbs, '-ens' for all other groups. They can be formed from deponent verbs.
                </li>
                <li>
                    Future participles formed by adding -urus, -a, -um to the stem of the verb (for active verbs to the supine without the -um).
                </li>
            </ol>
        ),
    },
    cases = ["Nom", "Acc", "Gen", "Dat", "Abl"],
    Firsttime = props => {
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
                        Enter your username and school:
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
    },
    scoreColors = ["#9C27B0", "#f44336", "#FF5722", "#FF9800", "#FFC107", "#FFEB3B", "#CDDC39", "#8BC34A", "#4CAF50", "#00BCD4"],
    CaseDialog = props => {
        const
            [test, setTest] = useState(false),
            [reveal, setReveal] = useState(false),
            firstField = createRef(),
            [members, setMembers] = useState([]),
            [timer, setTimer] = useState(null),
            [challengeID, setChallengeID] = useState(""),
            [ownerID, setOwnerID] = useState(""),
            [results, setResults] = useState({}),
            [winners, setWinners] = useState([]),
            [answers, setAnswers] = useState(Array(10).fill("")),
            words = caseWords[props.type],
            startChallenge = () => {
                if (members.length > 1) {
                socket.emit("start challenge", challengeID, localStorage.getItem("school").toLowerCase(), () => setTimer(-3000));
                }
            },
            createChallenge = () => {
                setReveal(false);
                setTest(true);
                setOwnerID(props.socketID);
                if (challengeID === "") {
                socket.emit("create challenge", props.type, props.group, localStorage.getItem("school").toLowerCase(),
                id =>
                    setChallengeID(id)
                );
                setMembers([props.socketID]);
                }
            },
            cancelChallenge = () => {
                socket.emit("cancel challenge", challengeID, localStorage.getItem("school").toLowerCase());
                setChallengeID("");
            },
            close = () => {
                setAnswers(Array(10).fill(""));
                setReveal(false);
                setTest(false);
                props.close();
            },
            handleInput = i => e => {
                setAnswers(answers.map((answer, j) => j === i ? e.target.value : answer));
                if (e.key === "Enter" && i === 9) {
                    check();
                }
            },

            check = () => {
                setReveal(true);
                setTest(false);
                let score = 0;
                let extra = 0;
                const max = words[props.group].filter(x => x.includes("-")).length;
                for (let k in words[props.group]) {
                    if (answers[k].toLowerCase().trim() === words[props.group][k].split("-")[1]) score++;
                    else extra = extra + 8;
                };
                localStorage[props.group + `-${props.type}-score`] = `${score} / ${max}`;
                if (challengeID !== "") {

                    finishChallenge(extra);
                }
            },
            study = () => {
                setReveal(false);
                setTest(false);
                setAnswers(Array(10).fill(""));
            },
            startTest = () => {
                //const input = firstField.current;
                //setTimeout(input.focus, 0);
                setAnswers(Array(10).fill(""));
                setTest(true);
                setReveal(false);
            },
            finishChallenge = (x) => {
            clearTimeout(timeout);
            setResults({
                ...results,
                [props.socketID]: timer + x * 1000,
            });
            if (!localStorage[props.group + `-${props.type}-time`] || localStorage[props.group + `-${props.type}-time`] * 1 > (timer + x * 1000) / 1000) {
                localStorage[props.group + `-${props.type}-time`] = `${(timer + x * 1000) / 1000}`;
            }
            socket.emit("finish challenge", challengeID, timer + x * 1000, x);
            setTimer(String(timer));
            },
            showWinners = () => {
            if (members.every(m => Object.keys(results).includes(m))) {
                setWinners(
                members.filter(m =>
                    Object.values(results).every(t => results[m] <= t)
                )
                );

            }
            },
            leaveChallenge = () => {
            socket.emit("leave challenge", challengeID);
            setChallengeID("");
            setMembers([]);
            },
            preventEnter = i => e => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    if (i === 9) {
                        check();
                    }
                }
            };
            useEffect(() => {
            if (typeof timer === "number") {
                if (timer >= 0) {
                timeout = setTimeout(() => setTimer(timer + 100), 100);
                } else {
                timeout = setTimeout(() => setTimer(Math.round(timer / 1000) * 1000 + 1000), 1000);
                }
            }
            }, [timer]);
            useEffect(() => {
            globalMembers = members;
            }, [members]);
            useEffect(() => {
            globalResults = results;
            showWinners();
            }, [results]);
            useEffect(() => {
                props.challengeID !== undefined && setChallengeID(props.challengeID);
                if (props.challengeID !== "") {
                    setTest(true);
                    setReveal(false);
                }
            }, [props.challengeID]);
            useEffect(() => {
                setOwnerID(props.ownerID);
            }, [props.ownerID]);
            useEffect(() => {
                setMembers(props.members);
            }, [props.members]);
            useEffect(() => {


                socket.on("challenge joined", id => {
                    setMembers([...globalMembers, id]);
                });
            
                socket.on("challenge left", id => {
                    setMembers(globalMembers.filter(m => m !== id));
                });
                /*socket.on("challenge cancelled", id =>
                    //setChallenges(globalChallenges.filter(x => x.id !== id))
                );*/
                socket.on("challenge started", id => {
                    //setChallengeID(id);
                    setTimer(-3000);
                });
                socket.on("challenge finished", (id, time) => {
                    if (!globalResults[id]) {
                        setResults({
                        ...globalResults,
                        [id]: time
                        });
                    }
                });
            }, []);
        return (
            <Dialog
                open={props.open}
                maxWidth="xl"
                fullWidth
                onClose={close}
                disableBackdropClick={challengeID !== ""}
                disableEscapeKeyDown={challengeID !== ""}
            >
            <Waiting users={props.users} open={Boolean(challengeID !== "" &&( timer === null || (timer && timer < 0)))} onClose={() => {
             if(ownerID === props.socketID) {cancelChallenge();setChallengeID("");setTimer(null)} else {leaveChallenge();}}} members={members} setTimer={setTimer} timer={timer} challengeID={challengeID} startChallenge={startChallenge} owner={ownerID === props.socketID} ownerID={ownerID} />
            <Results winners={winners} open={challengeID !== "" && winners.length > 0} onClose={() => {setChallengeID("");setTimer(null)}} socketID={props.socketID} users={props.users} results={results} />
                <DialogContent>
                <Table className="case">
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#212121" }}>
                                <TableCell>Case</TableCell>
                                <TableCell>Endings</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan="2">Singular</TableCell>
                            </TableRow>
                            {words[props.group] !== undefined && words[props.group].map((word, i) => (
                                    <Fragment key={i}>
                                        {i === 5 &&
                                            <TableRow>
                                                <TableCell colSpan="2">Plural</TableCell>
                                            </TableRow>
                                        }
                                        <TableRow>
                                            <TableCell>{cases[i < 5 ? i : i - 5]}</TableCell>
                                            <TableCell>
                                                {word.includes("-")
                                                    ? <Fragment>
                                                        {word.split("-")[0]}{word.split("-")[0] !== "" && " -"}
                                                        <TextField
                                                            disabled={!test}
                                                            onKeyDown={preventEnter(i)}
                                                            inputRef={i === 0 ? firstField : undefined}
                                                            //{...refProp}
                                                            onChange={handleInput(i)}
                                                            value={test || reveal ? answers[i] : word.split("-")[1]}
                                                            className="caseField"
                                                            margin="none"
                                                        />
                                                        &nbsp;
                                                        {reveal && !test && (answers[i].toLowerCase().trim() === word.split("-")[1] ? <span style={{ color: "#4caf50", fontWeight: 900, }}> ✓</span> : <span style={{ color: "#f44336", fontWeight: 900 }}> ✕</span>)}
                                                    </Fragment>
                                                    : word
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                ))}
                        </TableBody>
                    </Table>
                    {timer !== null && "Your time: " + (Math.abs(timer) / 1000).toFixed(timer < 0 ? 0 : 1)} <br />
                    {typeof timer === "string" && "Waiting for other participants to finish..."}
                </DialogContent>
                <DialogActions style={{overflowX: "scroll", overflowY: "hidden", display: "table-row", whiteSpace: "nowrap"}}>
                    {challengeID === "" && 
                    <><Button
                        onClick={close}
                        color="primary"
                    >
                        close
                    </Button>
                    <Button
                        color="primary"
                        onClick={startTest}
                        style={{
                            backgroundColor: test && "rgba(118, 255, 3, 0.1)",
                        }}
                    >
                        test
                    </Button>
                    </>}
                    <Button
                        color="primary"
                        onClick={check}
                        disabled={!test && !reveal && challengeID === ""}
                        style={{
                            backgroundColor: reveal && "rgba(118, 255, 3, 0.1)",
                        }}
                    >
                        check
                    </Button>
                    {challengeID === "" && 
                    <Button
                        color="primary"
                        onClick={study}
                        style={{
                            backgroundColor: !test && !reveal && "rgba(118, 255, 3, 0.1)",
                        }}
                    >
                        study
                    </Button>}
                    <Button
                        color="primary"
                        onClick={createChallenge}
                        style={{
                            backgroundColor: challengeID !== "" && "rgba(118, 255, 3, 0.1)",
                        }}
                    >
                        Live
                    </Button>
                </DialogActions>
            </Dialog>
        )
    },
    Waiting = props => {
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
    },
    Results = props => {
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
    },
    VerbDialog = props => {
        const
            [test, setTest] = useState(false),
            [reveal, setReveal] = useState(false),
            [answers, setAnswers] = useState(Array(18).fill("")),
            otherForms = props.group.includes("other forms"),
            present = props.group.includes("present"),
            maps = !otherForms && verbs[props.type][props.group] !== undefined
                ? verbs[props.type][props.group].slice(0, 6)
                : verbs[props.type][props.group],
            firstField = createRef(),
            [members, setMembers] = useState([]),
            [timer, setTimer] = useState(null),
            [challengeID, setChallengeID] = useState(""),
            [ownerID, setOwnerID] = useState(""),
            [results, setResults] = useState({}),
            [winners, setWinners] = useState([]),
            startChallenge = () => {
                if (members.length > 1) {
                  socket.emit("start challenge", challengeID, localStorage.getItem("school").toLowerCase(), () => setTimer(-3000));
                }
              },
            createChallenge = () => {
                setReveal(false);
                setTest(true);
                setOwnerID(props.socketID);
                if (challengeID === "") {
                  socket.emit("create challenge", props.type, props.group, localStorage.getItem("school").toLowerCase(),
                  id =>
                    setChallengeID(id)
                  );
                  setMembers([props.socketID]);
                }
              },
              cancelChallenge = () => {
                socket.emit("cancel challenge", challengeID, localStorage.getItem("school").toLowerCase());
                setTest(false);
                setChallengeID("");
              },
            close = () => {
                setAnswers(Array(18).fill(""));
                setReveal(false);
                setTest(false);
                props.close();
            },
            handleInput = i => e => {
                //console.log(i, answers);
                setAnswers(answers.map((answer, j) => j === i ? e.target.value : answer));
                if (e.key === "Enter" && i === answers.length - 1) {
                    check();
                }
            },

            check = () => {
                setReveal(true);
                setTest(false);
                let score = 0;
                let extra = 0;
                const max = verbs[props.type][props.group].filter(x => x.includes("-")).length;
                for (let k in verbs[props.type][props.group]) {
                    if (answers[k].toLowerCase().trim() === verbs[props.type][props.group][k].split("-")[1]) score++;
                    else extra = extra + 8;
                };
                localStorage[props.group + `-${props.type}-score`] = `${score} / ${max}`;
                if (challengeID !== "") {

                    finishChallenge(extra);
                }
            },
            study = () => {
                setReveal(false);
                setTest(false);
                setAnswers(Array(18).fill(""));
            },
            preventEnter = i => e => {
                if (e.key === "Enter") {
                    if (i === 17 || (props.group.includes("subjunctive") && i === 11)) {
                        check();
                    }
                }
            },
            startTest = () => {
                //setTimeout(firstField.current.focus, 0);
                setAnswers(Array(18).fill(""));
                setTest(true);
                setReveal(false);
            },
            finishChallenge = (x) => {
              clearTimeout(timeout);
              setResults({
                ...results,
                [props.socketID]: timer + x * 1000,
              });
              if (!localStorage[props.group + `-${props.type}-time`] || localStorage[props.group + `-${props.type}-time`] * 1 > (timer + x * 1000) / 1000) {
                  localStorage[props.group + `-${props.type}-time`] = `${(timer + x * 1000) / 1000}`;
              }
              socket.emit("finish challenge", challengeID, timer + x * 1000, x);
              setTimer(String(timer));
            },
            showWinners = () => {
              if (members.every(m => Object.keys(results).includes(m))) {
                setWinners(
                  members.filter(m =>
                    Object.values(results).every(t => results[m] <= t)
                  )
                );
              }
            },
            leaveChallenge = () => {
              socket.emit("leave challenge", challengeID);
              setChallengeID("");
              setTimer(null);
              setMembers([]);
              setTest(false);
            };
            useEffect(() => {
              if (typeof timer === "number") {
                if (timer >= 0) {
                  timeout = setTimeout(() => setTimer(timer + 100), 100);
                } else {
                    
                  timeout = setTimeout(() => setTimer(Math.round(timer / 1000) * 1000 + 1000), 1000);
                }
              }
            }, [timer]);
            useEffect(() => {
              globalMembers = members;
            }, [members]);
            useEffect(() => {
              globalResults = results;
              showWinners();
            }, [results]);
            useEffect(() => {
                props.challengeID !== undefined && setChallengeID(props.challengeID);
            }, [props.challengeID]);
            useEffect(() => {
                setOwnerID(props.ownerID);
            }, [props.ownerID]);
            useEffect(() => {
                setMembers(props.members);
            }, [props.members]);
            useEffect(() => {


                socket.on("challenge joined", id => {
                    setMembers([...globalMembers, id]);
                  });
            
                socket.on("challenge left", id => {
                    setMembers(globalMembers.filter(m => m !== id));
                  });
                  /*socket.on("challenge cancelled", id =>
                    //setChallenges(globalChallenges.filter(x => x.id !== id))
                  );*/
                  socket.on("challenge started", id => {
                      //setChallengeID(id);
                    setTimer(-3000);
                  });
                  socket.on("challenge finished", (id, time) => {
                      
                    setResults({
                      ...globalResults,
                      [id]: time
                    });
                  });
            }, []);
        return (
            <Dialog
                open={props.open}
                maxWidth="xl"
                fullWidth
                onClose={close}
                disableBackdropClick={challengeID !== ""}
                disableEscapeKeyDown={challengeID !== ""}
            >
                <Waiting users={props.users} open={Boolean(challengeID !== "" &&( timer === null || (timer && timer < 0)))} onClose={() => {
                 if(ownerID === props.socketID) {cancelChallenge();setChallengeID("");setTimer(null)} else {leaveChallenge();}}} members={members} setTimer={setTimer} timer={timer} challengeID={challengeID} startChallenge={startChallenge} owner={ownerID === props.socketID} ownerID={ownerID} />
                <Results winners={winners} open={challengeID !== "" && winners.length > 0} onClose={() => {setChallengeID("");setTimer(null)}} socketID={props.socketID} users={props.users} results={results} />
    <DialogTitle>Verbs: {props.group}</DialogTitle>
                <DialogContent>
                    <Table className="verb">
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#212121" }}>
                                {!otherForms
                                    ? <Fragment>
                                        <TableCell>Person</TableCell>
                                        <TableCell>
                                            {present ? "Present" : "Perfect"}
                                        </TableCell>
                                        <TableCell>
                                            {present ? "Imperfect" : "Pluperfect"}
                                        </TableCell>
                                        {props.group.includes("indicative")
                                            && <TableCell>{present ? "Future" : "Future perfect"}</TableCell>}
                                    </Fragment>
                                    : <Fragment>
                                        <TableCell>Form</TableCell>
                                        <TableCell>
                                            Word
                                        </TableCell>
                                    </Fragment>
                                }
                                
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {verbs[props.type][props.group] !== undefined && maps.map((word, i) => (
                                    <Fragment key={i}>
                                        <TableRow>
                                            <TableCell>{otherForms ? forms[i] : persons[i]}</TableCell>
                                            <TableCell>
                                                {word.includes("-")
                                                    ? <Fragment>
                                                        {word.split("-")[0]}{word.split("-")[0] !== "" && " -"}
                                                        <TextField
                                                            disabled={!test}
                                                            onKeyDown={preventEnter(i)}
                                                            inputRef={i === 0 ? firstField : undefined}
                                                            //{...refProp}
                                                            onChange={handleInput(i)}
                                                            value={(test || reveal || challengeID !== "") ? answers[i] : word.split("-")[1]}
                                                            className={otherForms ? "otherField" : "verbField"}
                                                            margin="none"
                                                        />
                                                        {reveal && !test && (answers[i].toLowerCase().trim() === word.split("-")[1] ? <span style={{ color: "#4caf50", fontWeight: 900 }}>✓</span> : <span style={{ color: "#f44336", fontWeight: 900 }}> ✕</span>)}
                                                    </Fragment>
                                                    : word
                                                }
                                            </TableCell>
                                            {!otherForms && 
                                                <TableCell>
                                                    {verbs[props.type][props.group][i + 6].includes("-")
                                                        ? <Fragment>
                                                            {verbs[props.type][props.group][i + 6].split("-")[0]}{verbs[props.type][props.group][i + 6].split("-")[0] !== "" && " -"}
                                                            <TextField
                                                                disabled={!test}
                                                                onKeyDown={preventEnter(i + 6)}
                                                                onChange={handleInput(i + 6)}
                                                                value={(test || reveal || challengeID !== "") ? answers[i + 6] : verbs[props.type][props.group][i + 6].split("-")[1]}
                                                                className="verbField"
                                                                margin="none"
                                                            />
                                                            {reveal && !test && (answers[i + 6].toLowerCase().trim() === verbs[props.type][props.group][i + 6].split("-")[1] ? <span style={{ color: "#4caf50", fontWeight: 900 }}>✓</span> : <span style={{ color: "#f44336", fontWeight: 900 }}> ✕</span>)}
                                                        </Fragment>
                                                        : verbs[props.type][props.group][i + 6]
                                                    }
                                                </TableCell>
                                            }
                                            {props.group.includes("indicative") && <TableCell>
                                                {verbs[props.type][props.group][i + 12].includes("-")
                                                    ? <Fragment>
                                                        {verbs[props.type][props.group][i + 12].split("-")[0]}{verbs[props.type][props.group][i + 12].split("-")[0] !== "" && " -"}
                                                        <TextField
                                                            disabled={!test}
                                                            onKeyDown={preventEnter(i + 12)}
                                                            onChange={handleInput(i + 12)}
                                                            value={(test || reveal || challengeID !== "") ? answers[i + 12] : verbs[props.type][props.group][i + 12].split("-")[1]}
                                                            className={"verbField"}
                                                            margin="none"
                                                        />
                                                        {reveal && !test && (answers[i + 12].toLowerCase().trim() === verbs[props.type][props.group][i + 12].split("-")[1] ? <span style={{ color: "#4caf50", fontWeight: 900 }}>✓</span> : <span style={{ color: "#f44336", fontWeight: 900,}}> ✕</span>)}
                                                    </Fragment>
                                                    : verbs[props.type][props.group][i + 12]
                                                }
                                            </TableCell>}
                                        </TableRow>
                                    </Fragment>
                                ))}
                        </TableBody>
                    </Table>
                    {timer !== null && "Your time: " + (Math.abs(timer) / 1000).toFixed(timer < 0 ? 0 : 1)} <br />
                    {typeof timer === "string" && "Waiting for other participants to finish..."}
                </DialogContent>
                <DialogActions style={{overflowX: "scroll", overflowY: "hidden", display: "table-row", whiteSpace: "nowrap"}}>
                    {challengeID === "" && 
                    <><Button
                        onClick={close}
                        color="primary"
                    >
                        close
                    </Button>
                    <Button
                        color="primary"
                        onClick={startTest}
                        style={{
                            backgroundColor: test && "rgba(118, 255, 3, 0.1)",
                        }}
                    >
                        test
                    </Button>
                    </>}
                    <Button
                        color="primary"
                        onClick={check}
                        disabled={!test && !reveal && challengeID === ""}
                        style={{
                            backgroundColor: reveal && "rgba(118, 255, 3, 0.1)",
                        }}
                    >
                        check
                    </Button>
                    {challengeID === "" && 
                    <Button
                        color="primary"
                        onClick={study}
                        style={{
                            backgroundColor: !test && !reveal && "rgba(118, 255, 3, 0.1)",
                        }}
                    >
                        study
                    </Button>}
                    <Button
                        color="primary"
                        onClick={createChallenge}
                        style={{
                            backgroundColor: challengeID !== "" && "rgba(118, 255, 3, 0.1)",
                        }}
                    >
                        Live
                    </Button>
                </DialogActions>
            </Dialog>
        )
    };
export default () => {
    const
        [value, setValue] = useState(sessionStorage.last ? sessionStorage.last * 1 : 0),
        [nounOpen, setNounOpen] = useState(false),
        [nounGroup, setNounGroup] = useState("Group 1"),
        [memoOpen, setMemoOpen] = useState(false),
        [resetOpen, setResetOpen] = useState(false),
        [meme, setMeme] = useState(1),
        [filter, setFilter] = useState(""),
        [name, setName] = useState(localStorage.getItem("username") || ""),
        [school, setSchool] = useState(localStorage.getItem("school") || ""),
        [users, setUsers] = useState([]),
    [challenges, setChallenges] = useState([]),
    [socketID, setSocketID] = useState(""),
    [challengeID, setChallengeID] = useState(""),
    [ownerID, setOwnerID] = useState(""),
    [members, setMembers] = useState([]),
    [open, setOpen] = useState(null),
        getOptions = () => {
            if (value === 0) {
                return ["Group 1", "Group 2", "Group 3", "Group 4", "Group 5", "Neuter"];
            } else if (value === 1) {
                return ["Group 1", "Group 2", "Group 3", "Neuter", "Comparative", "Superlative", "Masc", "Femn", "Neut"];
            } else if (value === 2) {
                return ["This", "That", "The same", "Self", "A Certain", "Who", "Masc", "Femn", "Neut"];
            } else if (value === 3) {
                return ["One", "Two", "Three", "Masc", "Femn", "Neut"];
            } else if (value === 4) {
                return ["Present", "Past", "Future", "Masc", "Femn", "Neut"];
            } else if (value === 5 || value === 6) {
                return ["Indicative", "Subjunctive", "Present", "Future", "Imperfect", " Perfect", "Future Perfect", "To", "Group 1", "Group 2", "Group 3", "Mixed conjugation"];
            } else return [];
        },
        options = getOptions(),
        handleChange = (event, newValue) => {
            setNounOpen(false);
            setValue(newValue);
            setNounGroup("Group 1");
            //setFilter("");
        },
        openDialog = group => {
            setNounGroup(group);
            setNounOpen(true);
        },
        openMeme = num => {
            setMemoOpen(true);
            setMeme(num)
        },
        reset = () => {
            const s = localStorage.getItem("school");
            const u = localStorage.getItem("username");
            localStorage.clear();
            localStorage.used = "yes";
            localStorage.setItem("school", s);
            localStorage.setItem("username", u);
            setResetOpen(false);
        },
        joinChallenge = c => () => {
            setValue(tabs.findIndex(t => t.toLowerCase() === c.type.toLowerCase()));
          socket.emit("join challenge", c.id, localStorage.getItem("username"), localStorage.getItem("school").toLowerCase(), m =>
            setMembers(m)
          );
          openDialog(c.group);
          setChallengeID(c.id);
          setOwnerID(c.ownerID);
        },
        input = useRef(),
        searchBox = (
      <Autocomplete
        freeSolo
        onChange={(e, newVal) => setFilter(newVal || "")}
        options={options}
        forcePopupIcon
        openOnFocus
        value={filter}
        filterOptions={a => options.filter(x => x.toLowerCase().includes(filter.toLowerCase()))}
        renderInput={(params) => (
          <TextField inputRef={input} {...params} onChange={e => setFilter(e.target.value)} value={filter}  label="Filter" style={{marginTop: -8}}/>
        )}
      />
        );
        useEffect(() => {
            document.onkeydown = e => {
                if (isHotkey("mod+f", e)) {
                    e.preventDefault();
                    input.current.focus();
                }
            }
        }, []);
        function socketJoin(u) {
            socket.emit(
                "join",
                u || localStorage.getItem("username"),
                localStorage.getItem("school").toLowerCase(),
                (u, c, i) => {
                  let newUsers = {};
                  u.forEach(x => {
                    newUsers[x.id] = x.username;
                  });
                  setUsers(newUsers);
                  setChallenges(c);
                  setSocketID(i);
                }
              );
        }
  useEffect(() => {
    socketJoin();
    socket.on("challenge created", obj => {
      setChallenges([...globalChallenges, obj]);
      globalChallengeID === "" && setOpen(obj.ownerID);
    });
    socket.on("challenge cancelled", id => {
      setChallenges(globalChallenges.filter(x => x.id !== id));
      id === globalChallengeID && setChallengeID("");
    });
    socket.on("challenge deleted", id => {
      setChallenges(globalChallenges.filter(x => x.id !== id));
    });
    socket.on("user joined", u => setUsers({ ...globalUsers, ...u }));
    socket.on("user left", id => {
        let newUsers = globalUsers;
      delete newUsers[id];
      setUsers(omit(globalUsers, id));
    });
    socket.on("disconnect", () => {
        console.log("disconnect");
        //window.location.reload();
        //sessionStorage.connect = "false";
        socket.connect();
    });
    socket.on("connect", () => {
        //console.log("connected");
    //  if (sessionStorage.connect === "false") {
            //console.log("hi");
           socketJoin();
        //}
        //sessionStorage.connect = "true"
      })
  }, []);
  useEffect(() => {
    globalUsers = users;
  }, [users]);
  useEffect(() => {
    globalChallenges = challenges;
  }, [challenges]);
  useEffect(() => {
    globalChallengeID = challengeID;
  }, [challengeID]);
  useEffect(() => {
    globalMembers = members;
  }, [members]);
  window.onbeforeunload = () => {
    socket.emit("leaving", localStorage.getItem("school").toLowerCase(), challengeID);
    sessionStorage.last = String(value);
    return;
  };
  const tabs = ["Nouns", "Adjectives","Pronouns", "Numbers", "Participles", "Actives", "Passives", "verbs other forms", "Memes", "Live", "Settings"];
    return (
        <ThemeProvider theme={theme}>
            {localStorage.getItem("used") !== "yes" && <Firsttime set={(us, s) => {setName(us); setSchool(s);socketJoin(us);}} />}
            
            <Dialog
                open={resetOpen}
                maxWidth="xl"
                fullWidth
                onClose={() => setResetOpen(false)}
            >
                <DialogTitle>Confirm action</DialogTitle>
                <DialogContent>
                    Are you sure want to reset your progress? You can't undo this!
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setResetOpen(false)}
                        color="primary"
                    >
                        close
                    </Button>
                    <Button
                        color="primary"
                        onClick={reset}
                    >
                        reset
                    </Button>
                </DialogActions>
            </Dialog>
                <AppBar
                    position="static"
                    color="default"
                    style={{
                        maxWidth: 2016,
                        margin: "0 auto",
                    }}
                >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="on"
                    >
                        {tabs.map(tab => <Tab key={tab} label={tab} />)}
                    </Tabs>
                </AppBar>
            <div style={styles.container}>
                {Object.keys(caseWords).map((type, i) => (
                    <Fragment key={i}>
                        {value === i &&
                            <Paper style={styles.paper}>
                                {searchBox}
                                <ExpansionPanel>
                                    <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    >
                                    <Typography>Notes:</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Typography>
                                            {notes[type]}
                                        </Typography>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                <List
                                    component="nav"
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Grid container>
                                        {Object.keys(caseWords[type]).filter(group => group.toLowerCase().includes(filter.toLowerCase())).map((group) => (
                                            <Grid
                                                item
                                                xs={12}
                                                md={6}
                                                key={group}
                                            >
                                                <ListItem
                                                    button
                                                    style={{
                                                        borderBottom: "1px solid #76ff03",
                                                        flexBasis: "50%",
                                                        WebkitFlexBasis: "50%",
                                                    }}
                                                    onClick={() => openDialog(group)}
                                                >
                                                    <ListItemText primary={group} />
                                                    <span>
                                                    {localStorage[group + `-${type}-time`]}{(localStorage[group + `-${type}-time`] ? "s" : "")}&nbsp;
                                                    </span>
                                                    <span 
                                                        style={{
                                                            color: localStorage[group + `-${type}-score`] && scoreColors[Math.floor(localStorage[group + `-${type}-score`].split("/")[0] / localStorage[group + `-${type}-score`].split("/")[1] * 9)]
                                                        }}
                                                    >
                                                        {localStorage[group + `-${type}-score`]}{" "}
                                                    </span>
                                                </ListItem>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </List>
                                <CaseDialog
                                    type={type}
                                    group={nounGroup}
                                    open={nounOpen}
                                    close={() => setNounOpen(false)}
                                    socketID={socketID}
                                    users={users}
                                    members={members}
                                    challengeID={challengeID}
                                    ownerID={ownerID}
                                />
                            </Paper>
                        }
                    </Fragment>
                ))}
                {Object.keys(verbs).map((type, i) => (
                    <Fragment key={i}>
                        {value === i + 5 &&
                            <Paper style={styles.paper}>
                            {searchBox}
                                {notes[type] && <ExpansionPanel>
                                    <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    >
                                    <Typography>Notes:</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Typography>
                                            {notes[type]}
                                        </Typography>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>}
                                <List
                                    component="nav"
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Grid container>
                                        {Object.keys(verbs[type]).filter(group => group.toLowerCase().includes(filter.toLowerCase())).map((group) => (
                                            <Grid
                                                item
                                                xs={12}
                                                lg={6}
                                                key={group}
                                            >
                                                <ListItem
                                                    button
                                                    style={{
                                                        borderBottom: "1px solid #76ff03",
                                                        flexBasis: "50%",
                                                        WebkitFlexBasis: "50%",
                                                    }}
                                                    onClick={() => openDialog(group)}
                                                >
                                                    <ListItemText primary={group} />
                                                    <span 
                                                        style={{
                                                            color: localStorage[group + `-${type}-score`] && scoreColors[Math.floor(localStorage[group + `-${type}-score`].split("/")[0] / localStorage[group + `-${type}-score`].split("/")[1] * 9)]
                                                        }}
                                                    >
                                                        {localStorage[group + `-${type}-score`]}&nbsp;
                                                    </span>
                                                    <span>
                                                    {localStorage[group + `-${type}-time`]}
                                                    </span>
                                                </ListItem>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </List>
                                <VerbDialog
                                    type={type}
                                    group={nounGroup}
                                    open={nounOpen}
                                    close={() => setNounOpen(false)}
                                    socketID={socketID}
                                    users={users}
                                    members={members}
                                    challengeID={challengeID}
                                    ownerID={ownerID}
                                />
                            </Paper>
                        }
                    </Fragment>
                ))}

                {value === 8 &&
                    <Paper style={styles.paper}>
                        <Typography
                            gutterBottom
                        >
                            Made by big_chair_69. Click to enlarge.
                        </Typography>
                        <Grid container>
                            {[...Array(27).keys()].map(num => (
                                <Grid
                                    item
                                    xs={6}
                                    md={4}
                                    lg={3}
                                    key={num}
                                    style={{
                                        backgroundImage: `url(/memes/${num + 1}.jpg)`,
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        height: 256,
                                        cursor: "pointer",
                                        backgroundPosition: "center",
                                        }}
                                    onClick={() => openMeme(num)}
                                />
                            ))}
                        </Grid>
                        <Dialog
                            open={memoOpen}
                            maxWidth="xl"
                            onClose={() => setMemoOpen(false)}
                            PaperProps={{
                                style: {
                                    margin: 8,
                                },
                            }}
                        >
                            <DialogTitle>Meme</DialogTitle>
                            <DialogContent>
                                <img
                                    src={`/memes/${meme + 1}.jpg`}
                                    alt=""
                                    style={{
                                        width: "100%",
                                    }}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setMemoOpen(false)} color="primary" autoFocus>
                                    close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Paper>
                }
                {value === 9 && (
                    <Card style={{borderRadius: 16, margin: 8, width: "calc(100% - 48px)", padding: 16,}}>
                        <Typography variant="h5" gutterBottom>Online Users:</Typography>
      {Object.keys(users)
        .filter((u, i, arr) => u !== socketID)
        .map(u => <Chip key={u} label={users[u]} style={{marginRight: 8}} />)}
      <br />
      <Typography variant="h5" gutterBottom style={{marginTop: 8,}}>Challenges:</Typography>
      To create a new challenge, select a group from another tab and click 'Live'. Every wrong answer adds 8 seconds to your time, so answer carefully!
      <List>
      {challenges.reverse().map(c => (
        <ListItem key={c.id} button onClick={joinChallenge(c)} style={{textTransform: "capitalize"}}>
          <Chip label={users[c.ownerID]} style={{marginRight: 8}} /> {c.type}: {c.group}
        </ListItem>
      ))}</List>
                    </Card>
                )}
                {value === 10 && (
                    <Card style={{borderRadius: 16, margin: 8, width: "calc(100% - 48px)", padding: 16,}}>
                        <TextField value={name} fullWidth label="Username" margin="dense" onChange={e => setName(e.target.value)} />
                    <TextField value={school} fullWidth margin="dense" label="School" onChange={e => setSchool(e.target.value)} />
                    <br />
                    <br />
                    <Button variant="contained" onClick={() => {
                        localStorage.setItem("username", name);
                        localStorage.setItem("school", school);
                    }} color="primary">Update</Button> &nbsp;&nbsp;
                    <Button variant="outlined" aria-label="like"color="primary" onClick={() => setResetOpen(true)}>
                reset scores
            </Button>
                    </Card>
                )}
            </div>
            <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        style={{
            zIndex: 10000,
        }}
        open={Boolean(open)}
        autoHideDuration={6000}
        onClose={() => setOpen(null)}
        message={open && users[open] + " wants to a live challenge"}
        action={
          <React.Fragment>
            <Button style={{color: "black"}} size="small" onClick={() => {setValue(9); setNounOpen(false); setOpen(null)}}>
              View
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpen(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
        </ThemeProvider>
    );
};
