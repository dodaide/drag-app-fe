import * as React from "react";
import {
  useEffect,
  useState,
  useContext,
  useRef,
  useImperativeHandle,
} from "react";
import { dataContext } from "../../pages/SettingPage";
import { StyledDataGrid, AnimatedSettingIcon } from "./styled";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  InputLabel,
  Input,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Stack,
} from "@mui/material";
import { generateColumnsFromRows } from "../../utils/generateColumns";

function SimpleDialog(props) {
  const { onClose, open, componentIndex } = props;
  const { windows, setWindows } = useContext(dataContext);
  const [fieldName, setFieldName] = useState("");
  let tempRows = useRef([]);
  const [numberRows, setNumberRows] = useState(3);
  const [numberColumns, setNumberColumns] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const [minWidth, setMinWidth] = useState(0);

  function getDataFromTable(params) {
    tempRows.current = tempRows.current.map((item) =>
      item.id === params.id ? params.row : item
    );
    return `${params.row.col1 || ""}`;
  }

  const handleChangeRow = (e) => {
    const num = e.target.value;
    if (num > 0 && !isEditing) {
      let currentRow = tempRows.current;
      setNumberRows(num);
      if (currentRow.length < num)
        for (let i = currentRow.length + 1; i <= num; i++) {
          const newRow = { id: i };
          for (let j = 1; j <= Object.keys(currentRow[0]).length - 1; j++) {
            newRow[`col${j}`] = "";
          }
          currentRow.push(newRow);
        }
      else if (currentRow.length > num) {
        tempRows.current = currentRow.slice(0, num);
      }
    }
  };

  const handleChangeColumn = (e) => {
    const num = e.target.value;
    if (num > 0 && !isEditing) {
      setNumberColumns(num);
      let currentRow = tempRows.current;
      currentRow.forEach((row) => {
        const numCols = Object.keys(row).length - 1;
        if (num > numCols) {
          for (let i = numCols + 1; i <= num; i++) {
            row[`col${i}`] = "";
          }
        } else if (num < numCols) {
          for (let i = numCols; i > num; i--) {
            delete row[`col${i}`];
          }
        }
      });
    }
  };

  useEffect(() => {
    if (windows[componentIndex]?.data) {
      setFieldName(windows[componentIndex].data.fieldName);
      setMinWidth(windows[componentIndex].data.minWidth);
      tempRows.current = windows[componentIndex].data.rows;
      setNumberRows(tempRows.current.length);
      setNumberColumns(Object.keys(tempRows.current[0]).length - 1);
    }
  }, [windows, componentIndex]);

  const handleSave = () => {
    const cloneData = [...windows];
    cloneData[componentIndex].data = {
      fieldName,
      minWidth,
      rows: tempRows.current,
    };
    setWindows(cloneData);
    onClose();
  };

  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>Table Settings</DialogTitle>
      <DialogContent dividers>
        <Box>
          <InputLabel htmlFor="field-name">Field name</InputLabel>
          <Input
            id="field-name"
            fullWidth
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />
          <InputLabel sx={{mt: 1}}>Min width</InputLabel>
          <Input
            value={minWidth}
            fullWidth
            type="number"
            onChange={(e) => setMinWidth(e.target.value)}
          />
          <Stack direction="row" spacing={2} mt={2}>
            <TextField
              fullWidth
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">rows</InputAdornment>
                ),
              }}
              value={numberRows}
              onChange={handleChangeRow}
            />
            <TextField
              fullWidth
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">columns</InputAdornment>
                ),
              }}
              value={numberColumns}
              onChange={handleChangeColumn}
            />
          </Stack>
        </Box>
        <div
          style={{
            position: "relative",
            marginTop: 20,
          }}
        >
          <StyledDataGrid
            onCellEditStart={() => setIsEditing(true)}
            onCellEditStop={() => setIsEditing(false)}
            autoHeight
            rows={tempRows.current}
            hideFooter
            columns={generateColumnsFromRows(
              tempRows.current,
              true,
              getDataFromTable
            )}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function TableComponent(props, ref) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { windows } = useContext(dataContext);
  const { componentIndex, cantEdit, changeRecordValue, initialValue } = props;
  let tempRows = useRef(initialValue || windows[componentIndex].data.rows);

  function editTable(params) {
    tempRows.current = tempRows.current.map((item) =>
      item.id === params.id ? params.row : item
    );
    return `${params.row.col1 || ""}`;
  }

  useImperativeHandle(ref, () => ({
    updateValue: () => {
      changeRecordValue(tempRows.current);
    },
  }));

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  if (!cantEdit)
    return (
      <div
        style={{
          width: "452px",
        }}
      >
        <StyledDataGrid
        autoHeight
          rows={tempRows.current}
          hideFooter
          columns={generateColumnsFromRows(tempRows.current, true, editTable)}
        />
      </div>
    );
  else
    return (
      <div
        style={{
          position: "relative",
          width: "452px",
          height: "157.5px",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <StyledDataGrid
          rows={windows[componentIndex].data.rows}
          hideFooter
          columns={generateColumnsFromRows(
            windows[componentIndex].data.rows,
            false
          )}
        />
        <AnimatedSettingIcon
          color="action"
          sx={{ opacity: hovered ? 1 : 0 }}
          onClick={handleClickOpen}
        />
        <SimpleDialog
          open={open}
          onClose={handleClose}
          componentIndex={componentIndex}
        />
      </div>
    );
}

export default React.forwardRef(TableComponent);
