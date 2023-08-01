import { useState, cloneElement, useContext} from "react";
import { Delete, ContentCopy } from "@mui/icons-material";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
  APP_FUNCTIONS,
  DRAWER_WIDTH,
  DROPABLE_1,
  DROPABLE_2,
} from "../utils/constants";
import {
  Paper,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Divider,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { dataContext } from "../pages/SettingPage";

export default function ResponsiveDrawer() {
  const {windows, setWindows} = useContext(dataContext);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [funcs, setFuncs] = useState(APP_FUNCTIONS);
  const [open, setOpen] = useState(false);

  const handleClickOpen = (index) => {
    setOpen(true);
    setDeleteIndex(index);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDragEnd = (result) => {
    setFuncs(funcs.filter((appFunction) => !appFunction.clone));
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === DROPABLE_1) return;
    const newWindows = [...windows];
    const destinationIndex = destination.index;
    const srcIndex = source.index;
    let dropComponent;
    if (
      destination.droppableId === DROPABLE_2 &&
      source.droppableId === DROPABLE_2
    ) {
      [dropComponent] = newWindows.splice(srcIndex, 1);
    } else {
      const timestamp = new Date().getTime();
      dropComponent = {
        id: `${result.draggableId}${timestamp}`,
        idComponent: result.draggableId,
        component: APP_FUNCTIONS[srcIndex].component,
        data: APP_FUNCTIONS[srcIndex].data
      };
    }
    newWindows.splice(destinationIndex, 0, dropComponent);
    setWindows(newWindows);
  };

  const onDragStart = (result) => {
    const draggedItem = funcs.find((func) => func.id === result.draggableId);
    if (draggedItem) {
      const clonedItem = {
        ...draggedItem,
        id: `${draggedItem.id}-clone`,
        clone: true,
      };
      const cloneArr = [...funcs];
      const i = result.source.index;
      const newArr = [
        ...cloneArr.slice(0, i),
        clonedItem,
        ...cloneArr.slice(i, cloneArr.length),
      ];
      setFuncs(newArr);
    }
  };

  const deleteWindow = () => {
    const cloneArray = [...windows];
    cloneArray.splice(deleteIndex, 1);
    setWindows(cloneArray);
    handleClose();
  };

  const duplicateWindow = (window, index) => {
    const newWindow = { ...window };
    const cloneArray = [...windows];
    cloneArray.splice(index, 0, newWindow);
    setWindows(cloneArray);
  };

  return (
    <>
      <Box sx={{ display: "flex", marginBottom: "20px" }}>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable isDropDisabled droppableId={DROPABLE_1}>
            {(provided) => (
              <Box
                component="nav"
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
              >
                <Drawer
                  variant="permanent"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    "& .MuiDrawer-paper": {
                      boxSizing: "border-box",
                      width: DRAWER_WIDTH,
                      position: "unset",
                    },
                  }}
                  open
                >
                  <List>
                    {funcs.map((func, index) => (
                      <Draggable
                        key={func.id}
                        draggableId={func.id}
                        index={index}
                      >
                        {(provided) => (
                          <ListItem
                            disablePadding
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ListItemButton disabled={func.clone}>
                              <ListItemIcon>{func.ic}</ListItemIcon>
                              <ListItemText primary={func.name} />
                            </ListItemButton>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                </Drawer>
              </Box>
            )}
          </Droppable>
          <Droppable droppableId={DROPABLE_2}>
            {(provided) => (
              <Paper
                variant="outlined"
                {...provided.droppableProps}
                ref={provided.innerRef}
                square
                sx={{ bgcolor: "#f7f7f7", minHeight: "80vh", width: "100%" }}
              >
                {windows.map((window, index) => {
                  const dragId = window.idComponent + index;
                  return (
                    <Draggable key={dragId} draggableId={dragId} index={index}>
                      {(provided) => (
                        <>
                          <ListItem
                            sx={{ ":hover": { backgroundColor: "#ffffff" } }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {cloneElement(window.component, {componentIndex: index, cantEdit: true})}
                            <Box sx={{ flexGrow: 1 }} />
                            <ContentCopy
                              sx={{ cursor: "pointer" }}
                              color="action"
                              onClick={() => duplicateWindow(window, index)}
                            />
                            <Delete
                              sx={{ cursor: "pointer" }}
                              color="action"
                              onClick={() => handleClickOpen(index)}
                            />
                          </ListItem>
                          <Divider/>
                        </>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={deleteWindow}>Agree</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
