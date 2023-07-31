import { useEffect, useState } from "react";
import { Paper, Autocomplete, TextField } from "@mui/material";
import { axios } from "../utils/httpHelper";

export default function MultipleSelectChip({ windowId }) {
  const [people, setPeople] = useState([]);
  const [peoplePicked, setPeoplePicked] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/getAllUsers`)
      .then((response) => {
        setPeople(response.data);
      })
      .catch(() => {
        alert("Lỗi khi tải dữ liệu");
      });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/userwindow/getUserPicked/${windowId}`
      )
      .then((response) => {
        setPeoplePicked(response.data);
      })
      .catch(() => {
        alert("Lỗi khi tải dữ liệu");
      });
  }, []);

  const addPeople = (user) => {
    const newUser = { userId: user._id, windowId };
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/userwindow/addUserPicked/${windowId}`,
        newUser
      )
      .then(() => {
        setPeoplePicked([...peoplePicked, user]);
      })
      .catch(() => {
        alert("Lỗi khi cập nhật dữ liệu");
      });
  };

  const removePeople = (userwindow) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/userwindow/deleteUserPicked/${windowId}/${userwindow._id}`)
      .then(() => {
        const newArr = peoplePicked.filter((person) => person._id !== userwindow._id);
        setPeoplePicked(newArr);
      })
      .catch(() => {
        alert("Lỗi khi xóa dữ liệu");
      });
  };

  const handleChangePeople = (e, value) => {
    let diffUsers;
    if (value.length > peoplePicked.length) {
      diffUsers = value.filter((item) => !peoplePicked.includes(item));
      addPeople(diffUsers[0]);
    } else {
      diffUsers = peoplePicked.filter((item) => !value.includes(item));
      removePeople(diffUsers[0]);
    }
  };

  return (
    <Paper sx={{ padding: "20px", width: 500 }}>
      <Autocomplete
        value={peoplePicked}
        onChange={handleChangePeople}
        multiple
        clearIcon={false}
        id="checkboxes-tags-demo"
        options={people}
        disableCloseOnSelect
        isOptionEqualToValue={(option, value) => option._id === value._id}
        getOptionLabel={(option) => option.username}
        renderOption={(props, option) => {
          return (
            <li
              {...props}
            >
              {option.username}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder="Username" />
        )}
      />
    </Paper>
  );
}
