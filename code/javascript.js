var answersexpanded = 0;

function calcModifier(value) {

  var input = parseInt(value, 10);
  if ([1, 2, 3].indexOf(input) > -1) {
    return -3
  } else if ([4, 5].indexOf(input) > -1) {
    return -2
  } else if ([6, 7, 8].indexOf(input) > -1) {
    return -1
  } else if ([9, 10, 11, 12].indexOf(input) > -1) {
    return 0
  } else if ([13, 14, 15].indexOf(input) > -1) {
    return 1
  } else if ([16, 17].indexOf(input) > -1) {
    return 2
  } else if (input == 18) {
    return 3
  } else {
    return "ERROR"
  }
}

function setModifier(ability) {
  var ab = document.getElementById(ability).value;
  var abAffliction = document.getElementById(ability + "Affliction").value;
  if (ab) {
    /*-1 if afflicted*/
    if (abAffliction == "Unafflicted") {
      var afflicted = 0;
    } else {
      var afflicted = 1;
    }

    var modifier = calcModifier(ab) - afflicted;

    if (modifier > 0) {
      var stringModifier = "+" + modifier
    } else {
      var stringModifier = modifier
    }

    document.getElementById(ability + "Modifier").value = "[ " + stringModifier + " ]";
  } else {
    document.getElementById(ability + "Modifier").value = "";
  }
}

function setMaxXP() {
  var lvl = document.getElementById("level").value;
  if (lvl) {
    var maxXP = parseInt(lvl, 10) + 7;
    document.getElementById("maxXP").value = "/ " + maxXP;
  } else {
    document.getElementById("maxXP").value = "";
  }
}

function singleRoll(sides) {
  var roll = Math.floor(Math.random() * sides) + 1;
  return roll;
}

function rollDice(sides, number) {
  var i;
  var total = 0;
  for (i = 1; i == number; i++) {
    total = total + singleRoll(sides);
  }
  return total;
}

function expandall(indicator) {
  if (document.getElementById("expandallindicator1").innerHTML == "+ Expand all") {
    var expandindicator = "";
    var answercontainer = "";

    for (i = 0; i < 3; i++) {
      expandindicator = "expandindicator" + i;
      answercontainer = "answercontainer" + i;
      if (document.getElementById(expandindicator).innerHTML == "+") {
        document.getElementById(expandindicator).innerHTML = "-";
        document.getElementById(answercontainer).style.display = "block";
      }
    }
    answersexpanded = 3;
    document.getElementById("expandallindicator1").innerHTML = "- Collapse all";
    document.getElementById("expandallindicator2").innerHTML = "- Collapse all";
    if (indicator == 2) {
      expandallindicator2.scrollIntoView(false);
    }
  } else {
    var expandindicator = "";
    var answercontainer = "";

    for (i = 0; i < 3; i++) {
      expandindicator = "expandindicator" + i;
      answercontainer = "answercontainer" + i;
      if (document.getElementById(expandindicator).innerHTML == "-") {
        document.getElementById(expandindicator).innerHTML = "+";
        document.getElementById(answercontainer).style.display = "none";
      }
    }
    answersexpanded = 0;
    document.getElementById("expandallindicator1").innerHTML = "+ Expand all";
    document.getElementById("expandallindicator2").innerHTML = "+ Expand all";
    if (indicator == 2) {
      expandallindicator2.scrollIntoView(false);
    }
  }
}

function expandcontainer(identifier) {
  var expandindicator = "expandindicator" + identifier;
  var answercontainer = "answercontainer" + identifier;

  if (document.getElementById(expandindicator).innerHTML == "+") {
    document.getElementById(expandindicator).innerHTML = "-";
    document.getElementById(answercontainer).style.display = "block";
    answersexpanded++;
    if (answersexpanded == 3) {
      document.getElementById("expandallindicator1").innerHTML = "- Collapse all";
      document.getElementById("expandallindicator2").innerHTML = "- Collapse all";
    }
  } else {
    document.getElementById(expandindicator).innerHTML = "+";
    document.getElementById(answercontainer).style.display = "none";
    answersexpanded--;
    if (answersexpanded > 0) {
      document.getElementById("expandallindicator1").innerHTML = "+ Expand all";
      document.getElementById("expandallindicator2").innerHTML = "+ Expand all";
    }
  }
}

function messageclear() {
  document.getElementById("note").innerHTML = "";
}

function reindexBodyRows(tableID) {

  if (debug == true) {
    console.info("reindexBodyRows() - Reindexing table body: " + tableID)
  };
  var tbl = document.getElementById(tableID);
  var tableBody = tbl.getElementsByTagName('tbody')[0];
  var bodyRowCount = tableBody.getElementsByTagName('tr').length;
  if (debug == true) {
    console.info("reindexBodyRows() - bodyRowCount: " + bodyRowCount)
  };
  var templateRow = tableBody.rows[0];
  var bodyColCount = templateRow.cells.length;
  if (debug == true) {
    console.info("reindexBodyRows() - bodyColCount: " + bodyColCount)
  };

  for (var i = 0; i < bodyRowCount; i++) {
    for (var j = 0; j < bodyColCount; j++) {

      if (debug == true) {
        console.info("reindexBodyRows() - Row / Column: " + i + " / " + j)
      };
      // set new ID based upon triming existing cellid of format itemN
      var templateCell = templateRow.cells[j];
      var templateCellID = templateCell.children[0].id;
      if (debug == true) {
        console.info("reindexBodyRows() - templateCellID: " + templateCellID)
      };
      var templateCellIDPrefix = templateCellID.slice(0, -1);
      if (debug == true) {
        console.info("reindexBodyRows() - templateCellIDPrefix: " + templateCellIDPrefix)
      };
      var cell = tableBody.rows[i].cells[j];
      var newCellID = templateCellIDPrefix + i;
      if (debug == true) {
        console.info("reindexBodyRows() - newCellID: " + newCellID)
      };
      cell.children[0].id = newCellID

      // set new onclick value for any buttons of format function(...N)
      if (cell.children[0].type == "button") {
        var currentOnClick = document.getElementById(newCellID).getAttribute("onclick");
        if (debug == true) {
          console.info("reindexBodyRows() - currentOnClick: " + currentOnClick)
        };
        var currentOnClickkPrefix = currentOnClick.slice(0, -2);
        if (debug == true) {
          console.info("reindexBodyRows() - currentOnClickkPrefix: " + currentOnClickkPrefix)
        };
        var newOnClick = currentOnClickkPrefix + i + ")";
        if (debug == true) {
          console.info("reindexBodyRows() - newOnClick: " + newOnClick)
        };
        document.getElementById(newCellID).setAttribute("onclick", newOnClick);
      }
    }
  }
}

function addRow(tableID) {

  // This works for any generic row but also assumes that any table row cells
  // you are copying has an id of format id="tableid0" etc and any buttons
  // have an onclick format of onclick=function(stuff... , 0) so that both
  // these numbers can be incremented by 1 each time
  // Note table items are zero indexed
  var tbl = document.getElementById(tableID);
  var tableBody = tbl.getElementsByTagName('tbody')[0];
  var bodyRowCount = tableBody.getElementsByTagName('tr').length;
  var templateRow = tableBody.rows[0];
  var newRowColCount = templateRow.cells.length;
  var newRowID = bodyRowCount;

  if (debug == true) {
    console.info(
      "addRow() - tableID: " + tableID + '\n' +
      "addRow() - bodyRowCount: " + bodyRowCount + '\n' +
      "addRow() - newRowColCount: " + newRowColCount + '\n' +
      "addRow() - newRowID: " + newRowID
    )
  };

  // to insert single row at end of tbody
  var tableBody = tbl.getElementsByTagName('tbody')[0];
  var newRow = tableBody.insertRow(-1);

  // to create columns in new row
  for (var i = 0; i < newRowColCount; i++) {

    if (debug == true) {
      console.info("addRow() - column: " + i)
    };

    // to insert one column
    var newCell = newRow.insertCell(i);
    var templateCell = templateRow.cells[i];

    // set to same as first data row
    newCell.innerHTML = templateCell.innerHTML;

    // set new ID based upon triming existing cellid of format itemN
    var templateCellID = templateCell.children[0].id;
    var templateCellIDPrefix = templateCellID.slice(0, -1);
    var newCellID = templateCellIDPrefix + newRowID;
    if (debug == true) {
      console.info("addRow() - templateCellID: " + templateCellID)
    };
    if (debug == true) {
      console.info("addRow() - templateCellIDPrefix: " + templateCellIDPrefix)
    };
    if (debug == true) {
      console.info("addRow() - newCellID: " + newCellID)
    };
    newCell.children[0].id = newCellID;

    // set colspan
    var templateCellColSpan = templateCell.getAttribute("colspan");
    if (debug == true) {
      console.info("addRow() - templateCellColSpan: " + templateCellColSpan)
    };
    newCell.setAttribute("colspan", templateCellColSpan);

    // set new onclick value for any buttons of format function(...N)
    if (newCell.children[0].type == "button") {
      var currentOnClick = document.getElementById(newCellID).getAttribute("onclick");
      if (debug == true) {
        console.info("addRow() - newCell onclick: " + currentOnClick)
      };
      if (debug == true) {
        console.info("addRow() - currentOnClick: " + currentOnClick)
      };
      var currentOnClickkPrefix = currentOnClick.slice(0, -2);
      var newCellOnClick = currentOnClickkPrefix + newRowID + ")";
      if (debug == true) {
        console.info("addRow() - currentOnClickkPrefix: " + currentOnClickkPrefix)
      };
      if (debug == true) {
        console.info("addRow() - newCellOnClick: " + newCellOnClick)
      };
      document.getElementById(newCellID).setAttribute("onclick", newCellOnClick);
    }

    // Blank or uncheck content
    switch (newCell.children[0].type) {
      case "text":
        newCell.children[0].value = "";
        break;
      case "checkbox":
        newCell.children[0].checked = false;
        break;
      case "select-one":
        newCell.children[0].selectedIndex = 0;
        break;
    }
  }
}

function deleteRow(tableID, rowID) {
  var tbl = document.getElementById(tableID);
  var tableBody = tbl.getElementsByTagName('tbody')[0];
  var bodyRowCount = tableBody.getElementsByTagName('tr').length;
  if (debug == true) {
    console.info("deleteRow() - bodyRowCount: " + bodyRowCount)
  };
  if (bodyRowCount != 1) {
    if (debug == true) {
      console.info("deleteRow() - Deleting Row: " + rowID)
    };
    tableBody.deleteRow(rowID);
    reindexBodyRows(tableID);
  } else {
    console.warn("deleteRow() - Cannot delete last row: " + tableID);
  };
}
