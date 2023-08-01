class Options {
  constructor(fieldName) {
    this.minWidth = 250;
    this.fieldName = fieldName;
    this.options = ["Option 1", "Option 2", "Option 3"];
    this.isRequired = false;
    this.isHide = false;
  }
}

class LabelCom {
  constructor(fieldName) {
    this.minWidth = 200;
    this.fieldName = fieldName;
    this.defaultValue = "";
  }
}

class TextField {
  constructor(fieldName) {
    this.minWidth = 250;
    this.fieldName = fieldName;
    this.defaultValue = "";
    this.isRequired = false;
    this.isHide = false;
    this.isEmail = false;
  }
}

class Participant {
  constructor(fieldName) {
    this.minWidth = 200;
    this.fieldName = fieldName;
  }
}

class Table {
  constructor(fieldName) {
    this.minWidth = 602;
    this.fieldName = fieldName;
    this.rows = [
      { id: 1, col1: "", col2: "", col3: "", col4: "" },
      { id: 2, col1: "", col2: "", col3: "", col4: "" },
      { id: 3, col1: "", col2: "", col3: "", col4: "" },
    ];
  }
}

class OtherApp {
  constructor(fieldName) {
    this.minWidth = 150;
    this.fieldName = fieldName;
  }
}

export { OtherApp, Table, Participant, Options, TextField, LabelCom };
