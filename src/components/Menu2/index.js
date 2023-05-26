import React, { useState } from 'react';
import Logout from '../Logout';
import {NavLink} from 'react-router-dom';
import { useHelp } from '../HelpContext';
import Modal from '../Modal';


// Material UI :
/*********************************************************** */
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';


const BUTTON_WRAPPER_STYLES = {
  position: 'relative',
  zIndex: 1
}

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));
/********************************************************************* */



export default function PrimarySearchAppBar(props) {

  const [isOpen, setIsOpen] = useState(false);

  const { currentHelp } = useHelp();

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton color="inherit" onClick={() => setIsOpen(true)}>
            <HelpOutlineIcon />
            <p>Aide</p>
        </IconButton>
      </MenuItem>
      <MenuItem>
        <Logout />
      </MenuItem>
      <MenuItem>
      <NavLink to="/profile" className="nvLinkProfileMobile">
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profil</p>
        </NavLink>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" style={{backgroundColor: '#2271b3', height: '7.5vh'}}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <NavLink to="/landing" className="nvLinkLanding">
            <HomeIcon style={{margin: 'auto'}} />
            <Typography className={classes.title} variant="h6" noWrap>
            Sessions
          </Typography>
          </NavLink>
          </IconButton>

          <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
            <NavLink to="/profile" className="nvLinkProfile">
              <AccountCircle style={{margin: 'auto'}} />
              <Typography className={classes.title} variant="h6" noWrap>
            Profil
          </Typography>
          </NavLink>
            </IconButton>
            

          <Typography className={classes.title} variant="h6" noWrap style={{marginLeft: '33%'}}>
          <NavLink to="/landing" className="nvlogo">
            ConsensUs
            </NavLink>
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={() => setIsOpen(true)}
              color="inherit"
              style={{marginRight: '25px'}}
            >
              <HelpOutlineIcon />
              <Typography className={classes.title} variant="h6" noWrap>
            Aide
          </Typography>
            </IconButton>
            <Logout/>
              <div style={BUTTON_WRAPPER_STYLES}>
                  <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                  <img style={{width: '80vw', height: '80vh'}} src={currentHelp} alt=""/>
                  </Modal>
                </div>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreVertIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );

}


