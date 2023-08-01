import { useState, useContext, cloneElement, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  LinearProgress,
} from "@mui/material";
import { AddCircleOutline, RemoveCircle, Edit } from "@mui/icons-material";
import { dataContext } from "../pages/SettingPage";
import { useForm } from "react-hook-form";
import { axios } from "../utils/httpHelper";
import { useParams } from "react-router-dom";
import { generateColumnsFromRows } from "../utils/generateColumns";
import { StyledDataGrid } from "./inputComponents/styled";
import { TYPE_TABLE } from "../utils/constants";

function SimpleDialog(props) {
  const { onClose, open, handleSave, editId, localRecord, changeRecordValue } =
    props;
  const { windows } = useContext(dataContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const inputComponetRef = useRef(null);
  const [isUpdated, setisUpdated] = useState(false);

  const addNewRecord = () => {
    try {
      inputComponetRef.current.updateValue();
    }
    catch {}
    reset();
    onClose();
    setisUpdated(true);
  };

  useEffect(() => {
    if (isUpdated) {
      handleSave(localRecord);
      setisUpdated(false);
    }
  }, [isUpdated]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>{editId ? "Sửa bản ghi" : "Thêm bản ghi"}</DialogTitle>
      <form onSubmit={handleSubmit(addNewRecord)}>
        <DialogContent dividers>
          {windows.map((window, index) => {
            const commonProps = {
              componentIndex: index,
              changeRecordValue: (value) =>
                changeRecordValue(window.id, value),
              initialValue: localRecord[window.id],
              editId: editId,
              register,
              errors,
            };

            const tableProps =
              window.idComponent === TYPE_TABLE
                ? { ref: window.idComponent === TYPE_TABLE && inputComponetRef }
                : {};

            return (
              <Box key={index} mt={index !== 0 ? 2 : 0}>
                {cloneElement(window.component, {
                  ...commonProps,
                  ...tableProps,
                })}
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function TableRecorder() {
  const [records, setRecords] = useState([]);
  const { windows } = useContext(dataContext);
  const columns = windows.map((window) => window.id);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [localRecord, setLocalRecord] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/recorder/getRecorder/${id}`)
      .then((res) => {
        setRecords(res.data);
      })
      .catch(() => {
        alert("Lỗi khi tải dữ liệu");
      });
  }, [id]);

  const handleClickOpen = (recordID = null, local = {}) => {
    setOpen(true);
    setEditId(recordID);
    setLocalRecord(local);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemove = () => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/recorder/deleteRecorder/${deleteId}`
      )
      .then(() => {
        const newArr = records.filter((record) => record._id !== deleteId);
        setRecords(newArr);
        setOpen2(false);
      })
      .catch(() => {
        alert("Lỗi khi xóa dữ liệu");
      });
  };

  const changeRecordValue = (key, value) => {
    setLocalRecord((prevRecordValue) => ({
      ...prevRecordValue,
      [key]: value,
    }));
  };

  const handleSave = (newRecord) => {
    if (editId) {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/recorder/editRecorder/${editId}`,
          newRecord
        )
        .then(() => {
          const updatedRecords = records.map((record) =>
            record._id === editId ? { ...record, data: newRecord } : record
          );
          setRecords(updatedRecords);
        })
        .catch(() => {
          alert("Lỗi khi sửa dữ liệu");
        });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/recorder/addRecorder/${id}`,
          newRecord
        )
        .then((res) => {
          setRecords([...records, res.data]);
        })
        .catch(() => {
          alert("Lỗi khi thêm dữ liệu");
        });
    }
  };

  return (
    <>
      {!records ? (
        <LinearProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} >
              <TableHead>
                <TableRow>
                  <TableCell sx={{minWidth: 80}}></TableCell>
                  {windows.map((window, i) => (
                      <TableCell align="center" sx={{minWidth: `${window.data.minWidth}px`}} key={i}>
                        {!window.data.isHide && window.data.fieldName}
                      </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => {
                  const columnDatas = record.data || {};
                  return (
                    <TableRow
                      key={record._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Edit
                          color="action"
                          cursor="pointer"
                          onClick={() => {
                            handleClickOpen(record._id, columnDatas);
                          }}
                        />
                        <RemoveCircle
                          color="action"
                          cursor="pointer"
                          onClick={() => {
                            setDeleteId(record._id);
                            setOpen2(true);
                          }}
                        />
                      </TableCell>
                      {columns.map((column, index) => {
                        const columnData = columnDatas[column];
                        if (Array.isArray(columnData)) {
                          if (
                            typeof columnData[0] === "object" &&
                            columnData[0] !== null
                          ) {
                            return (
                              <TableCell align="center" key={index}>
                                <div
                                  style={{
                                    width: "100%",
                                  }}
                                >
                                  <StyledDataGrid
                                    rows={columnData}
                                    autoHeight
                                    hideFooter
                                    columns={generateColumnsFromRows(
                                      columnData,
                                      false
                                    )}
                                  />
                                </div>
                              </TableCell>
                            );
                          }
                          const validColumns = columnData.filter(
                            (column) => column !== null && column !== undefined
                          );
                          return (
                            <TableCell align="center" key={index}>
                              {validColumns.join(", ")}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell align="center" key={index}>
                            {columnData || ""}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => handleClickOpen()}
          >
            <AddCircleOutline />
          </Button>
        </>
      )}
      <Dialog open={open2} onClose={() => setOpen2(false)}>
        <DialogTitle>Are you sure you want to delete?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen2(false)}>Disagree</Button>
          <Button onClick={handleRemove}>Agree</Button>
        </DialogActions>
      </Dialog>
      <SimpleDialog
        open={open}
        onClose={handleClose}
        handleSave={handleSave}
        editId={editId}
        localRecord={localRecord}
        changeRecordValue={changeRecordValue}
      />
    </>
  );
}
