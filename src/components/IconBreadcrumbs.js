import { useContext } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { dataContext } from '../pages/SettingPage';

export default function IconBreadcrumbs() {
  const { windowName } = useContext(dataContext);

  return (
    <div role="presentation" style={{margin: "16px 0px 16px 0px"}}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          style={{ display: 'flex', alignItems: 'center', color: "unset", textDecoration: "none" }}
          to="/"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          color="text.primary"
        >
          <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {windowName}
        </Typography>
      </Breadcrumbs>
    </div>
  );
}
