import { Typography, Box } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import SecurityIcon from '@mui/icons-material/Security';
import { useEffect, useState, useCallback, useMemo } from 'react';

// patch modified role in DB
// see pages/api/users/[userid].js
async function callPatchApi(userId, roles) {
    await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            roles: roles,
        }),
        headers: {
            'Content-type': 'application/json',
        },
    });
}
// toggle role for user and admin, superadmin will not affect
function toggleRole(user, id) {
    if (!user.roles.includes('SUPERADMIN')) {
        if (user.roles.includes('ADMIN')) {
            const index = user.roles.indexOf('ADMIN');
            if (index > -1) user.roles.splice(index, 1);
        } else {
            user.roles.push('ADMIN');
        }
        // console.log(user.roles);
        callPatchApi(id, user.roles);
        return user.roles;
    } else return user.roles;
}

function SuperAdminData({ alluser }) {
    // prepare initial rows
    const initialRows = alluser.map((user, idx) => ({
        id: user._id,
        idx: idx + 1,
        name: user.name,
        email: user.email,
        roles: user.roles,
    }));
    const [rows, setRows] = useState(initialRows);

    // re-render when rows updated
    useEffect(() => {
        async function UserUpdate(UserJson) {
            for (let i = 0; i < UserJson.length; i++) delete UserJson[i]['idx'];
        }
        const UserJson = JSON.parse(JSON.stringify(rows));
        UserUpdate(UserJson);
    }, [rows]);

    const toggleAdmin = useCallback(
        (id) => () => {
            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.id === id ? { ...row, roles: toggleRole(row, id) } : row
                )
            );
        },
        []
    );

    const columns = useMemo(
        () => [
            { field: 'idx', headerName: 'No.' },
            { field: 'name', headerName: 'Name', minWidth: 300, flex: 1 },
            { field: 'email', headerName: 'Email', minWidth: 250, flex: 1 },
            { field: 'roles', headerName: 'Roles', width: 250 },
            {
                field: 'actions',
                headerName: 'Toggle Admin',
                type: 'actions',
                width: 120,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<SecurityIcon />}
                        label="Toggle Admin"
                        onClick={toggleAdmin(params.id)}
                        key={params.id}
                    />,
                ],
            },
        ],
        [toggleAdmin]
    );

    return (
        <Box sx={{ height: '600px', width: '100%' }}>
            <Box sx={{ display: 'flex' }}>
                <Typography sx={{ flexGrow: 1 }} variant="h6" key="superdash">
                    Superadmin Dashboard
                </Typography>
            </Box>
            <DataGrid rows={rows} columns={columns} />
        </Box>
    );
}

export default SuperAdminData;
