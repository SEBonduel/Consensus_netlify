import React, {useState, useEffect, useContext} from 'react';
import {FirebaseContext} from '../Firebase';
import "./savedSessions.css";

// Material UI :
/****************************************************** */
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
/*************************************************************** */

const SavedSession = (props) => {

    const classes = useStyles();

    const firebase = useContext(FirebaseContext);

    const initialData = {
        description: "",
        name: "",
        date: ""
    }

    const [data, setData] = useState(initialData);

    useEffect(() => {
        if (props.session !== ""){
            firebase.db.collection("sessions").doc(props.session).get().then((doc) => {
                if (!doc.exists) return;
                setData(doc.data());
            });
        }
    }, [])

    return (
        <div className='past-session-display'>
          <div className='past-session-description'>
            <h6 className='past-session-name'>Nom de la session : {data.name}</h6>
            <h6 className='past-session-date'>Date de la session : {data.date}</h6>
          </div>
            <Button onClick={() => props.handleClick(props.session)} id={props.session} variant="contained" style={{backgroundColor:"#2144BF", marginTop:"2em"}}>
              <PlayArrowIcon />
              <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "white"}}>
                Reprendre la session
              </Typography>
            </Button> 
        </div>
    )
}

export default SavedSession;
