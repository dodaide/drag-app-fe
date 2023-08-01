import {
  OptionComponent,
  TextInputComponent,
  ParticipantsComponent,
  TableComponent,
  OtherAppComponent,
} from "../components/inputComponents";
import {
  Label,
  TextFields,
  Assignment,
  RadioButtonChecked,
  CheckBox,
  TableView,
  Extension,
  ArrowDropDownCircle,
  Engineering,
  AdminPanelSettings,
  PeopleAlt,
} from "@mui/icons-material";
import { TextField, Options, OtherApp, Participant, Table, LabelCom } from "./class";

export const TYPE_TEXT = "Text";
export const TYPE_AREA = "Text Area";
export const TYPE_LABEL = "Label";
export const TYPE_RADIO = "Radio Button";
export const TYPE_CHECK = "Checkbox";
export const TYPE_DROP = "Dropdown";
export const TYPE_TABLE = "Table";
export const TYPE_OTHER_APP = "Other App";
export const TYPE_ADMIN = "Admin";
export const TYPE_CREATED_BY = "Created By";
export const TYPE_UPDATED_BY = "Updated By";

export const APP_FUNCTIONS = [
  {
    id: TYPE_LABEL,
    name: "Label",
    ic: <Label />,
    component: <TextInputComponent type={TYPE_LABEL} />,
    data: new LabelCom(TYPE_LABEL),
    clone: false,
  },
  {
    id: TYPE_TEXT,
    name: "Text",
    ic: <TextFields />,
    component: <TextInputComponent type={TYPE_TEXT} />,
    data: new TextField(TYPE_TEXT),
    clone: false,
  },
  {
    id: TYPE_AREA,
    name: "Text area",
    ic: <Assignment />,
    component: <TextInputComponent type={TYPE_AREA} />,
    data: new TextField(TYPE_AREA),
    clone: false,
  },
  {
    id: TYPE_RADIO,
    name: "Radio button",
    ic: <RadioButtonChecked />,
    component: <OptionComponent type={TYPE_RADIO} />,
    data: new Options(TYPE_RADIO),
    clone: false,
  },
  {
    id: TYPE_CHECK,
    name: "Check box",
    ic: <CheckBox />,
    component: <OptionComponent type={TYPE_CHECK} />,
    data: new Options(TYPE_CHECK),
    clone: false,
  },
  {
    id: TYPE_DROP,
    name: "Dropdown",
    ic: <ArrowDropDownCircle />,
    component: <OptionComponent type={TYPE_DROP} />,
    data: new Options(TYPE_DROP),
    clone: false,
  },
  {
    id: TYPE_TABLE,
    name: "Table",
    ic: <TableView />,
    component: <TableComponent />,
    data: new Table(TYPE_TABLE),
    clone: false,
  },
  // {
  //   id: TYPE_OTHER_APP,
  //   name: "Other App",
  //   ic: <Extension />,
  //   component: <OtherAppComponent />,
  //   data: new OtherApp(),
  //   clone: false,
  // },
  {
    id: TYPE_ADMIN,
    name: "Admin",
    ic: <AdminPanelSettings />,
    component: <ParticipantsComponent type={TYPE_ADMIN} />,
    data: new Participant(TYPE_ADMIN),
    clone: false,
  },
  {
    id: TYPE_CREATED_BY,
    name: "Created By",
    ic: <PeopleAlt />,
    component: <ParticipantsComponent type={TYPE_CREATED_BY} />,
    data: new Participant(TYPE_CREATED_BY),
    clone: false,
  },
  {
    id: TYPE_UPDATED_BY,
    name: "Updated By",
    ic: <Engineering />,
    component: <ParticipantsComponent type={TYPE_UPDATED_BY} />,
    data: new Participant(TYPE_UPDATED_BY),
    clone: false,
  },
];
export const DRAWER_WIDTH = 240;
export const DROPABLE_1 = "dropable1";
export const DROPABLE_2 = "dropable2";
export const LOCAL_STORAGE_NAME = "DragAppData";
export const TAB_INDEX = "tabindex";
export const MENU_ID = "menuid";
export const MENU_ID_2 = "menuid2";
export const ACCESS_TOKEN = "access_token";
export const ADMIN = "admin";
export const USER = "user";
export const GET_CURRENT_USER = "GET_CURRENT_USER";
export const GET_THIS_ADMIN = "GET_THIS_ADMIN";
