import React, {useState} from 'react';
import { useAltContext } from '../Creation';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import RemoveIcon from '@material-ui/icons/Remove';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';


// For Material UI :

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


const Alternative = (props) => {

    // For Matrial UI :

    const classes = useStyles();

    // Description option :

    const [displayAddDescription, setDisplayAddDescription] = useState(true);

    const displayDescription = () => {
        if (displayAddDescription) {
            setDisplayAddDescription(false);
        } else {
            setDisplayAddDescription(true);
            setAlternatives(alternatives.map(function(elt, ind){
                if(ind === props.num){
                    return {...alternatives[ind], description: ""};
                }
                else{
                    return elt;
                }
            }));
        }
    }

    // Use of context to modify "alternatives" :
    const { alternatives, setAlternatives } = useAltContext();

    // Function to update "alternatives" :
    const handleChange = (event) => {
        setAlternatives(alternatives.map(function(elt, ind){
            // update of the correct alternative :
            if(ind === props.num){
                return {...alternatives[ind], [event.target.id]: event.target.value};
            }
            else{
                return elt;
            }
        }));
    }

    // Function to remove a alternative :
    const removeAlternative = () => {
        setAlternatives(alternatives.filter((elt, index) => index !== props.num && elt));
    }

    return (
        <div className="alternativeDisposition">
                <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "black", textAlign: 'center'}}>
                    <strong>{`Scénario ${props.num + 1} :`}</strong>
                </Typography>
                <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "black", textAlign: 'center', marginTop: '20px'}}>
                {`Nom du scénario n°${props.num + 1} :`}
                </Typography>
                <TextField onChange={handleChange} value={alternatives[props.num].label} multiline id="label" label="Entrer le nom" variant="filled" style={{backgroundColor: "white", margin: '20px 40px', borderRadius: '5px'}}/>
                <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '20px', color: "black", textAlign: 'center'}}>
                            Evaluation des critères :
                </Typography>
                {props.criteria.map((item, index) => (
                            <>
                            <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', color: "black", textAlign: 'center', marginTop: '20px'}}>
                            {`Evaluation du critere :`} {`${props.criteria[index].label}`}
                            </Typography>
                            <TextField
                        style={{backgroundColor: "transparent", margin: '20px 40px', borderRadius: '5px'}}
                        onChange={(event) => {
                            setAlternatives(alternatives.map(function(alt, ind){
                                if(ind === props.num){
                                    return {...alternatives[ind], evaluation: alternatives[ind].evaluation.map(function(crit, indexCrit){
                                        if(indexCrit === index){
                                            return event.target.value;
                                        }
                                        else{
                                            return crit;
                                        }
                                    })};
                                }
                                else{
                                    return alt;
                                }
                            }));
                        }}
                        value={alternatives[props.num].evaluation[index]}
                        id="evaluation"
                        label={props.criteria[index].label !== "" ? props.criteria[index].label : ""}
                        type="number"
                        min="0"
                        key={item.id}
                        />
                        </>        
                    ))}
                    {displayAddDescription ?
                        <Button onClick={displayDescription} variant="contained" style={{backgroundColor:"#2144BF", margin: '30px 50px'}}>
                        <AddIcon />
                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', "&:hover": {
                            color: "yellow",
                            transition:'0.5s',
                            },}}>
                            Ajouter une description
                        </Typography>
                        </Button> 
                        : 
                        <Button onClick={displayDescription} variant="contained" style={{backgroundColor:"#2144BF", margin: '30px 50px'}}>
                        <RemoveIcon />
                        <Typography className={classes.title} variant="h6" noWrap style={{fontSize: '15px', "&:hover": {
                            color: "yellow",
                            transition:'0.5s',
                            },}}>
                            Retirer la description
                        </Typography>
                        </Button>
                        }
                        {!displayAddDescription &&
                            <TextField
                                style={{backgroundColor: "white", margin: '20px 40px', borderRadius: '5px'}}
                                onChange={handleChange}
                                value={alternatives[props.num].description}
                                id="description"
                                label="Description du scénario"
                                placeholder="description ..."
                                multiline
                                variant="filled"
                            />
                        }
                        <Button onClick={removeAlternative} variant="contained" style={{backgroundColor:"#1d334a", marginLeft: 'auto'}}>
                            <DeleteIcon style={{"&:hover": {
                                        transition:"0.8s",
                                        color:"yellow",
                                    },}}/>
                        </Button>
        </div>
    )
}

export default Alternative;

