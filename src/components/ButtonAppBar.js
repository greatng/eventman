import * as React from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { withRouter, useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';

// menu component depends on role
function gotoMenu(roles, router) {
    // const router = useRouter();
    // const gotoSuper = () => {
    // 	router.replace("/superadmin");
    // };
    const gotoDashboard = () => {
        router.replace('/dashboard');
    };
    // if (roles.includes('SUPERADMIN')){
    // 	return ([<MenuItem key='dashboard'
    // 			onClick={gotoDashboard}>
    // 			Dashboard
    // 		</MenuItem>,
    // 		<MenuItem key='superadmin'
    // 			onClick={gotoSuper}>
    // 			Superadmin
    // 		</MenuItem>]);
    // } else {
    return (
        <MenuItem key="dashboard" onClick={gotoDashboard}>
            Dashboard
        </MenuItem>
    );
    // }
}

// AppBar component
export default function ButtonAppBar({ roles, email }) {
    const router = useRouter();
    // delete cookie and redirect when logout
    const logout = () => {
        deleteCookie('token');
        router.replace('/');
    };
    const menuContent = gotoMenu(roles, router);

    // menu anchor handle
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{ bgcolor: 'black' }}>
                <Toolbar variant="dense">
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleClick}
                        sx={{ mr: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {menuContent}
                    </Menu>
                    <Typography
                        variant="subtitle2"
                        component="div"
                        align="right"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 'light',
                            noWrap: 'true',
                        }}
                    >
                        {email}
                    </Typography>
                    <Button color="inherit" onClick={logout}>
                        <LogoutIcon sx={{ mx: 1 }} />
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
