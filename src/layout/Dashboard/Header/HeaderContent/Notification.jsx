import { useContext, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import { AuthContext } from 'contexts/authContext';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// Styles for the scrollable area
const scrollableListSX = {
  maxHeight: 400, // Adjust the height as needed
  overflowY: 'auto'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function Notification() {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [read, setRead] = useState(2);
  const [open, setOpen] = useState(false);
  
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = 'grey.100';
  const { notifications } = useContext(AuthContext);

  // Helper function to format ISO date string
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  // Sort notifications by creation time (newest first)
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : 'transparent' }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={read} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 300, maxWidth: { xs: 300, md: 450 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <>
                      {read > 0 && (
                        <Tooltip title="Mark as all read">
                          <IconButton color="success" size="small" onClick={() => setRead(0)}>
                            <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      ...scrollableListSX,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    {sortedNotifications.length > 0 ? (
                      sortedNotifications.map((notification, index) => {
                        const { date, time } = formatDate(notification.createdAt);
                        return (
                          <div key={notification.id}>
                            <ListItemButton>
                              <ListItemAvatar>
                                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                                  <BellOutlined />
                                </Avatar>
                              </ListItemAvatar>
                              <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                <Typography variant="h6" component="div" noWrap>
                                  <Typography 
                                    component="span" 
                                    variant="subtitle1" 
                                    fontWeight="bold" 
                                    sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                  >
                                    {notification.title}
                                  </Typography>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  Booking ID: {notification.bookingId}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  {date} {time}
                                </Typography>
                              </Box>
                              <ListItemSecondaryAction>
                                <Typography variant="caption" noWrap>
                                  {time}
                                </Typography>
                              </ListItemSecondaryAction>
                            </ListItemButton>
                            {/* Add a divider between items, but not after the last item */}
                            {index < sortedNotifications.length - 1 && <Divider />}
                          </div>
                        );
                      })
                    ) : (
                      <ListItemButton>
                        <Box sx={{ p: 1 }}>
                          <Typography variant="body2">No notifications</Typography>
                        </Box>
                      </ListItemButton>
                    )}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
