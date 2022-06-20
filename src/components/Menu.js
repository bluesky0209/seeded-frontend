import { useState,Fragment } from 'react'; 
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

export default function Menu() {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open)  =>(event)=> {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        console.log("evnet")
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
            <ListItem button >
                <a href='https://seeded.network'>ABOUT</a>
            </ListItem>
            <ListItem button >
                <a href="/projects">PROJECTS</a>
            </ListItem>
            <ListItem button >
                <a href='/nft'>NFT</a>
            </ListItem>
            <ListItem button >
                <a href="/staking">STAKING</a>
            </ListItem>
            <ListItem button >
                <a href='https://docs.google.com/forms/u/5/d/e/1FAIpQLSemnN7kqHFyM3ENrrXlJi_P7sCd0W4e-AnwCOPrjsp7XyA4YA/viewform'>APPLY</a>
            </ListItem>
            <ListItem button >
                <a href='https://seeded.network/whitepaper' target={'_blank'}>DOCS</a>
            </ListItem>
            <ListItem button >
                <a href='https://linktr.ee/seedednetwork' target={'_blank'}>SOCIALS</a>
            </ListItem>
            <ListItem button >
                <a href='https://jup.ag/swap/USDC-SEEDED' target={'_blank'}>BUY</a>
            </ListItem>

        {/* ))} */}
      </List>
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <Fragment key={anchor}>
          <IconButton style={{color:'white'}} onClick={toggleDrawer(anchor, true)}><MenuIcon/></IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </Fragment>
      ))}
    </div>
  );
}