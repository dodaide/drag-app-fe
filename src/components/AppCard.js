import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";

export default function AppCard(props) {
  const { title, id } = props;

  return (
    <Card>
      <CardActionArea>
        <Link
          style={{ textDecoration: "none", color: "unset" }}
          to={`work/${id}`}
        >
          <CardContent>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  );
}
