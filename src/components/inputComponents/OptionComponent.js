import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  InputLabel,
  Input,
  DialogActions,
  Button,
  Stack,
  TextField,
  Checkbox,
  Select,
  MenuItem,
  RadioGroup,
  FormHelperText,
} from "@mui/material";
import { dataContext } from "../../pages/SettingPage";
import { AnimatedSettingIcon } from "./styled";
import { useState, useContext, useEffect } from "react";
import { AddCircleOutline, RemoveCircle } from "@mui/icons-material";
import { TYPE_RADIO, TYPE_DROP, TYPE_CHECK } from "../../utils/constants";

function SimpleDialog(props) {
  const { onClose, open, componentIndex, type } = props;
  const { windows, setWindows } = useContext(dataContext);
  const [fieldName, setFieldName] = useState("");
  const [options, setOptions] = useState([]);
  const [isRequired, setIsRequired] = useState(false);
  const [isHide, setIsHide] = useState(false);
  const [minWidth, setMinWidth] = useState(0);

  useEffect(() => {
    setFieldName(windows[componentIndex].data.fieldName);
    setMinWidth(windows[componentIndex].data.minWidth);
    setOptions(windows[componentIndex].data.options);
    setIsRequired(windows[componentIndex].data.isRequired);
    setIsHide(windows[componentIndex].data.isHide);
  }, [windows, componentIndex]);

  const handleSave = () => {
    const cloneData = [...windows];
    cloneData[componentIndex].data = {
      fieldName,
      minWidth,
      options,
      isHide,
      isRequired,
    };
    setWindows(cloneData);
    onClose();
  };

  const changeOptionValue = (e, index) => {
    const updateArr = [...options];
    updateArr[index] = e.target.value;
    setOptions(updateArr);
  };

  const deleteOption = (index) => {
    const deleteArr = [...options];
    deleteArr.splice(index, 1);
    setOptions(deleteArr);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>{type} Settings</DialogTitle>
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
        </Box>
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
        </FormGroup>
        <Box mt={2} height={400}>
          <InputLabel>Options</InputLabel>
          {options.map((option, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              spacing={2}
              marginY={2}
            >
              <RemoveCircle
                sx={{ cursor: "pointer" }}
                onClick={() => deleteOption(index)}
                fontSize="small"
                color="action"
              />
              <TextField
                fullWidth
                value={option}
                placeholder="New option"
                onChange={(e) => changeOptionValue(e, index)}
              />
            </Stack>
          ))}
          <Button variant="contained" size="large" onClick={addOption}>
            <AddCircleOutline />
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function OptionComponent(props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { windows } = useContext(dataContext);
  const {
    componentIndex,
    type,
    cantEdit,
    changeRecordValue,
    initialValue,
    errors,
    register,
  } = props;
  const [value, setValue] = useState(
    initialValue || (type === TYPE_CHECK ? [] : "")
  );

  const handleChange = (e) => {
    setValue(e.target.value);
    changeRecordValue(e.target.value);
  };

  const handleCheckBoxChange = (event, index) => {
    const { checked } = event.target;
    const newArr = [...value];
    newArr[index] = checked ? event.target.value : null;
    setValue(newArr);
    changeRecordValue(newArr);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const componentLabel = windows[componentIndex]?.data.fieldName;

  return (
    <>
      <FormControl
        error={!cantEdit && !!errors[componentLabel]?.message}
        style={{ position: "relative" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <FormLabel id="demo-row-radio-buttons-group-label">
          {windows[componentIndex]?.data.fieldName}
        </FormLabel>
        {cantEdit ? (
          <>
            {type === TYPE_DROP && (
              <Select
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ marginTop: "9px", minWidth: "204px" }}
                value={value}
                onChange={handleChange}
              >
                {windows[componentIndex]?.data.options.map((option, index) => (
                  <MenuItem key={index} value={option} disabled>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            )}
            {type === TYPE_CHECK && (
              <FormGroup value={value} row>
                {windows[componentIndex]?.data.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={value.includes(option)}
                        onChange={(event) => handleCheckBoxChange(event, index)}
                        value={option}
                        disabled={cantEdit}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
            )}
            {type === TYPE_RADIO && (
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                row
                value={value}
                onChange={handleChange}
              >
                {windows[componentIndex]?.data.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={
                      <Radio checked={option === value} disabled={cantEdit} />
                    }
                    label={option}
                  />
                ))}
              </RadioGroup>
            )}
            <AnimatedSettingIcon
              color="action"
              sx={{ opacity: hovered ? 1 : 0 }}
              onClick={handleClickOpen}
            />
          </>
        ) : (
          <>
            {windows[componentIndex].data.isRequired ? (
              <>
                {type === TYPE_DROP && (
                  <Select
                    {...register(componentLabel, {
                      required: value === "" ? 'Please select at least one option' : undefined
                    })}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{ marginTop: "9px", minWidth: "204px" }}
                    value={value}
                    onChange={handleChange}
                  
                  >
                    {windows[componentIndex]?.data.options.map(
                      (option, index) => (
                        <MenuItem
                          key={index}
                          value={option}
                          disabled={cantEdit}
                        >
                          {option}
                        </MenuItem>
                      )
                    )}
                  </Select>
                )}
                {type === TYPE_CHECK && (
                  <FormGroup
                    value={value}
                    row
                    {...register(componentLabel, {
                      required: value.length === 0 || value.every((item) => item === null || item === undefined) ? 'Please select at least one option' : undefined
                    })}
                  >
                    {windows[componentIndex]?.data.options.map(
                      (option, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              checked={value.includes(option)}
                              onChange={(event) =>
                                handleCheckBoxChange(event, index)
                              }
                              value={option}
                              disabled={cantEdit}
                            />
                          }
                          label={option}
                        />
                      )
                    )}
                  </FormGroup>
                )}
                {type === TYPE_RADIO && (
                  <RadioGroup
                    {...register(componentLabel, {
                      required: value === "" ? 'Please select at least one option' : undefined
                    })}
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    row
                    value={value}
                    onChange={handleChange}
                  >
                    {windows[componentIndex]?.data.options.map(
                      (option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={
                            <Radio
                              checked={option === value}
                              disabled={cantEdit}
                            />
                          }
                          label={option}
                        />
                      )
                    )}
                  </RadioGroup>
                )}
                <FormHelperText>{errors[componentLabel]?.message}</FormHelperText>
              </>
            ) : (
              <>
                {type === TYPE_DROP && (
                  <Select
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{ marginTop: "9px", minWidth: "204px" }}
                    value={value}
                    onChange={handleChange}
                  >
                    {windows[componentIndex]?.data.options.map(
                      (option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      )
                    )}
                  </Select>
                )}
                {type === TYPE_CHECK && (
                  <FormGroup value={value} row>
                    {windows[componentIndex]?.data.options.map(
                      (option, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              checked={value.includes(option)}
                              onChange={(event) =>
                                handleCheckBoxChange(event, index)
                              }
                              value={option}
                            />
                          }
                          label={option}
                        />
                      )
                    )}
                  </FormGroup>
                )}
                {type === TYPE_RADIO && (
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    row
                    value={value}
                    onChange={handleChange}
                  >
                    {windows[componentIndex]?.data.options.map(
                      (option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio checked={option === value} />}
                          label={option}
                        />
                      )
                    )}
                  </RadioGroup>
                )}
              </>
            )}
          </>
        )}
      </FormControl>
      {cantEdit && (
        <SimpleDialog
          open={open}
          onClose={handleClose}
          componentIndex={componentIndex}
          type={type}
        />
      )}
    </>
  );
}
