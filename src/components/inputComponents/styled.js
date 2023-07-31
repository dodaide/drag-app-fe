import styled from "@emotion/styled";
import SettingsIcon from "@mui/icons-material/Settings";
import { DataGrid } from "@mui/x-data-grid";

export const AnimatedSettingIcon = styled(SettingsIcon)`
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
  transition: opacity 0.3s ease;
`;

export const StyledDataGrid = styled(DataGrid)`
  .MuiDataGrid-columnHeaders {
    display: none;
  }
  .MuiDataGrid-cell ~ .MuiDataGrid-cell {
    border-left: 1px solid rgba(224, 224, 224, 1);
  }
`;
