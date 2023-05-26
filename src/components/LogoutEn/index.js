import React, {useContext} from 'react';
import {FirebaseContext} from '../Firebase';
import { useCurrentSession } from '../CurrentSessionContext';

// Material UI :
/*********************************************************** */
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
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


const LogoutEn = () => {

    const classes = useStyles();

    const firebase = useContext(FirebaseContext);

    const { setIdCurrentSession } = useCurrentSession();

    const handleClick = () => {
        setIdCurrentSession(false);
        firebase.signoutUser();
    }

    return (
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleClick}
            color="inherit"
          >
              <Typography className={classes.title} variant="h6" noWrap>
                Disconnect
              </Typography>
          </IconButton>
    )
}

export default LogoutEn;
