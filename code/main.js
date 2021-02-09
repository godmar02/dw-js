// App version: v0.12.11
// Author: Godmar02
// App source code: https://github.com/godmar02/godmar02.github.io
var answersExpanded = 0;
var abilityErrors = false;
var loadErrors = false;

function setModifier(ability) {
  var abilityScore = parseInt($("#" + ability).val(), 10);
  var abilityAffliction = $("#" + ability + "Affliction").val();
  var afflicted = 0;

  if (abilityScore) {
    var baseModifier = 0;
    if ([1, 2, 3].indexOf(abilityScore) > -1) {
      baseModifier = -3;
    } else if ([4, 5].indexOf(abilityScore) > -1) {
      baseModifier = -2;
    } else if ([6, 7, 8].indexOf(abilityScore) > -1) {
      baseModifier = -1;
    } else if ([9, 10, 11, 12].indexOf(abilityScore) > -1) {
      baseModifier = 0;
    } else if ([13, 14, 15].indexOf(abilityScore) > -1) {
      baseModifier = 1;
    } else if ([16, 17].indexOf(abilityScore) > -1) {
      baseModifier = 2;
    } else if (abilityScore == 18) {
      baseModifier = 3;
    }

    /*-1 if afflicted*/
    if (abilityAffliction == "Unafflicted") {
      afflicted = 0;
    } else {
      afflicted = 1;
    }

    var modifier = baseModifier - afflicted;
    var stringModifier = "";

    if (modifier > 0) {
      stringModifier = "+" + modifier;
    } else {
      stringModifier = modifier;
    }

    if (debug == true) {
      console.info(
        "setModifier() - ability: " + ability + "\n" +
        "setModifier() - abilityScore: " + abilityScore + "\n" +
        "setModifier() - abilityAffliction: " + abilityAffliction + "\n" +
        "setModifier() - afflicted: " + afflicted + "\n" +
        "setModifier() - modifier: " + modifier + "\n" +
        "setModifier() - stringModifier: " + stringModifier
      );
    }

    $("#" + ability + "Modifier").val("[ " + stringModifier + " ]");
  } else {
    $("#" + ability + "Modifier").val("");
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
  var questionCount = 3;
  var expand = true;

  if ($("#expandAll0").text() == "+ Expand all") {
    expand = true;
  } else {
    expand = false;
  }

  if (expand == true) {
    //Expand Everything
    // change Expand All indicators
    $(".expandIndicator").text("-");
    $(".answerContainer").attr("style", "display: block;");
    $(".expandAll").text("- Collapse all");
    answersExpanded = questionCount;
  } else {
    //Collapse Everything
    $(".expandIndicator").text("+");
    $(".answerContainer").attr("style", "display: none;");
    $(".expandAll").text("+ Expand all");
    answersExpanded = 0;
  }
}

function expandcontainer(identifier) {
  var expandIndicator = "expandIndicator" + identifier;
  var answerContainer = "answerContainer" + identifier;
  var answerCount = 3;

  if ($("#" + expandIndicator).text() == "+") {
    //Expand Answer Container
    $("#" + expandIndicator).text("-");
    $("#" + answerContainer).attr("style", "display: block;");
    answersExpanded++;
    if (answersExpanded == answerCount) {
      //All answers expanded
      $(".expandAll").text("- Collapse all");
    }
  } else {
    //Collapse Answer Container
    $("#" + expandIndicator).text("+");
    $("#" + answerContainer).attr("style", "display: none;");
    answersExpanded--;
    if (answersExpanded != answerCount) {
      $(".expandAll").text("+ Expand all");
    }
  }
}

function reindexBodyRows(tableID) {

  if (debug == true) {
    console.info("reindexBodyRows() - Reindexing table body: " + tableID);
  }

  var tableBody = $("#" + tableID + " tbody");
  var bodyRows = tableBody.children("tr");
  var bodyRowsCount = bodyRows.length;
  var templateRow = bodyRows.get(0);
  var bodyColCount = templateRow.cells.length;

  if (debug == true) {
    console.info("reindexBodyRows() - bodyRowsCount: " + bodyRowsCount);
  }
  if (debug == true) {
    console.info("reindexBodyRows() - bodyColCount: " + bodyColCount);
  }

  for (var i = 0; i < bodyRowsCount; i++) {
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
      var cell = tableBody.get(0).rows[i].cells[j];
      var newCellID = templateCellIDPrefix + i;
      if (debug == true) {
        console.info("reindexBodyRows() - newCellID: " + newCellID);
      }
      cell.children[0].id = newCellID;

      // set new onclick value for any buttons of format function(...N)
      if (cell.children[0].type == "button") {
        var currentOnClick = $("#" + newCellID).attr("onclick");
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
        $("#" + newCellID).attr("onclick", newOnClick);
      }
    }
  }
}

function addRow(tableID) {

  // This works for any generic row but also assumes that any table row cells
  // you are copying has an id of format id="tableid0" etc so that it
  // can be incremented by 1 each time
  // Note table items are zero indexed
  var tableBody = $("#" + tableID + " tbody");
  var bodyRows = tableBody.children("tr");
  var bodyRowsCount = bodyRows.length;
  var templateRow = bodyRows.get(0);
  var newRowColCount = templateRow.cells.length;
  var newRowID = bodyRowsCount;

  if (debug == true) {
    console.info(
      "addRow() - tableID: " + tableID + "\n" +
      "addRow() - bodyRowsCount: " + bodyRowsCount + "\n" +
      "addRow() - newRowColCount: " + newRowColCount + "\n" +
      "addRow() - newRowID: " + newRowID
    );
  }

  // to insert single row at end of tbody
  var newRow = tableBody.get(0).insertRow(-1);

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
  var tableBody = $("#" + tableID + " tbody");
  var bodyRows = tableBody.children("tr");
  var bodyRowsCount = bodyRows.length;
  if (debug == true) {
    console.info("deleteRow() - bodyRowsCount: " + bodyRowsCount);
  }
  if (bodyRowsCount != 1) {
    if (debug == true) {
      console.info("deleteRow() - Deleting Row: " + rowID);
    }
    tableBody.get(0).deleteRow(rowID);
    reindexBodyRows(tableID);
  } else {
    console.warn("deleteRow() - Cannot delete last row: " + tableID);
  }
}

$(document).ready(function() {

  $("#dwClass, #race, #alignment").change(function() {
    var race = $("#race").val();
    var dwClass = $("#dwClass").val();
    var alignment = $("#alignment").val();
    var str = parseInt($("#str").val(), 10);
    var con = parseInt($("#con").val(), 10);
    var change = $(this).attr("id");
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

    $.getJSON("data/classes.json", function(data) {

      // Set race attribute
      if (dwClass && race) {
        raceAttribute = data[dwClass].raceAttributes[race];
        $("#raceAttribute").val(raceAttribute);
      } else {
        $("#raceAttribute").val("");
      }

      // Set MaxLoad
      if (dwClass && str) {
        baseLoad = parseInt(data[dwClass].baseLoad, 10);
        if (debug == true) {
          console.info("$(#dwClass).change() - baseLoad: " + baseLoad);
        }
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
        baseHP = parseInt(data[dwClass].baseHP, 10);
        if (debug == true) {
          console.info("$(#dwClass).change() - baseHP: " + baseHP);
        }
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
        $("#alignment").empty();
        if (dwClass) {
          alignments = data[dwClass].alignments.split(",");
          if (debug == true) {
            console.info(
              "$(#dwClass).change() - alignments: " + alignments);
          }
          $.each(alignments, function(index, value) {
            $("#alignment").append("<option>" + value + "</option>");
          });
        }
      }

      // Set alignment attribute
      alignment = $("#alignment").val();
      if (dwClass && alignment) {
        alignmentAttribute = data[dwClass].alignmentAttributes[alignment];
        $("#alignmentAttribute").val(alignmentAttribute);
      } else {
        $("#alignmentAttribute").val("");
      }

    });
  });

  $("#str").change(function() {
    var str = parseInt($(this).val(), 10);
    var dwClass = $("#dwClass").val();
    var baseLoad = 0;
    var maxLoad = 0;

    $.getJSON("data/classes.json", function(data) {
      //Set maxLoad
      if (str && dwClass) {
        baseLoad = parseInt(data[dwClass].baseLoad, 10);
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
    var con = parseInt($(this).val(), 10);
    var dwClass = $("#dwClass").val();
    var baseHP = 0;
    var maxHP = 0;

    $.getJSON("data/classes.json", function(data) {

      if (con && dwClass) {
        baseHP = parseInt(data[dwClass].baseHP, 10);
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
    var tableBody = $("#gearTable tbody");
    var bodyRows = tableBody.children("tr");
    var bodyRowsCount = bodyRows.length;
    if (debug == true) {
      console.info("itemWeight.change() - gearTable bodyRowsCount:" + bodyRowsCount);
    }
    var totalload = 0;
    var itemload = 0;
    for (var i = 0; i < bodyRowsCount; i++) {
      if (debug == true) {
        console.info("itemID: itemWeight" + i);
      }
      itemload = parseInt($("#itemWeight" + i).val(), 10);
      if (itemload) {
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
    var lvl = $("#level").val();
    if (lvl) {
      var maxXP = parseInt(lvl, 10) + 7;
      $("#maxXP").val("/ " + maxXP);
    } else {
      $("#maxXP").val("");
    }
  });

  $("#XP, #maxXP").change(function() {
    var XP = $(this).val();
    var maxXP = parseInt($("#maxXP").val().replace("/ ", ""), 10);
    if (XP && maxXP && XP > maxXP) {
      alert(XP + "XP exceeds maximum permitted value of " + maxXP);
      $(this).val(maxXP);
    }
  });

  $("#HP, #maxHP").change(function() {
    var HP = $(this).val();
    var maxHP = parseInt($("#maxHP").val().replace("/ ", ""), 10);
    if (HP && maxHP && HP > maxHP) {
      alert(HP + "HP exceeds maximum permitted value of " + maxHP);
      $(this).val(maxHP);
    }
  });

  $("#load, #maxLoad").change(function() {
    var load = $(this).val();
    var maxLoad = parseInt($("#maxLoad").val().replace("/ ", ""), 10);
    if (load && maxLoad && load > maxLoad) {
      alert(load + " weight exceeds maximum permitted value of " + maxLoad);
      loadErrors = true;
    } else {
      loadErrors = false;
    }
  });

  $("#str, #dex, #con, #int, #wis, #cha").change(function() {
    var str = parseInt($("#str").val(), 10);
    var dex = parseInt($("#dex").val(), 10);
    var con = parseInt($("#con").val(), 10);
    var int = parseInt($("#int").val(), 10);
    var wis = parseInt($("#wis").val(), 10);
    var cha = parseInt($("#cha").val(), 10);
    var maxAbility = 73; //16, 15, 13, 12, 9, 8
    var totalAbility = str + dex + con + int + wis + cha;

    if (debug == true) {
      console.info(
        "$(#str, #dex, #con, #int, #wis, #cha).change() - str: " + str + "\n" +
        "$(#str, #dex, #con, #int, #wis, #cha).change() - dex: " + dex + "\n" +
        "$(#str, #dex, #con, #int, #wis, #cha).change() - con: " + con + "\n" +
        "$(#str, #dex, #con, #int, #wis, #cha).change() - int: " + int + "\n" +
        "$(#str, #dex, #con, #int, #wis, #cha).change() - wis: " + wis + "\n" +
        "$(#str, #dex, #con, #int, #wis, #cha).change() - cha: " + cha + "\n" +
        "$(#str, #dex, #con, #int, #wis, #cha).change() - maxAbility: " + maxAbility + "\n" +
        "$(#str, #dex, #con, #int, #wis, #cha).change() - totalAbility: " + totalAbility
      );
    }

    if (str && dex && con && int && wis && cha && totalAbility != maxAbility) {
      alert(totalAbility + " Ability Score does not match total permitted value of " + maxAbility);
      abilityErrors = true;
    } else {
      abilityErrors = false;
    }

  });

  $(".ability, .abilityAffliction").change(function() {
    // Set Ability modifiers
    var ability = $(this).attr("id").replace("Affliction", "");
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
