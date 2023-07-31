export function generateColumnsFromRows(rows, isEdit, getterFunc = null) {
    if (!rows || rows.length === 0) {
      return [];
    }
    const columns = Object.keys(rows[0])
      .filter((key) => key !== "id")
      .map((key, index) => {
        if (index === 0) {
          return {
            field: key,
            width: 150,
            editable: isEdit,
            valueGetter: getterFunc,
          };
        } else {
          return {
            field: key,
            width: 150,
            editable: isEdit,
          };
        }
      });
  
    return columns;
  }