var answersExpanded = 0;
var abilityErrors = false;
var loadErrors = false;

function calcModifier(value) {

  var input = parseInt(value, 10);
  if ([1, 2, 3].indexOf(input) > -1) {
    return -3;
  } else if ([4, 5].indexOf(input) > -1) {
    return -2;
  } else if ([6, 7, 8].indexOf(input) > -1) {
    return -1;
  } else if ([9, 10, 11, 12].indexOf(input) > -1) {
    return 0;
  } else if ([13, 14, 15].indexOf(input) > -1) {
    return 1;
  } else if ([16, 17].indexOf(input) > -1) {
    return 2;
  } else if (input == 18) {
    return 3;
  } else {
    return "ERROR";
  }
}

function setModifier(ability) {
  var ab = document.getElementById(ability).value;
  var abAffliction = document.getElementById(ability + "Affliction").value;
  var afflicted = "";
  if (ab) {
    /*-1 if afflicted*/
    if (abAffliction == "Unafflicted") {
      afflicted = 0;
    } else {
      afflicted = 1;
    }

    var modifier = calcModifier(ab) - afflicted;
    var stringModifier = "";

    if (modifier > 0) {
      stringModifier = "+" + modifier;
    } else {
      stringModifier = modifier;
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

function expandAll() {
  var expandIndicator = "";
  var answerContainer = "";
  var expanAllIndicator = "";
  var questionCount = 3;
  var expandAllCount = 2;
  var expand = true;

  if (document.getElementById("expandAll0").innerHTML == "+ Expand all") {
    expand = true;
  } else {
    expand = false;
  }

  if (expand == true) {
    //Expand Everything
    for (i = 0; i < questionCount; i++) {
      expandIndicator = "expandIndicator" + i;
      answerContainer = "answerContainer" + i;

      document.getElementById(expandIndicator).innerHTML = "-";
      document.getElementById(answerContainer).style.display = "block";
    }
    // change Expand All indicators
    for (i = 0; i < expandAllCount; i++) {
      expanAllIndicator = "expandAll" + i;
      document.getElementById(expanAllIndicator).innerHTML = "- Collapse all";
    }
    answersExpanded = questionCount;
    //expandAllindicator2.scrollIntoView(false);
  } else {
    //Collapse Everything
    for (i = 0; i < questionCount; i++) {
      expandIndicator = "expandIndicator" + i;
      answerContainer = "answerContainer" + i;

      document.getElementById(expandIndicator).innerHTML = "+";
      document.getElementById(answerContainer).style.display = "none";
    }

    for (i = 0; i < expandAllCount; i++) {
      expanAllIndicator = "expandAll" + i;
      document.getElementById(expanAllIndicator).innerHTML = "+ Expand all";
    }
    answersExpanded = 0;
    //expandAllindicator2.scrollIntoView(false);
  }
}

function expandcontainer(identifier) {
  var expandIndicator = "expandIndicator" + identifier;
  var answerContainer = "answerContainer" + identifier;

  if (document.getElementById(expandIndicator).innerHTML == "+") {
    //Expand Answer Container
    document.getElementById(expandIndicator).innerHTML = "-";
    document.getElementById(answerContainer).style.display = "block";
    answersExpanded++;
    if (answersExpanded == 3) {
      for (i = 0; i < 1; i++) {
        expandAllIndicator = "expandAll" + i;
        document.getElementById(expandAllIndicator).innerHTML = "- Collapse all";
      }
    }
  } else {
    //Collapse Answer Container
    document.getElementById(expandIndicator).innerHTML = "+";
    document.getElementById(answerContainer).style.display = "none";
    answersExpanded--;
    if (answersExpanded > 0) {
      for (i = 0; i < 1; i++) {
        expandAllIndicator = "expandAll" + i;
        document.getElementById(expandAllIndicator).innerHTML = "- Collapse all";
      }
    }
  }
}

function reindexBodyRows(tableID) {

  if (debug == true) {
    console.info("reindexBodyRows() - Reindexing table body: " + tableID);
  }
  var tbl = document.getElementById(tableID);
  var tableBody = tbl.getElementsByTagName("tbody")[0];
  var bodyRowCount = tableBody.getElementsByTagName("tr").length;
  if (debug == true) {
    console.info("reindexBodyRows() - bodyRowCount: " + bodyRowCount);
  }
  var templateRow = tableBody.rows[0];
  var bodyColCount = templateRow.cells.length;
  if (debug == true) {
    console.info("reindexBodyRows() - bodyColCount: " + bodyColCount);
  }

  for (var i = 0; i < bodyRowCount; i++) {
    for (var j = 0; j < bodyColCount; j++) {

      if (debug == true) {
        console.info("reindexBodyRows() - Row / Column: " + i + " / " + j);
      }
      // set new ID based upon triming existing cellid of format itemN
      var templateCell = templateRow.cells[j];
      var templateCellID = templateCell.children[0].id;
      if (debug == true) {
        console.info("reindexBodyRows() - templateCellID: " + templateCellID);
      }
      var templateCellIDPrefix = templateCellID.slice(0, -1);
      if (debug == true) {
        console.info("reindexBodyRows() - templateCellIDPrefix: " + templateCellIDPrefix);
      }
      var cell = tableBody.rows[i].cells[j];
      var newCellID = templateCellIDPrefix + i;
      if (debug == true) {
        console.info("reindexBodyRows() - newCellID: " + newCellID);
      }
      cell.children[0].id = newCellID;

      // set new onclick value for any buttons of format function(...N)
      if (cell.children[0].type == "button") {
        var currentOnClick = document.getElementById(newCellID).getAttribute("onclick");
        if (debug == true) {
          console.info("reindexBodyRows() - currentOnClick: " + currentOnClick);
        }
        var currentOnClickkPrefix = currentOnClick.slice(0, -2);
        if (debug == true) {
          console.info("reindexBodyRows() - currentOnClickkPrefix: " + currentOnClickkPrefix);
        }
        var newOnClick = currentOnClickkPrefix + i + ")";
        if (debug == true) {
          console.info("reindexBodyRows() - newOnClick: " + newOnClick);
        }
        document.getElementById(newCellID).setAttribute("onclick", newOnClick);
      }
    }
  }
}

function addRow(tableID) {

  // This works for any generic row but also assumes that any table row cells
  // you are copying has an id of format id="tableid0" etc so that it
  // can be incremented by 1 each time
  // Note table items are zero indexed
  var tbl = document.getElementById(tableID);
  var tableBody = tbl.getElementsByTagName("tbody")[0];
  var bodyRowCount = tableBody.getElementsByTagName("tr").length;
  var templateRow = tableBody.rows[0];
  var newRowColCount = templateRow.cells.length;
  var newRowID = bodyRowCount;

  if (debug == true) {
    console.info(
      "addRow() - tableID: " + tableID + "\n" +
      "addRow() - bodyRowCount: " + bodyRowCount + "\n" +
      "addRow() - newRowColCount: " + newRowColCount + "\n" +
      "addRow() - newRowID: " + newRowID
    );
  }

  // to insert single row at end of tbody
  var newRow = tableBody.insertRow(-1);

  // to create columns in new row
  for (var i = 0; i < newRowColCount; i++) {

    if (debug == true) {
      console.info("addRow() - column: " + i);
    }

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
      console.info("addRow() - templateCellID: " + templateCellID);
    }
    if (debug == true) {
      console.info("addRow() - templateCellIDPrefix: " + templateCellIDPrefix);
    }
    if (debug == true) {
      console.info("addRow() - newCellID: " + newCellID);
    }
    newCell.children[0].id = newCellID;

    // set colspan
    var templateCellColSpan = templateCell.getAttribute("colspan");
    if (debug == true) {
      console.info("addRow() - templateCellColSpan: " + templateCellColSpan);
    }
    newCell.setAttribute("colspan", templateCellColSpan);

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
  var tableBody = tbl.getElementsByTagName("tbody")[0];
  var bodyRowCount = tableBody.getElementsByTagName("tr").length;
  if (debug == true) {
    console.info("deleteRow() - bodyRowCount: " + bodyRowCount);
  }
  if (bodyRowCount != 1) {
    if (debug == true) {
      console.info("deleteRow() - Deleting Row: " + rowID);
    }
    tableBody.deleteRow(rowID);
    reindexBodyRows(tableID);
  } else {
    console.warn("deleteRow() - Cannot delete last row: " + tableID);
  }
}

$(document).ready(function() {

  $("#dwClass, #race, #alignment").change(function() {
    var $race = $("#race");
    var $dwClass = $("#dwClass");
    var $alignment = $("#alignment");
    var $str = $("#str");
    var $con = $("#con");
    var $change = $(this);

    $.getJSON("data/classes.json", function(data) {
      var change = $change.attr("id");
      var race = $race.val();
      var dwClass = $dwClass.val();
      var alignment = $alignment.val();
      var str = $str.val();
      var con = $con.val();
      var raceAttribute = "";
      var alignmentAttribute = "";
      var alignments = [];
      var damage = "";
      var baseLoad = 0;
      var baseHP = 0;
      var maxLoad = 0;
      var maxHP = 0;

      if (debug == true) {
        console.info(
          "$(#dwClass, #race, #alignment).change() - change: " + change + "\n" +
          "$(#dwClass, #race, #alignment).change() - race: " + race + "\n" +
          "$(#dwClass, #race, #alignment).change() - dwClass: " + dwClass + "\n" +
          "$(#dwClass, #race, #alignment).change() - alignment: " + alignment + "\n" +
          "$(#dwClass, #race, #alignment).change() - str: " + str + "\n" +
          "$(#dwClass, #race, #alignment).change() - con: " + con
        );
      }

      // Set race attribute
      if (dwClass && race) {
        raceAttribute = data[dwClass].raceAttributes[race];
        $("#raceAttribute").val(raceAttribute);
      } else {
        $("#raceAttribute").val("");
      }

      // Set alignment attribute
      if (dwClass && alignment) {
        alignmentAttribute = data[dwClass].alignmentAttributes[alignment];
        $("#alignmentAttribute").val(alignmentAttribute);
      } else {
        $("#alignmentAttribute").val("");
      }

      // Set MaxLoad
      if (dwClass && str) {
        str = parseInt(str, 10);
        baseLoad = data[dwClass].baseLoad;
        if (debug == true) {
          console.info("$(#dwClass).change() - baseLoad: " + baseLoad);
        }
        baseLoad = parseInt(baseLoad, 10);
        maxLoad = baseLoad + str;
        if (debug == true) {
          console.info("$(#dwClass).change() - maxLoad: " + maxLoad);
        }
        $("#maxLoad").val("/ " + maxLoad);
      } else {
        $("#maxLoad").val("");
      }

      // Set MaxHP
      if (dwClass && con) {
        con = parseInt(con, 10);
        baseHP = data[dwClass].baseHP;
        if (debug == true) {
          console.info("$(#dwClass).change() - baseHP: " + baseHP);
        }
        baseHP = parseInt(baseHP, 10);
        maxHP = baseHP + con;
        if (debug == true) {
          console.info("$(#dwClass).change() - maxHP: " + maxHP);
        }
        $("#maxHP").val("/ " + maxHP);
      } else {
        $("#maxHP").val("");
      }

      // Set damage
      if (dwClass) {
        damage = data[dwClass].damage;
        if (debug == true) {
          console.info("$(#dwClass).change() - damage: " + damage);
        }
        $("#damage").val(damage);
      } else {
        $("#damage").val("");
      }

      // Set alignment options
      if (change != "alignment") {
        var $alignments = $("#alignment");
        $alignments.empty();
        if (dwClass) {
          alignments = data[dwClass].alignments.split(",");
          if (debug == true) {
            console.info(
              "$(#dwClass).change() - alignments: " + alignments);
          }
          $.each(alignments, function(index, value) {
            $alignments.append("<option>" + value + "</option>");
          });
        }
      }
    });
  });

  $("#str").change(function() {
    var $str = $(this);
    var $dwClass = $("#dwClass");

    $.getJSON("data/classes.json", function(data) {

      var dwClass = $dwClass.val();
      var str = $str.val();
      var baseLoad = 0;
      var maxLoad = 0;
      if (str) {
        str = parseInt(str, 10);
        baseLoad = data[dwClass].baseLoad;
        baseLoad = parseInt(baseLoad, 10);
        maxLoad = baseLoad + str;

        if (debug == true) {
          console.info(
            "$(#str).change() - dwClass: " + dwClass + "\n" +
            "$(#str).change() - str: " + str + "\n" +
            "$(#str).change() - baseLoad: " + baseLoad + "\n" +
            "$(#str).change() - maxLoad: " + maxLoad);
        }

        $("#maxLoad").val("/ " + maxLoad);
      } else {
        $("#maxLoad").val("");
      }
    });
  });

  $("#con").change(function() {
    var $con = $(this);
    var $dwClass = $("#dwClass");

    $.getJSON("data/classes.json", function(data) {

      var dwClass = $dwClass.val();
      var con = $con.val();
      var baseHP = 0;
      var maxHP = 0;
      if (con) {
        con = parseInt(con, 10);
        baseHP = data[dwClass].baseHP;
        baseHP = parseInt(baseHP, 10);
        maxHP = baseHP + con;

        if (debug == true) {
          console.info(
            "$(#con).change() - dwClass: " + dwClass + "\n" +
            "$(#con).change() - con: " + con + "\n" +
            "$(#con).change() - baseHP: " + baseHP + "\n" +
            "$(#con).change() - maxHP: " + maxHP);
        }

        $("#maxHP").val("/ " + maxHP);
      } else {
        $("#maxHP").val("");
      }
    });
  });

  $(document).on("change", "[id^=itemWeight]", function() {
    //on change of any itemWeight elements add weight together and display in load
    var tbl = document.getElementById("gearTable");
    var tableBody = tbl.getElementsByTagName("tbody")[0];
    var bodyRowCount = tableBody.getElementsByTagName("tr").length;
    if (debug == true) {
      console.info("itemWeight.change() - gearTable bodyRowCount:" + bodyRowCount);
    }
    var totalload = 0;
    var itemload = 0;
    for (var i = 0; i < bodyRowCount; i++) {
      if (debug == true) {
        console.info("itemID: itemWeight" + i);
      }
      itemload = $("#itemWeight" + i).val();
      if (itemload) {
        itemload = parseInt(itemload, 10);
        totalload = totalload + itemload;
        if (debug == true) {
          console.info(
            "itemWeight.change() - itemload:" + itemload + "\n" +
            "itemWeight.change() - totalload:" + totalload
          );
        }
      }
    }

    $("#load").val(totalload);

  });

  $("#level").change(function() {
    setMaxXP();
  });

  $("#XP, #maxXP").change(function() {
    var XP = $(this).val();
    var maxXP = $("#maxXP").val();
    maxXP = parseInt(maxXP.replace("/ ", ""), 10);
    if (XP && maxXP && XP > maxXP) {
      alert(XP + "XP exceeds maximum permitted value of " + maxXP);
      $(this).val(maxXP);
    }
  });

  $("#HP, #maxHP").change(function() {
    var HP = $(this).val();
    var maxHP = $("#maxHP").val();
    maxHP = parseInt(maxHP.replace("/ ", ""), 10);
    if (HP && maxHP && HP > maxHP) {
      alert(HP + "HP exceeds maximum permitted value of " + maxHP);
      $(this).val(maxHP);
    }
  });

  $("#load, #maxLoad").change(function() {
    var load = $(this).val();
    var maxLoad = $("#maxLoad").val();
    maxLoad = parseInt(maxLoad.replace("/ ", ""), 10);
    if (load && maxLoad && load > maxLoad) {
      alert(load + " weight exceeds maximum permitted value of " + maxLoad);
      loadErrors = true;
    } else {
      loadErrors = false;
    }
  });

  $("#str, #dex, #con, #int, #wis, #cha").change(function() {
    var str = $("#str").val();
    var dex = $("#dex").val();
    var con = $("#con").val();
    var int = $("#int").val();
    var wis = $("#wis").val();
    var cha = $("#cha").val();
    var maxAbility = 73; //16, 15, 13, 12, 9, 8
    var totalAbility = str + dex + con + int + wis + cha;

    if (str && dex && con && int && wis && cha && totalAbility != totalAbility) {
      alert(totalAbility + " Ability Score does not match total permitted value of " + maxAbility);
      abilityErrors = true;
    } else {
      abilityErrors = false;
    }

  });

  $(".ability, .abilityAffliction").change(function() {
    // Set Ability modifiers
    var ability = $(this).attr("id");
    ability = ability.replace("Affliction", "");
    setModifier(ability);
  });

  $(".expandAll").click(function() {
    expandAll();
  });

  $(".question").click(function() {
    var question = $(this).attr("id");
    var identifier = question.slice(-1);
    if (debug == true) {
      console.info("$(.question).click() - question: " + question + "\n" +
        "$(.question).click() - identifier: " + identifier
      );
    }

    expandcontainer(identifier);
  });

  $(".sheetLink").click(function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    $("#main").show();
    $("#faq").hide();
  });

  $(".faqLink").click(function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    $("#main").hide();
    $("#faq").show();
  });

  $(".addRow").click(function() {
    var tableID = $(this).closest("table").attr("id");
    if (debug == true) {
      console.info("$(.addRow).click() - tableID: " + tableID);
    }
    addRow(tableID);
  });

  $(".deleteRow").click(function() {
    var tableID = $(this).closest("table").attr("id");
    var rowID = $(this).attr("id");
    var row = rowID.slice(-1);
    if (debug == true) {
      console.info("$(.deleteRow).click() - tableID: " + tableID + "\n" +
        "$(.deleteRow).click() - rowID: " + rowID + "\n" +
        "$(.deleteRow).click() - row: " + row
      );
    }
    deleteRow(tableID, row);
  });

  $("#saveCharacter").click(function() {
    db.collection("users").add({
        first: "Ada",
        last: "Lovelace",
        born: 1815
      })
      .then(function(docRef) {
        if (debug == true) {
          console.info("saveCharacter() - Document written with ID: ", docRef.id);
        }
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  });

  $("#loadCharacter").click(function() {
    db.collection("users").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (debug == true) {
          console.info(`${doc.id} => ${doc.data()}`);
        }
      });
    });
  });

  $("#clearCharacter").click(function() {
    location.reload();
  });

});
