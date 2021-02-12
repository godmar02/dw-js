$(document).ready(function() {

  // variables
  var debug = true;
  var answersExpanded = 0;
  var abilityErrors = false;
  var loadErrors = false;

  // generic functions
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
        console.info("setModifier() - ability:", ability);
        console.info("setModifier() - abilityScore:", abilityScore);
        console.info("setModifier() - abilityAffliction:", abilityAffliction);
        console.info("setModifier() - afflicted:", afflicted);
        console.info("setModifier() - modifier:", modifier);
        console.info("setModifier() - stringModifier:", stringModifier);
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

  function setHeight(textAreaID) {
    var textArea = $("#" + textAreaID);
    if (debug == true) {
      console.info("textarea.on() - textAreaID:", textAreaID);
    }
    textArea.outerHeight(40);
    var newHeight = textArea.prop("scrollHeight") + 2;
    if (debug == true) {
      console.info("textarea.on() - textArea.prop(scrollHeight):", textArea.prop("scrollHeight"));
      console.info("textarea.on() - newHeight:", newHeight);
    }
    textArea.outerHeight(newHeight);
  }

  function reindexBodyRows(tableID) {

    if (debug == true) {
      console.info("reindexBodyRows() - Reindexing table body:", tableID);
    }

    var tableBody = $("#" + tableID + " tbody");
    var bodyRows = tableBody.children("tr");
    var bodyRowsCount = bodyRows.length;
    var templateRow = bodyRows.get(0);
    var bodyColCount = templateRow.cells.length;

    if (debug == true) {
      console.info("reindexBodyRows() - bodyRowsCount:", bodyRowsCount);
    }
    if (debug == true) {
      console.info("reindexBodyRows() - bodyColCount:", bodyColCount);
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
          console.info("reindexBodyRows() - templateCellID:", templateCellID);
        }
        var templateCellIDPrefix = templateCellID.slice(0, -1);
        if (debug == true) {
          console.info("reindexBodyRows() - templateCellIDPrefix: " + templateCellIDPrefix);
        }
        var cell = tableBody.get(0).rows[i].cells[j];
        var newCellID = templateCellIDPrefix + i;
        if (debug == true) {
          console.info("reindexBodyRows() - newCellID:", newCellID);
        }
        cell.children[0].id = newCellID;

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
      console.info("addRow() - tableID:", tableID);
      console.info("addRow() - bodyRowsCount:", bodyRowsCount);
      console.info("addRow() - newRowColCount:", newRowColCount);
      console.info("addRow() - newRowID:", newRowID);
    }

    // to insert single row at end of tbody
    var newRow = tableBody.get(0).insertRow(-1);

    // to create columns in new row
    for (var i = 0; i < newRowColCount; i++) {

      if (debug == true) {
        console.info("addRow() - column:", i);
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
        console.info("addRow() - templateCellID:", templateCellID);
      }
      if (debug == true) {
        console.info("addRow() - templateCellIDPrefix:", templateCellIDPrefix);
      }
      if (debug == true) {
        console.info("addRow() - newCellID:", newCellID);
      }
      newCell.children[0].id = newCellID;

      // set colspan
      var templateCellColSpan = templateCell.getAttribute("colspan");
      if (debug == true) {
        console.info("addRow() - templateCellColSpan:", templateCellColSpan);
      }
      newCell.setAttribute("colspan", templateCellColSpan);

      // Blank or uncheck content
      newCell.children[0].value = "";

      // Ensure textarea heights are reset
      if (newCell.type == "textarea") {
        setHeight(newCellID);
      }
    }
  }

  function totalLoad() {
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
          console.info("itemWeight.change() - itemload:", itemload);
          console.info("itemWeight.change() - totalload:", totalload);
        }
      }
    }

    $("#load").val(totalload);
  }

  function deleteRow(tableID, rowID) {
    var tableBody = $("#" + tableID + " tbody");
    var bodyRows = tableBody.children("tr");
    var bodyRowsCount = bodyRows.length;
    if (debug == true) {
      console.info("deleteRow() - bodyRowsCount:", bodyRowsCount);
    }
    if (bodyRowsCount != 1) {
      if (debug == true) {
        console.info("deleteRow() - Deleting Row:", rowID);
      }
      tableBody.get(0).deleteRow(rowID);
      reindexBodyRows(tableID);
    } else {
      console.warn("deleteRow() - Cannot delete last row:", tableID);
    }
  }

  function setPlayerOptions() {
    $.getJSON("data/playerList.json", function(data) {
      $("#player").empty();
      $("#player").append("<option hidden disabled selected></option>");
      players = data.players;
      if (debug == true) {
        console.info("setPlayerOptions() - players:", players);
      }
      $.each(players, function(index, value) {
        $("#player").append(new Option(value));
      });
    });
  }

  function setAdventureOptions() {
    $.getJSON("data/adventureList.json", function(data) {
      $("#adventure").empty();
      $("#adventure").append("<option hidden disabled selected></option>");
      adventures = data.adventures;
      if (debug == true) {
        console.info("setAdventureOptions() - adventures:", adventures);
      }
      $.each(adventures, function(index, value) {
        $("#adventure").append(new Option(value));
      });
    });
  }

  function setDwClassOptions() {
    $.getJSON("data/classList.json", function(data) {
      $("#dwClass").empty();
      $("#dwClass").append("<option hidden disabled selected></option>");
      classes = data.classes;
      if (debug == true) {
        console.info("setDwClassOptions() - classes:", classes);
      }
      $.each(classes, function(index, value) {
        $("#dwClass").append(new Option(value));
      });
    });
  }

  function setRaceOptions() {
    $.getJSON("data/raceList.json", function(data) {
      $("#race").empty();
      $("#race").append("<option hidden disabled selected></option>");
      races = data.races;
      if (debug == true) {
        console.info("setRaceOptions() - races:", races);
      }
      $.each(races, function(index, value) {
        $("#race").append(new Option(value));
      });
    });
  }

  // Set various drop down options
  setPlayerOptions();
  setAdventureOptions();
  setDwClassOptions();
  setRaceOptions();

  //listener functions
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
      console.info("$(#dwClass, #race, #alignment).change() - change:", change);
      console.info("$(#dwClass, #race, #alignment).change() - race:", race);
      console.info("$(#dwClass, #race, #alignment).change() - dwClass:", dwClass);
      console.info("$(#dwClass, #race, #alignment).change() - alignment:", alignment);
      console.info("$(#dwClass, #race, #alignment).change() - str:", str);
      console.info("$(#dwClass, #race, #alignment).change() - con:", con);
    }

    $.getJSON("data/classDetails.json", function(data) {

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
          console.info("$(#dwClass).change() - baseLoad:", baseLoad);
        }
        maxLoad = baseLoad + str;
        if (debug == true) {
          console.info("$(#dwClass).change() - maxLoad:", maxLoad);
        }
        $("#maxLoad").val("/ " + maxLoad);
      } else {
        $("#maxLoad").val("");
      }

      // Set MaxHP
      if (dwClass && con) {
        baseHP = parseInt(data[dwClass].baseHP, 10);
        if (debug == true) {
          console.info("$(#dwClass).change() - baseHP:", baseHP);
        }
        maxHP = baseHP + con;
        if (debug == true) {
          console.info("$(#dwClass).change() - maxHP:", maxHP);
        }
        $("#maxHP").val("/ " + maxHP);
      } else {
        $("#maxHP").val("");
      }

      // Set damage
      if (dwClass) {
        damage = data[dwClass].damage;
        if (debug == true) {
          console.info("$(#dwClass).change() - damage:", damage);
        }
        $("#damage").val(damage);
      } else {
        $("#damage").val("");
      }

      // Set alignment options if class is changing
      if (change == "dwClass") {
        $("#alignment").empty();
        $("#alignment").append("<option hidden disabled selected></option>");
        if (dwClass) {
          alignments = data[dwClass].alignments;
          if (debug == true) {
            console.info("$(#dwClass).change() - alignments:", alignments);
          }
          $.each(alignments, function(index, value) {
            $("#alignment").append(new Option(value));
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

    $.getJSON("data/classDetails.json", function(data) {
      //Set maxLoad
      if (str && dwClass) {
        baseLoad = parseInt(data[dwClass].baseLoad, 10);
        maxLoad = baseLoad + str;

        if (debug == true) {
          console.info("$(#str).change() - dwClass:", dwClass);
          console.info("$(#str).change() - str:", str);
          console.info("$(#str).change() - baseLoad:", baseLoad);
          console.info("$(#str).change() - maxLoad:", maxLoad);
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

    $.getJSON("data/classDetails.json", function(data) {

      if (con && dwClass) {
        baseHP = parseInt(data[dwClass].baseHP, 10);
        maxHP = baseHP + con;

        if (debug == true) {
          console.info("$(#con).change() - dwClass:", dwClass);
          console.info("$(#con).change() - con:", con);
          console.info("$(#con).change() - baseHP:", baseHP);
          console.info("$(#con).change() - maxHP:", maxHP);
        }

        $("#maxHP").val("/ " + maxHP);
      } else {
        $("#maxHP").val("");
      }
    });
  });

  $(document).on("change", "[id^=itemWeight]", function() {
    totalLoad();
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
      console.info("$(#str, #dex, #con, #int, #wis, #cha).change() - str:", str);
      console.info("$(#str, #dex, #con, #int, #wis, #cha).change() - dex:", dex);
      console.info("$(#str, #dex, #con, #int, #wis, #cha).change() - con:", con);
      console.info("$(#str, #dex, #con, #int, #wis, #cha).change() - int:", int);
      console.info("$(#str, #dex, #con, #int, #wis, #cha).change() - wis:", wis);
      console.info("$(#str, #dex, #con, #int, #wis, #cha).change() - cha:", cha);
      console.info("$(#str, #dex, #con, #int, #wis, #cha).change() - maxAbility:", maxAbility);
      console.info("$(#str, #dex, #con, #int, #wis, #cha).change() - totalAbility:", totalAbility);
    }

    if (str && dex && con && int && wis && cha && totalAbility != maxAbility) {
      alert(totalAbility + " Ability Score does not match total permitted value of " + maxAbility + "\n" + "Suggested values are 16, 15, 13, 12, 9, 8");
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
      console.info("$(.question).click() - question:", question);
      console.info("$(.question).click() - identifier:", identifier);
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
      console.info("$(.addRow).click() - tableID:", tableID);
    }
    addRow(tableID);
  });

  $(document).on("click", ".deleteRow", function() {
    var tableID = $(this).closest("table").attr("id");
    var rowID = $(this).attr("id");
    var row = rowID.slice(-1);
    if (debug == true) {
      console.info("$(.deleteRow).click() - tableID:", tableID);
      console.info("$(.deleteRow).click() - rowID:", rowID);
      console.info("$(.deleteRow).click() - row:", row);
    }
    deleteRow(tableID, row);
    if (tableID == "gearTable") {
      totalLoad();
    }
  });

  $("#clearCharacter").click(function() {
    location.reload(true);
  });

  $(document).on("change", "textarea", function() {
    setHeight(this.id);
  });

  $("#saveCharacter").click(function() {

    var player = $("#player").val();
    var adventure = $("#adventure").val();
    var charaName = $("#charaName").val();

    if (player && adventure && charaName) {
      var backstory = $("#backstory").val();
      if (!backstory) {
        backstory = null;
      }
      var look = $("#look").val();
      if (!look) {
        look = null;
      }
      var dwClass = $("#dwClass").val();
      if (!dwClass) {
        dwClass = null;
      }
      var race = $("#race").val();
      if (!race) {
        race = null;
      }
      var alignment = $("#alignment").val();
      if (!alignment) {
        alignment = null;
      }
      var level = parseInt($("#level").val(), 10);
      if (!level) {
        level = null;
      }
      var XP = parseInt($("#XP").val(), 10);
      if (!XP) {
        XP = null;
      }
      var str = parseInt($("#str").val(), 10);
      if (!str) {
        str = null;
      }
      var dex = parseInt($("#dex").val(), 10);
      if (!dex) {
        dex = null;
      }
      var con = parseInt($("#con").val(), 10);
      if (!con) {
        con = null;
      }
      var int = parseInt($("#int").val(), 10);
      if (!int) {
        int = null;
      }
      var wis = parseInt($("#wis").val(), 10);
      if (!wis) {
        wis = null;
      }
      var cha = parseInt($("#cha").val(), 10);
      if (!cha) {
        cha = null;
      }
      var strAffliction = $("#strAffliction").val();
      if (!strAffliction) {
        strAffliction = null;
      }
      var dexAffliction = $("#dexAffliction").val();
      if (!dexAffliction) {
        dexAffliction = null;
      }
      var conAffliction = $("#conAffliction").val();
      if (!conAffliction) {
        conAffliction = null;
      }
      var intAffliction = $("#intAffliction").val();
      if (!intAffliction) {
        intAffliction = null;
      }
      var wisAffliction = $("#wisAffliction").val();
      if (!wisAffliction) {
        wisAffliction = null;
      }
      var chaAffliction = $("#chaAffliction").val();
      if (!chaAffliction) {
        chaAffliction = null;
      }
      var armour = parseInt($("#armour").val(), 10);
      if (!armour) {
        armour = null;
      }
      var HP = parseInt($("#HP").val(), 10);
      if (!HP) {
        HP = null;
      }
      var funds = parseInt($("#funds").val(), 10);
      if (!funds) {
        funds = null;
      }

      var tableBody;
      var bodyRows = 0;
      var bodyRowsCount = 0;

      //bondsTable
      tableBody = $("#bondsTable tbody");
      bodyRows = tableBody.children("tr");
      bodyRowsCount = bodyRows.length;
      var bonds = [];
      for (var i = 0; i < bodyRowsCount; i++) {
        bonds[i] = $("#bond" + i).val();
        if (!bonds[i]) {bonds[i] = null; }
      }

      //gearTable
      tableBody = $("#gearTable tbody");
      bodyRows = tableBody.children("tr");
      bodyRowsCount = bodyRows.length;
      var items = [];
      var itemsWeights = [];
      for (var j = 0; j < bodyRowsCount; j++) {
        items[i] = $("#item" + i).val();
        if (!items[i]) {items[i] = null; }
        itemsWeights[i] = parseInt($("#itemWeight" + i).val(), 10);
        if (!itemsWeights[i]) {itemsWeights[i] = null; }
      }

      //classFeaturesTable
      tableBody = $("#classFeaturesTable tbody");
      bodyRows = tableBody.children("tr");
      bodyRowsCount = bodyRows.length;
      var classFeatures = [];
      var classFeaturesCheckboxes = [];
      for (var k = 0; k < bodyRowsCount; k++) {
        classFeatures[i] = parseInt($("#classFeature" + i).val(), 10);
        if (!classFeatures[i]) {classFeatures[i] = null; }
        classFeaturesCheckboxes[i] = $("#classFeatureCheckbox" + i).val();
        if (!classFeaturesCheckboxes[i]) {classFeaturesCheckboxes[i] = null; }
      }

      //array debug
      if (debug == true) {
        console.info("bonds",bonds);
        console.info("items",items);
        console.info("itemsWeights",itemsWeights);
        console.info("classFeatures",classFeatures);
        console.info("classFeaturesCheckboxes",classFeaturesCheckboxes);
      }

      // SAVE FUNCTION
      db.collection("characters").add({
          "characterSheet": {
            "sheetHeaderTable": {
              "player": player,
              "adventure": adventure
            },
            "basicInfoTable": {
              "charaName": charaName,
              "look": look,
              "backstory": backstory
            },
            "additionalInfoTable": {
              "dwClass": dwClass,
              "race": race,
              "alignment": alignment
            },
            "basicAttributesTable": {
              "level": level,
              "XP": XP
            },
            "abilitiesTable": {
              "str": str,
              "strAffliction": strAffliction,
              "dex": dex,
              "dexAffliction": dexAffliction,
              "con": con,
              "conAffliction": conAffliction,
              "int": int,
              "intAffliction": intAffliction,
              "wis": wis,
              "wisAffliction": wisAffliction,
              "cha": cha,
              "chaAffliction": chaAffliction
            },
            "damageArmourFundsTable": {
              "armour": armour,
              "HP": HP,
              "funds": funds
            },
            "bondsTable": {
              "bonds": null
            },
            "gearTable": {
              "items": null,
              "itemsWeights": null
            },
            "classFeaturesTable": {
              "classFeatures": null,
              "classFeaturesCheckboxes": null
            }
          }
        })
        .then(function(docRef) {
          if (debug == true) {
            console.info("saveCharacter() - Document written with ID: ", docRef.id);
          }
          alert("Character Sheet succesfully saved!");
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
          alert("Failed to save Character Sheet, see console error");
        });
    } else {
      alert("Cannot save unless Player, Adventure and Character are completed");
    }
  });

  $("#loadCharacter").click(function() {
    db.collection("characters").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (debug == true) {
          console.info(`${doc.id} => ${doc.data()}`);
        }
      });
    });
  });

});
