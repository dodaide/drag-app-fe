import { Avatar, AvatarGroup, Typography } from "@mui/material";
import { TYPE_ADMIN, TYPE_UPDATED_BY } from "../../utils/constants";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function ParticipantsComponent(props) {
  const { type, cantEdit, changeRecordValue, editId, initialValue } = props;
  const admin = useSelector((state) => state.admin);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!cantEdit) {
      if (type === TYPE_ADMIN) {
        changeRecordValue(admin);
      } else {
        if (!editId || (editId && type === TYPE_UPDATED_BY))
          changeRecordValue(user);
      }
    }
  }, [initialValue]);

  if (cantEdit) {
    return (
      <>
        {type === TYPE_ADMIN ? (
          <>
            <Avatar />
            <Typography sx={{ marginLeft: 1 }}>{admin}</Typography>
          </>
        ) : (
          <>
            <AvatarGroup>
              <Avatar />
              <Avatar />
              <Avatar />
            </AvatarGroup>
            <Typography sx={{ marginLeft: 1 }}>{type}</Typography>
          </>
        )}
      </>
    );
  }
}
