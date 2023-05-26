import React from 'react';
import { useStHContext } from '../Creation';

// Material UI :
/************************************************************** */
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
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
/************************************************************* */


const Stakeholder = (props) => {

    const classes = useStyles();

    const { stakeholders, setStakeholders } = useStHContext();

    const handleChange = (e) => {
        setStakeholders(stakeholders.map((sth, index) => (
            index === props.index ? {...stakeholders[index], label: e.target.value} : sth
        )))
    }

    const removeStakeholder = () => {
        setStakeholders(stakeholders.filter((elt, index) => index !== props.index && elt));
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', paddingBottom:"2em"}}>
            <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "black", textAlign: 'center'}}>
                {`Nom du rôle n°${props.index + 1} :`}
            </Typography>
            <TextField onChange={handleChange} value={stakeholders[props.index].label} id="stakeholder" label="Entrer le nom" variant="filled" style={{backgroundColor: "white", margin: '20px 100px', borderRadius: '5px'}}/>
            <Button onClick={removeStakeholder} variant="contained" style={{backgroundColor:"#2144BF", margin: '20px 100px'}}>
                <DeleteIcon style={{color: 'white'}}/>
                <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "white"}}>
                    Supprimer le rôle
                </Typography>
            </Button>
        </div>
    )
}

export default Stakeholder;
