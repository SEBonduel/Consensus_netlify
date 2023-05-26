import React, {useState} from 'react';
import { useCritContext, useAltContext } from '../Creation';


// Material UI :
/*********************************************** */
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import RemoveIcon from '@material-ui/icons/Remove';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
/**************************************************** */


const Criteria = (props) => {

    const classes = useStyles();

    const { criteria, setCriteria } = useCritContext();

    const { alternatives, setAlternatives } = useAltContext();

    const [checkedMini, setCheckedMini] = useState(true);

    const [checkedMaxi, setCheckedMaxi] = useState(false);


    // Description of a criteria :
    /********************************************************************* */
    const [displayAddDescription, setDisplayAddDescription] = useState(true);

    const displayDescription = () => {
        if (displayAddDescription) {
            setDisplayAddDescription(false);
        } else {
            setDisplayAddDescription(true);
            setCriteria(criteria.map(function(elt, ind){
                if(ind === props.index){
                    return {...criteria[ind], description: ""};
                }
                else{
                    return elt;
                }
            }));
        }
    }
    /*********************************************************************** */


    // Update of definition of a criteria :
    const handleChange = (event) => {
        setCriteria(criteria.map(function(elt, ind){
            if(ind === props.index){
                return {...criteria[ind], [event.target.id]: event.target.value};
            }
            else{
                return elt;
            }
        }));
    }

    // Update checkbox of goal of criteria (minimiser ou maximiser) :
    const handleCheckboxMini = () => {
        setCheckedMaxi(!checkedMaxi);
        setCheckedMini(!checkedMini);
        setCriteria(criteria.map(function(elt, ind){
            if(ind === props.index){
                if (!checkedMini) {
                    return {...criteria[ind], goal: false};
                } else {
                    return {...criteria[ind], goal: true};
                }             
            }
            else{
                return elt;
            }
        }));
    }



    // To remove a criteria :
    const handleClick = () => {
        setCriteria(criteria.filter((elt, index) => index !== props.index && elt));
        setAlternatives(alternatives.map(function(alt){
            return {...alt, evaluation: alt.evaluation.filter((crit, index) => index !== props.index && crit)};
        }));
    }


    return (
        <div className="criteriaDisposition">
            <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "black", textAlign: 'center'}}>
                <strong>{`Critère ${props.index + 1} :`}</strong>
            </Typography>
            <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "black", textAlign: 'left', marginLeft: '40px', marginTop: '20px '}}>
                 {`Nom du critère n°${props.index +1 }`}
            </Typography>
            <TextField onChange={handleChange} value={criteria[props.index].label} id="label" label="Entrer le nom" variant="filled" multiline style={{backgroundColor: "white", margin: '20px 80px', borderRadius: '5px'}}/>
            <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "black", textAlign: 'left', marginLeft: '40px ', marginTop: '20px '}}>
                Objectif :
            </Typography>
            <div style={{display: 'flex', margin: 'auto'}}>
                <FormControlLabel
                    control={<Checkbox checked={checkedMini} onChange={handleCheckboxMini} name="checkedG" style={{color: "black", textAlign: 'center'}} />}
                    label="Minimiser"
                />
                <FormControlLabel
                    control={<Checkbox checked={checkedMaxi} onChange={handleCheckboxMini} name="checkedD" style={{color: "black", textAlign: 'center'}} />}
                    label="Maximiser"
                />
            </div>

        {displayAddDescription ?
                        <Button onClick={displayDescription} variant="contained" style={{backgroundColor:"#2144BF", margin: '30px 90px'}}>
                        <AddIcon />
                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px',"&:hover": {
                                        transition:"0.8s",
                                        color:"yellow",
                                    },}}>
                            Ajouter une description
                        </Typography>
                        </Button> 
                        : 
                        <Button onClick={displayDescription} variant="contained" style={{backgroundColor:"#2144BF", margin: '30px 90px'}}>
                        <RemoveIcon />
                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px',"&:hover": {
                                        transition:"0.8s",
                                        color:"yellow",
                                    },}}>
                            Retirer la description
                        </Typography>
                        </Button>
                        }
                        {!displayAddDescription &&
                            <TextField
                                style={{backgroundColor: "white", margin: '20px 80px', borderRadius: '5px',}}
                                onChange={handleChange}
                                value={criteria[props.index].description}
                                id="description"
                                label="Description du critère"
                                placeholder="description ..."
                                multiline
                                variant="filled"
                            />
                        }

                        <Button 
                            onClick={handleClick} 
                            variant="contained" 
                            style={{
                                backgroundColor:"black", 
                                marginLeft: 'auto',
                            }}>

                            <DeleteIcon 
                                style={{
                                    "&:hover": {
                                        transition:"0.8s",
                                        color:"yellow",
                                    },
                                }}/>
                        </Button>

        </div>
    )
}

export default Criteria;
