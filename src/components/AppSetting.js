import { useParams } from "react-router-dom";
import MultipleSelectChip from "./MultipleSelectChip";
import { Divider, Typography } from "@mui/material";

export default function AppSetting() {
    const { id } = useParams();
    return (
        <>
            <Typography variant="button" marginY={2}>
                Add people to your App
            </Typography>
            <MultipleSelectChip windowId={id} />
        </>
    );
}