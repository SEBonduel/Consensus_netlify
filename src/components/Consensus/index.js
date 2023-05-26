import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../Firebase';
import { usePage } from '../PageContext';
import { useCurrentSession } from '../CurrentSessionContext';
import { Radar } from 'react-chartjs-2';
import leftImg from '../../images/curved-left.svg';
import rightImg from '../../images/curved-right.svg';
import saveAs from 'file-saver';
import { useHelp } from '../HelpContext';
import explication from '../../images/consensusHelp.png';


// For Material UI :
/***************************************** */
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import HomeIcon from '@material-ui/icons/Home';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }));
/******************************************** */


const Consensus = (props) => {

    const [alternativesCopyByGroup, setAlternativesCopyByGroup] = useState([]);

    const XLSX = require('xlsx/dist/xlsx.full.min.js');

    const [consensusByGroup, setConsensusByGroup] = useState([]);

    const [alternativesCopy, setAlternativesCopy] = useState([]);

    const classes = useStyles();

    const firebase = useContext(FirebaseContext);

    const { setCurrentHelp } = useHelp();

    const [userSession, setUserSession] = useState(null);

    const {setIdCurrentSession } = useCurrentSession();

    const { setCurrentPage } = usePage();

    const [chartData, setChartData] = useState({});

    const [groupChartData, setGroupChartData] = useState([]);

    const [participantsByGroup, setParticipantsByGroup] = useState([]);

    // graph color :
    const backgroundColor = ['#1d334a', '#f39f18', '#DE0C0C', '#10DE0C', '#F4952A', '#2AF4C5', '#235E16', '#5E5616', '#1b5583' ];

    const [selection, setSelection] = useState(1);

    const [userGroup, setUserGroup] = useState("");

    const [numGroup, setNumGroup] = useState(0);

    const [downloadSelection, setDownloadSelection] = useState(0);

    const [selectionS, setSelectionS] = useState(0);

    // general information of the current session :
    const initialData = {
        alternatives: [],
        criteria: [],
        description: "",
        group: [],
        roles: [],
        name: "",
        owner: "",
        participants: {},
        round: 5,
        time: 15
    }

    const [data, setData] = useState(initialData);

    const [idSession, setIdSession] = useState("");    

    const [participants2, setParticipants2] = useState([]);

    const [consensus, setConsensus] = useState(false);

    // Update of the current user :
    useEffect(() => {
        setIdCurrentSession(true);
        setCurrentPage("global2");
        setCurrentHelp(explication);
        let listener = firebase.auth.onAuthStateChanged(user => {
            user ? setUserSession(user) : props.history.push("/");
        });
        return () => {
            listener()
        };
    }, [])

    // update of the current session :
    useEffect(() => {
        if (userSession) {
            const userSessionRef = (userSession !== null) && firebase.db.collection("users").doc(userSession.uid);
            userSessionRef &&
            userSessionRef.get().then((doc) => {
                if (!doc.exists) return;
                setIdSession(doc.data().userSessions[doc.data().userSessions.length-1]);
            })
        }
    }, [userSession])

    // Update of the session data :
    useEffect(() => {
        if (idSession !== ""){
            let unsubscribe1 = firebase.db.collection("sessions").doc(idSession).onSnapshot((doc) => {
                if (!doc.exists) return;
                setData(doc.data());
            });
            let userRef = (userSession !== null) && firebase.db.collection(`sessions/${idSession}/participants`).doc(userSession.uid).onSnapshot((doc) => {
                if (!doc.exists) return;
                setUserGroup(doc.data().userGroup);
            });
            return () => {
                unsubscribe1();
                userRef();
            }
        }
    }, [idSession])

    // Update of the participants by group :
    useEffect(() => {
        if (userGroup !== "") {
            let unsubscribe2 = firebase.db.collection(`sessions/${idSession}/participants`).where("userGroup", "==", userGroup).onSnapshot((querySnapshot) => {
                let participantsUpdated = [];
                querySnapshot.forEach((doc) => {
                    participantsUpdated.push(doc.data());
                });
                setParticipants2(participantsUpdated);
            });
            let unsubscribe3 = firebase.db.collection(`sessions/${idSession}/participants`).onSnapshot((querySnapshot) => {
                let participantsByGroupUpdated = [];
                for (let i = 0; i < group.length; i++) {
                    participantsByGroupUpdated.push([]);
                }
                querySnapshot.forEach((doc) => {
                    participantsByGroupUpdated[parseInt(doc.data().userGroup.substr(7)) - 1].push(doc.data());
                })
                setParticipantsByGroup(participantsByGroupUpdated);
            })
            return () => {
                unsubscribe2();
                unsubscribe3();
            }
        }
    }, [userGroup])


    // To know if there is a consensus or not
    useEffect(() => {
        let consensusUpdated = true;
        participants2.map(p => {
            if (p.noconsensus) consensusUpdated = false;
        })
        setConsensus(consensusUpdated);
    }, [participants2])


    useEffect(() => {
        let consensusByGroupUpdated = [];
        for (let i = 0; i < participantsByGroup.length; i++) {
            let consensusUpdated = true;
            participantsByGroup[i].map(p => {
                if (p.noconsensus) consensusUpdated = false;
            })
            if (participantsByGroup[i].length === 0) consensusUpdated = false;
            consensusByGroupUpdated.push(consensusUpdated);
        }
        setConsensusByGroup(consensusByGroupUpdated);
    }, [participantsByGroup, numGroup])


    useEffect(() => {
        let datasetInit = []
        let sumCriteriaWeight = [];
        participants2.map((p, ind) => {
            datasetInit.push({
                label: p.userPseudo,
                data: (p.criteriaWeight).map(cw => cw.weight),
                backgroundColor: backgroundColor[ind],
                borderWidth: 4
            });
            p.criteriaWeight.map((crit, index) => {
                sumCriteriaWeight[index] += parseFloat(crit.weight);
            });
        });
        sumCriteriaWeight.map(sumCrit => sumCrit/participants2.length);
        setChartData({
            labels: criteria.map(crit => crit.label),
            datasets: datasetInit,
        })


        let groupChartDataUpdated = [];
        for (let i = 0; i < participantsByGroup.length; i++) {
            let datasetInit = []
            let sumCriteriaWeight = [];
            participantsByGroup[i].map((p, ind) => {
                datasetInit.push({
                    label: p.userPseudo,
                    data: (p.criteriaWeight).map(cw => cw.weight),
                    backgroundColor: backgroundColor[ind],
                    borderWidth: 4
                });
                p.criteriaWeight.map((crit, index) => {
                    sumCriteriaWeight[index] += parseFloat(crit.weight);
                });
            });
            sumCriteriaWeight.map(sumCrit => sumCrit/participants2.length);
            let groupData = {
                labels: criteria.map(crit => crit.label),
                datasets: datasetInit,
            };
            groupChartDataUpdated.push(groupData);
        }
        setGroupChartData(groupChartDataUpdated);
    }, [data, participants2, participantsByGroup, numGroup])




    /************************************************************* */

    // Update of the classification of alternatives
    useEffect(() => {
        if (participants2.length !== 0) {
            let alternatives2 = alternatives;
            alternatives2 = alternatives2.map(a => { return {...a, users: []}});
            participants2.map(p => {
                alternatives2.map((a, ind) => {
                    if (ind === p.bestAlternative) {
                        let usersCopy = a.users;
                        usersCopy.push(p.userPseudo);
                        return {...a, users: usersCopy};
                    }
                });
            });
            setAlternativesCopy(alternatives2);
        }
    }, [participants2])

    // Update of the classification of alternatives for all groups
    useEffect(() => {
        if (participantsByGroup.length !== 0) {
            let alternativesCopyByGroupUpdated = [];
            for (let i = 0; i < participantsByGroup.length; i++) {
                let alternatives2 = alternatives;
                alternatives2 = alternatives2.map(a => { return {...a, users: []}});
                participantsByGroup[i].map(p => {
                    alternatives2.map((a, ind) => {
                        if (ind === p.bestAlternative) {
                            let usersCopy = a.users;
                            usersCopy.push(p.userPseudo);
                            return {...a, users: usersCopy};
                        }
                    });
                });
                alternativesCopyByGroupUpdated.push(alternatives2);
            }
            setAlternativesCopyByGroup(alternativesCopyByGroupUpdated);
        }
    }, [participantsByGroup, numGroup])


    /******************************************************************* */


    // Filter
    const handleSelection = e => {
        setSelection(e.target.value);
    }

    // Second filter
    const handleSelectionS = e => {
        setSelectionS(e.target.value);
    }

    // radar for all groups :
    /************************************************ */
    const left = () => {
        (numGroup !== 0) && setNumGroup(numGroup-1);
    }

    const right = () => {
        (numGroup !== participantsByGroup.length - 1) && setNumGroup(numGroup+1);
    }
    /************************************************ */

    // destructuring of general data of the current session
    const { alternatives, criteria, group, name} = data;

    // To order alternatives :
    const orderedAlternatives = alternativesCopy;
    orderedAlternatives.sort(function compare(a, b) {
        if (a.users.length > b.users.length)
            return -1;
        if (a.users.length < b.users.length)
            return 1;
        return 0;
    });

    // To order alternatives by group :
    const orderedAlternativesByGroup = alternativesCopyByGroup;
    for (let i = 0; i < orderedAlternativesByGroup.length; i++) {
        orderedAlternativesByGroup[i].sort(function compare(a, b) {
            if (a.users.length > b.users.length)
                return -1;
            if (a.users.length < b.users.length)
                return 1;
            return 0;
        });
    }
    
    // Update group selection for download :
    const handleChange = e => {
        setDownloadSelection(e.target.value);
    }

    // Functions to download recap in xlsx format :
    /************************************************************************************************************************************* */
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
      
      const downloadExcel = () => {
        if (participantsByGroup.length !== 0 && participantsByGroup[downloadSelection].length !== 0 && participantsByGroup[downloadSelection][0].step === 'C') {
          var wb = XLSX.utils.book_new();
          wb.Props = {
            Title: "Sheet tuto",
            Subject: "test file",
            Author: "Lucas et Diane",
            CreatedDate: new Date(2021,5,5)
          };
          for (let k = 0; k < participantsByGroup[downloadSelection][0].userStage; k++) {
            wb.SheetNames.push(`Tour ${k+1}`);
            let ws_data = [];
            for (let i = 0; i < participantsByGroup[downloadSelection].length; i++) {
              ws_data.push([`Rôle : ${participantsByGroup[downloadSelection][i].userRole}`, "Critère", "Poids"]);
              participantsByGroup[downloadSelection][i].criteriaByStep[k+1].map((crit, ind) => {
                ws_data.push(["", `${crit.label}`, `${crit.weight}`]);
              })
              ws_data.push(["", "", ""]);
              ws_data.push(["", "", ""]);
            }
            let ws = XLSX.utils.aoa_to_sheet(ws_data);
            wb.Sheets[`Tour ${k+1}`]= ws;
          }
          let wbout = XLSX.write(wb, {bookType:'xlsx', type: 'binary'});
          saveAs(new Blob([s2ab(wbout)],{type: "application/octet-stream"}), `data_${name}_groupe${downloadSelection+1}.xlsx`);
        }
      }
    /**************************************************************************************************************************** */

    return (
        <div className="creationDesign">
            <div className="head">
                <h1 style={{textAlign: 'center', color: '#1d334a', fontSize: '35px'}}>{`La session "${name}" est terminée`}</h1>
                <hr/>
                <div style={{margin: 'auto'}}>
                    <div style={{display: 'flex', margin: 'auto', justifyContent: 'space-between', width: '15vw'}}>
                        <h4 style={{textAlign: 'center', color: '#1d334a', fontSize: '20px', marginTop: '25px'}}>Filtre : </h4>
                        <FormControl variant="filled" className={classes.formControl} style={{backgroundColor: '#fdf4e3', width: '10vw'}}>
                            <InputLabel id="demo-simple-select-filled-label">Groupe</InputLabel>
                            <Select
                            labelId="demo-simple-select-filled-label"
                            onChange={handleSelectionS}
                            style={{backgroundColor: '#ffffff'}}
                            >
                            <MenuItem value={1}>Général</MenuItem>
                            <MenuItem value={0}>Mon groupe</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <h5 style={{textAlign: 'center', color: '#1d334a', marginTop: '40px'}}>{`Groupe ${numGroup+1}`}</h5>
                    {selectionS === 0 ? <h3 style={{textAlign: 'center', color: '#1d334a', fontSize: '30px', marginTop: '50px'}}>{consensus ? "Le consensus est atteint !" : "Le consensus n'est pas atteint !"}</h3>
                    :
                    <h3 style={{textAlign: 'center', color: '#1d334a', fontSize: '30px', marginTop: '50px'}}>{consensusByGroup[numGroup] ? "Le consensus est atteint !" : "Le consensus n'est pas atteint !"}</h3>
                    }
                    {selectionS === 0 ? 
                    (consensus ? 
                    <div style={{backgroundColor: '#2271b3', borderRadius: '5px', margin: '20px 250px'}}>
                        <h3 style={{color: '#fdf4e3', margin: '10px', fontSize: '20px'}}>Scénario retenu</h3>
                        <div className="recapAlternativesDescription">
                            <h4 style={{color: '#fdf4e3', margin: '10px', textAlign: 'center', fontSize: '25px'}}>{orderedAlternatives.length !== 0 && (orderedAlternatives[0].label)}</h4>
                            <h4>{orderedAlternatives.length !== 0 && ((orderedAlternatives[0].description !== "") && "Description : " + orderedAlternatives[0].description)}</h4>
                        </div>
                    </div>
                    :
                    orderedAlternatives.map((alt, index) => (
                        <>
                            <div style={{backgroundColor: '#2271b3', margin: 'auto', borderRadius: '10px', width: '35vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                                <div>
                                    <h4 style={{fontWeight:`${index === 0 && 'bold'}`, color: '#ffffff', margin: '20px 80px', textAlign: 'center'}}>{`Scénario ${++index} : ${alt.label} - ${((alt.users.length/participants2.length)*100).toFixed(2)} % des participants`}</h4>
                                </div>
                                <div style={{margin: 'auto'}}>
                                <div style={{backgroundColor: '#fdf4e3', borderRadius: '5px', width: '20vw', margin: 'auto'}}>
                                    <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "#1d334a", textAlign: 'center', margin: '20px 20px'}}>
                                        Liste des participants :
                                    </Typography>
                                    {alt.users.map(userName => (
                                        <h5 style={{color: '#1d334a', textAlign: 'center', margin: '20px 10px'}}>{userName}</h5>
                                        ))}
                                </div>
                                </div>
                            </div>
                            <br/>
                        </>
                                )))
                            :
                            (consensusByGroup[numGroup] ?
                                <div style={{backgroundColor: '#2271b3', borderRadius: '5px', margin: '20px 250px'}}>
                                    <h3 style={{color: '#fdf4e3', margin: '10px', fontSize: '20px'}}>Scénario retenu</h3>
                                    <div className="recapAlternativesDescription">
                                        <h4 style={{color: '#fdf4e3', margin: '10px', textAlign: 'center', fontSize: '25px'}}>{orderedAlternativesByGroup[numGroup].length !== 0 && (orderedAlternativesByGroup[numGroup][0].label)}</h4>
                                        <h4>{orderedAlternativesByGroup[numGroup].length !== 0 && ((orderedAlternativesByGroup[numGroup][0].description !== "") && "Description : " + orderedAlternativesByGroup[numGroup][0].description)}</h4>
                                    </div>
                                </div> :
                                    orderedAlternativesByGroup[numGroup].map((alt, index) => (
                                        <>
                                            <div style={{backgroundColor: '#2271b3', margin: 'auto', borderRadius: '10px', width: '35vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                                                <div>
                                                    <h4 style={{fontWeight:`${index === 0 && 'bold'}`, color: '#ffffff', margin: '20px 80px', textAlign: 'center'}}>{`Scénario ${++index} : ${alt.label} - ${((alt.users.length/participantsByGroup[numGroup].length)*100).toFixed(2)} % des participants`}</h4>
                                                </div>
                                                <div style={{margin: 'auto'}}>
                                                    <div style={{backgroundColor: '#fdf4e3', borderRadius: '5px', width: '20vw', margin: 'auto'}}>
                                                    <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "#1d334a", textAlign: 'center', margin: '20px 20px'}}>
                                                        Liste des participants :
                                                    </Typography>
                                                    {alt.users.map(userName => (
                                                        <h5 style={{color: '#1d334a', textAlign: 'center', margin: '20px 10px'}}>{userName}</h5>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                        </>
                                        )))
                            }
                    <hr/>
                    <div style={{display: 'flex', margin: 'auto', justifyContent: 'space-between', width: '15vw'}}>
                        <h4 style={{textAlign: 'center', color: '#1d334a', fontSize: '20px', marginTop: '25px'}}>Filtre : </h4>
                        <FormControl variant="filled" className={classes.formControl} style={{backgroundColor: '#fdf4e3', width: '10vw'}}>
                            <InputLabel id="demo-simple-select-filled-label">Groupe</InputLabel>
                            <Select
                            labelId="demo-simple-select-filled-label"
                            onChange={handleSelection}
                            style={{backgroundColor: '#ffffff'}}
                            >
                            <MenuItem value={0}>Général</MenuItem>
                            <MenuItem value={1}>Mon groupe</MenuItem>
                            </Select>
                        </FormControl>
                        </div>
                    </div>
                    <div style={{margin: 'auto', marginTop: '20px'}}>
                        {selection === 1 ?
                            <div className="radarContainer">
                                <Radar className="negoRadar" data={chartData} options={{maintainAspectRatio: false}}/>
                            </div> : 
                            <div className="radarGroupContainer">
                                <h5 style={{textAlign: 'center', color: '#1d334a'}}>{`Groupe ${numGroup+1}`}</h5>
                            <div className="radarGroup">
                                <div className="leftContainerImg">
                                    <img className="leftImg" src={leftImg} alt="" onClick={left}/>
                                </div>
                                <div className="radarContainer">
                                    <Radar className="negoRadar" data={groupChartData[numGroup]} options={{maintainAspectRatio: false}}/>
                                </div>
                                <div className="rightContainerImg">
                                    <img className="rightImg" src={rightImg} alt="" onClick={right}/>
                                </div>
                            </div>
                    </div>}
                </div>
            <div style={{display: 'flex', margin: 'auto', justifyContent: 'space-between', width: '25vw'}}>
                <h4 style={{textAlign: 'center', color: '#1d334a', fontSize: '20px', marginTop: '25px'}}>Sélectionnez le groupe et téléchargez les données : </h4>
                <FormControl variant="filled" className={classes.formControl} style={{backgroundColor: '#fdf4e3', width: '10vw', marginTop: '15px'}}>
                        <InputLabel id="demo-simple-select-filled-label">Groupe</InputLabel>
                        <Select
                        labelId="demo-simple-select-filled-label"
                        onChange={handleChange}
                        id="selectGroup"
                        style={{backgroundColor: '#ffffff'}}
                        value={downloadSelection}
                        >
                        {group && group.map((gr, ind) => (
                            <MenuItem value={ind} key={ind}>{gr}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </div>
                    <Button onClick={downloadExcel} variant="contained" style={{backgroundColor:"rgb(241, 207, 12)", margin: 'auto', marginTop: '30px'}}>
                        <GetAppIcon style={{color:'#1d334a'}} />
                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                            Télécharger l'évolution des poids
                        </Typography>
                    </Button>
                    <Button onClick={() => props.history.push("/landing")} variant="contained" style={{backgroundColor:"rgb(241, 207, 12)", margin: 'auto', marginTop: '30px', marginBottom: '100px'}}>
                        <HomeIcon style={{color:'#1d334a'}} />
                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "#1d334a"}}>
                            Retour au menu principal
                        </Typography>
                    </Button>
                </div>
        </div>
    )
}



export default Consensus;