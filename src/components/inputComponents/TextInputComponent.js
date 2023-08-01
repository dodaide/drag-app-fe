import {
  TextField,
  Dialog,
  DialogTitle,
  Input,
  InputLabel,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { AnimatedSettingIcon } from "./styled";
import { useState, useContext, useEffect } from "react";
import { dataContext } from "../../pages/SettingPage";
import { TYPE_TEXT, TYPE_AREA, TYPE_LABEL } from "../../utils/constants";

function SimpleDialog(props) {
  const { onClose, open, componentIndex, type, textFieldProps } = props;
  const { windows, setWindows } = useContext(dataContext);
  const [fieldName, setFieldName] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [isHide, setIsHide] = useState(false);
  const [isEmail, setisEmail] = useState(false);
  const [minWidth, setMinWidth] = useState(0);

  useEffect(() => {
    setFieldName(textFieldProps.label);
    setDefaultValue(textFieldProps.value);
    setIsRequired(windows[componentIndex].data.isRequired);
    setIsHide(windows[componentIndex].data.isHide);
    setisEmail(windows[componentIndex].data.isEmail);
    setMinWidth(windows[componentIndex].data.minWidth);
  }, [windows, componentIndex, textFieldProps]);

  const handleSave = () => {
    const cloneData = [...windows];
    if (type === TYPE_TEXT || type === TYPE_AREA)
      cloneData[componentIndex].data = {
        fieldName,
        minWidth,
        defaultValue,
        isHide,
        isRequired,
        isEmail,
      };
    else if (type === TYPE_LABEL)
      cloneData[componentIndex].data = {
        fieldName: "Label",
        minWidth,
        defaultValue: fieldName,
      };
    setWindows(cloneData);
    onClose();
  };

  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>{type} Settings</DialogTitle>
      <DialogContent dividers>
        <Box>
          <InputLabel>Field name</InputLabel>
          <Input
            value={fieldName}
            fullWidth
            onChange={(e) => setFieldName(e.target.value)}
          />
          <InputLabel sx={{mt: 1}}>Min width</InputLabel>
          <Input
            value={minWidth}
            fullWidth
            type="number"
            onChange={(e) => setMinWidth(e.target.value)}
          />
        </Box>
        {(type === TYPE_TEXT || type === TYPE_AREA) && (
          <>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isHide}
                    onChange={(e) => setIsHide(e.target.checked)}
                  />
                }
                label="Hide field name"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRequired}
                    onChange={(e) => setIsRequired(e.target.checked)}
                  />
                }
                label="Required field"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isEmail}
                    onChange={(e) => setisEmail(e.target.checked)}
                  />
                }
                label="Is Email"
              />
            </FormGroup>
            <Box mt={2}>
              <InputLabel htmlFor="default-value">Default value</InputLabel>
              <Input
                id="default-value"
                fullWidth
                {...textFieldProps}
                value={defaultValue}
                onChange={(e) => setDefaultValue(e.target.value)}
              />
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function TextInputComponent(props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { windows } = useContext(dataContext);
  const {
    componentIndex,
    type,
    cantEdit,
    changeRecordValue,
    initialValue,
    register,
    errors,
  } = props;
  const [value, setValue] = useState(
    initialValue || windows[componentIndex]?.data.defaultValue
  );

  useEffect(() => {
    const defaultValue = windows[componentIndex]?.data.defaultValue;
    if (changeRecordValue && defaultValue !== "")
      changeRecordValue(defaultValue);
  }, [componentIndex, windows, changeRecordValue]);

  const handleChange = (e) => {
    setValue(e.target.value);
    changeRecordValue(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const textFieldProps = {};
  switch (type) {
    case TYPE_TEXT:
      textFieldProps.variant = "outlined";
      break;
    case TYPE_AREA:
      textFieldProps.variant = "filled";
      textFieldProps.multiline = true;
      textFieldProps.rows = 4;
      break;
    case TYPE_LABEL:
      textFieldProps.label = "Label";
      textFieldProps.variant = "standard";
      textFieldProps.disabled = true;
      break;
    default:
      break;
  }

  const componentLabel = windows[componentIndex]?.data.fieldName;
  textFieldProps.label = componentLabel;
  textFieldProps.onChange = handleChange;
  textFieldProps.value = !cantEdit
    ? value
    : windows[componentIndex]?.data.defaultValue;

  if (cantEdit)
    return (
      <div
        style={{ position: "relative" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <TextField
          InputProps={{
            readOnly: true,
          }}
          {...textFieldProps}
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
          type={type}
          textFieldProps={textFieldProps}
        />
      </div>
    );
  else
    return (
      <TextField
        {...(windows[componentIndex].data.isRequired && {
          ...register(componentLabel, {
            required: `${componentLabel} is required`,
          }),
          error: !!errors[componentLabel],
          helperText: errors[componentLabel]?.message,
        })}
        {...(windows[componentIndex].data.isEmail && {
          ...register(componentLabel, {
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Invalid email format",
            },
          }),
          error: !!errors[componentLabel],
          helperText: errors[componentLabel]?.message,
        })}
        {...textFieldProps}
      />
    );
}
