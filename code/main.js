/*jshint esversion: 6 */
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

    if (abilityScore && abilityAffliction) {
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
    var total = 0;
    for (var i = 1; i == number; i++) {
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

  function setHeight(textareaID) {
    var textarea = $("#" + textareaID);
    if (debug == true) {
      console.info("setHeight() - textareaID:", textareaID);
    }
    textarea.outerHeight(40);
    var newHeight = textarea.prop("scrollHeight") + 2;
    if (debug == true) {
      console.info("setHeight() - textarea.prop(scrollHeight):", textarea.prop("scrollHeight"));
      console.info("setHeight() - newHeight:", newHeight);
    }
    textarea.outerHeight(newHeight);
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
      if (debug == true) {
        console.info("addRow() - newCell.children[0].type:", newCell.children[0].type);
      }
      if (newCell.children[0].type == "textarea") {
        if (debug == true) {
          console.info("addRow() - resetting height:", true);
        }
        setHeight(newCellID);
      }
    }
  }

  function setTotalLoad() {
    //add weight together and display in load
    var tableBody = $("#gearTable tbody");
    var bodyRows = tableBody.children("tr");
    var bodyRowsCount = bodyRows.length;
    var totalload = 0;
    var itemload = 0;
    if (debug == true) {
      console.info("setTotalLoad() - gearTable bodyRowsCount:" + bodyRowsCount);
    }
    for (var i = 0; i < bodyRowsCount; i++) {
      if (debug == true) {
        console.info("setTotalLoad() - itemID: itemWeight" + i);
      }
      itemload = parseInt($("#itemWeight" + i).val(), 10);
      if (itemload) {
        totalload = totalload + itemload;
        if (debug == true) {
          console.info("setTotalLoad() - itemload:", itemload);
          console.info("setTotalLoad() - totalload:", totalload);
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
    $.ajax({
      url: "/data/playerList.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        $("#player").empty();
        $("#player").append("<option hidden disabled selected value='null'></option>");
        players = data.players;
        if (debug == true) {
          console.info("setPlayerOptions() - players:", players);
        }
        $.each(players, function(index, value) {
          $("#player").append(new Option(value, value));
        });
      }
    });
  }

  function setAdventureOptions() {
    $.ajax({
      url: "/data/adventureList.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        $("#adventure").empty();
        $("#adventure").append("<option hidden disabled selected value='null'></option>");
        adventures = data.adventures;
        if (debug == true) {
          console.info("setAdventureOptions() - adventures:", adventures);
        }
        $.each(adventures, function(index, value) {
          $("#adventure").append(new Option(value, value));
        });
      }
    });
  }

  function setDwClassOptions() {
    $.ajax({
      url: "/data/classList.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        $("#dwClass").empty();
        $("#dwClass").append("<option hidden disabled selected value='null'></option>");
        classes = data.classes;
        if (debug == true) {
          console.info("setDwClassOptions() - classes:", classes);
        }
        $.each(classes, function(index, value) {
          $("#dwClass").append(new Option(value, value));
        });
      }
    });
  }

  function setRaceOptions() {
    $.ajax({
      url: "/data/raceList.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        $("#race").empty();
        $("#race").append("<option hidden disabled selected value='null'></option>");
        races = data.races;
        if (debug == true) {
          console.info("setRaceOptions() - races:", races);
        }
        $.each(races, function(index, value) {
          $("#race").append(new Option(value, value));
        });
      }
    });
  }

  function validateLoad() {
    var load = parseInt($("#load").val(), 10);
    var maxLoad = parseInt($("#maxLoad").val().replace("/ ", ""), 10);
    if (load && maxLoad && load > maxLoad) {
      alert("validateLoad() - " + load + " weight exceeds maximum permitted value of " + maxLoad);
      loadErrors = true;
    } else {
      loadErrors = false;
    }
    if (debug == true) {
      console.info("validateLoad() - loadErrors:", loadErrors);
    }
  }

  function validateAbilityScore() {
    var str = parseInt($("#str").val(), 10);
    var dex = parseInt($("#dex").val(), 10);
    var con = parseInt($("#con").val(), 10);
    var int = parseInt($("#int").val(), 10);
    var wis = parseInt($("#wis").val(), 10);
    var cha = parseInt($("#cha").val(), 10);
    var maxAbility = 73; //16, 15, 13, 12, 9, 8
    var totalAbility = str + dex + con + int + wis + cha;

    if (debug == true) {
      console.info("validateAbilityScore() - str:", str);
      console.info("validateAbilityScore() - dex:", dex);
      console.info("validateAbilityScore() - con:", con);
      console.info("validateAbilityScore() - int:", int);
      console.info("validateAbilityScore() - wis:", wis);
      console.info("validateAbilityScore() - cha:", cha);
      console.info("validateAbilityScore() - maxAbility:", maxAbility);
      console.info("validateAbilityScore() - totalAbility:", totalAbility);
    }

    if (str && dex && con && int && wis && cha && totalAbility != maxAbility) {
      alert("validateAbilityScore() - " + totalAbility + " Ability Score does not match total permitted value of " + maxAbility + "\n" + "Suggested values are 16, 15, 13, 12, 9, 8");
      abilityErrors = true;
    } else {
      abilityErrors = false;
    }

    if (debug == true) {
      console.info("validateAbilityScore() - abilityErrors:", abilityErrors);
    }
  }

  function validateXp() {
    var xp = $("#xp").val();
    var maxXp = parseInt($("#maxXp").val().replace("/ ", ""), 10);
    if (xp && maxXp && xp > maxXp) {
      alert("validateXp() - " + xp + "xp exceeds maximum permitted value of " + maxXp);
      $("#xp").val(maxXp);
    }
  }

  function validateHp() {
    var hp = $("#hp").val();
    var maxHp = parseInt($("#maxHp").val().replace("/ ", ""), 10);
    if (hp && maxHp && hp > maxHp) {
      alert("validateHp() - " + hp + "hp exceeds maximum permitted value of " + maxHp);
      $("#hp").val(maxHp);
    }
  }

  function setMaxLoad() {
    var dwClass = $("#dwClass").val();
    var strModifier = parseInt($("#strModifier").val().replace(/\[|\]/g, ""), 10);
    var baseLoad = 0;
    var maxLoad = 0;

    $.ajax({
      url: "/data/classDetails.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        //Set maxLoad
        if (dwClass && strModifier) {
          baseLoad = parseInt(data[dwClass].baseLoad, 10);
          maxLoad = baseLoad + strModifier;

          if (debug == true) {
            console.info("setMaxLoad() - dwClass:", dwClass);
            console.info("setMaxLoad() - strModifier:", strModifier);
            console.info("setMaxLoad() - baseLoad:", baseLoad);
            console.info("setMaxLoad() - maxLoad:", maxLoad);
          }

          $("#maxLoad").val("/ " + maxLoad);
          validateLoad();
        } else {
          $("#maxLoad").val("");
        }
      }
    });
  }

  function setMaxHp() {

    var dwClass = $("#dwClass").val();
    var con = parseInt($("#con").val(), 10);
    var baseHp = 0;
    var maxHp = 0;

    $.ajax({
      url: "/data/classDetails.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        if (dwClass && con) {
          baseHp = parseInt(data[dwClass].baseHp, 10);
          if (debug == true) {
            console.info("setMaxHp() - baseHp:", baseHp);
          }
          maxHp = baseHp + con;
          if (debug == true) {
            console.info("setMaxHp() - maxHp:", maxHp);
          }
          $("#maxHp").val("/ " + maxHp);
          validateXp();
        } else {
          $("#maxHp").val("");
        }
      }
    });
  }

  function setMaxXp() {
    var lvl = $("#level").val();
    if (lvl) {
      var maxXp = parseInt(lvl, 10) + 7;
      $("#maxXp").val("/ " + maxXp);
      validateXp();
    } else {
      $("#maxXp").val("");
    }
  }

  function setRaceAttribute() {

    var dwClass = $("#dwClass").val();
    var race = $("#race").val();
    var raceAttribute = "";

    $.ajax({
      url: "/data/classDetails.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        if (dwClass && race) {
          raceAttribute = data[dwClass].raceAttributes[race];
          $("#raceAttribute").val(raceAttribute);
        } else {
          $("#raceAttribute").val("");
        }
        setHeight("raceAttribute");
      }
    });
  }

  function setDamage() {

    var dwClass = $("#dwClass").val();
    var damage = "";

    $.ajax({
      url: "/data/classDetails.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        if (dwClass) {
          damage = data[dwClass].damage;
          if (debug == true) {
            console.info("setDamage() - damage:", damage);
          }
          $("#damage").val(damage);
        } else {
          $("#damage").val("");
        }
      }
    });
  }

  function setAlignmentOptions() {
    $.ajax({
      url: "/data/classDetails.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        $("#alignment").empty();
        $("#alignment").append("<option hidden disabled selected value='null'></option>");
        var dwClass = $("#dwClass").val();
        if (dwClass) {
          alignments = data[dwClass].alignments;
          if (debug == true) {
            console.info("setAlignmentOptions() - alignments:", alignments);
          }
          $.each(alignments, function(index, value) {
            $("#alignment").append(new Option(value, value));
          });
        }
      }
    });
  }

  function setAlignmentAttribute() {

    var dwClass = $("#dwClass").val();
    var alignmentAttribute = "";
    var alignment = $("#alignment").val();

    $.ajax({
      url: "/data/classDetails.json",
      dataType: 'json',
      async: false,
      success: function(data) {
        alignment = $("#alignment").val();
        if (dwClass && alignment) {
          alignmentAttribute = data[dwClass].alignmentAttributes[alignment];
          $("#alignmentAttribute").val(alignmentAttribute);
        } else {
          $("#alignmentAttribute").val("");
        }
        setHeight("alignmentAttribute");
      }
    });
  }

  function setOptions() {
    setPlayerOptions();
    setAdventureOptions();
    setDwClassOptions();
    setRaceOptions();
  }

  function clearRows(tableID) {
    // delete all rows but last in a table
    var tableBody = $("#" + tableID + " tbody");
    var bodyRows = tableBody.children("tr");
    var bodyRowsCount = bodyRows.length;
    var templateRow = bodyRows.get(0);
    var newRowColCount = templateRow.cells.length;
    var newRowID = bodyRowsCount;

    for (var i = 0; i < bodyRowsCount - 1; i++) {
      deleteRow(tableID, 0);
    }
  }

  function loadCharacter() {
    var player = $("#player").val();
    var adventure = $("#adventure").val();
    var charaName = $("#charaName").val();

    if (player && adventure && charaName) {
      var characterSheet = (player + adventure + charaName).replace(/\W/g, "");
      if (debug == true) {
        console.info("loadCharacter() - characterSheet:", characterSheet);
      }
      db.collection("characters").doc(characterSheet).get().then((doc) => {
        if (doc.exists) {
          var loadedData = doc.data();
          if (debug == true) {
            console.info("loadCharacter() - Document data:", doc.data());
          }
          var chara = loadedData.characterSheet;

          $("#charVer").val(chara.version);
          $("#backstory").val(chara.backstory);
          setHeight("backstory");
          $("#look").val(chara.look);
          setHeight("look");
          $("#dwClass").val(chara.dwClass);
          $("#race").val(chara.race);
          setRaceAttribute();
          setAlignmentOptions();
          $("#alignment").val(chara.alignment);
          setAlignmentAttribute();
          $("#level").val(chara.level);
          $("#xp").val(chara.xp);
          $("#str").val(chara.abilities.str);
          $("#strAffliction").val(chara.abilities.strAffliction);
          setModifier("str");
          $("#dex").val(chara.abilities.dex);
          $("#dexAffliction").val(chara.abilities.dexAffliction);
          setModifier("dex");
          $("#con").val(chara.abilities.con);
          $("#conAffliction").val(chara.abilities.conAffliction);
          setModifier("con");
          $("#int").val(chara.abilities.int);
          $("#intAffliction").val(chara.abilities.intAffliction);
          setModifier("int");
          $("#wis").val(chara.abilities.wis);
          $("#wisAffliction").val(chara.abilities.wisAffliction);
          setModifier("wis");
          $("#cha").val(chara.abilities.cha);
          $("#chaAffliction").val(chara.abilities.chaAffliction);
          setModifier("cha");
          $("#armour").val(chara.armour);
          $("#hp").val(chara.hp);
          $("#funds").val(chara.funds);
          setMaxHp();
          setMaxXp();
          setDamage();
          setMaxLoad();

          var bondsCount = chara.bonds.length;
          clearRows("bondsTable");
          for (var i = 0; i < bondsCount; i++) {
            if (i != 0) {
              addRow("bondsTable");
            }
            if (debug == true) {
              console.info("loadCharacter - chara.bonds[" + i + "]:", chara.bonds[i]);
            }
            $("#bond" + i).val(chara.bonds[i]);
            setHeight("bond" + i);
          }

          var itemCount = chara.gear.items.length;
          clearRows("gearTable");
          for (var j = 0; j < itemCount; j++) {
            if (j != 0) {
              addRow("gearTable");
            }
            if (debug == true) {
              console.info("loadCharacter - chara.gear.items[" + j + "]:", chara.gear.items[j]);
              console.info("loadCharacter - chara.gear.itemsWeights[" + j + "]:", chara.gear.itemsWeights[j]);
            }
            $("#item" + j).val(chara.gear.items[j]);
            $("#itemWeight" + j).val(chara.gear.itemsWeights[j]);
            setHeight("item" + j);
          }
          setTotalLoad();

          var classFeaturesCount = chara.classFeatures.classFeatures.length;
          clearRows("classFeaturesTable");
          for (var k = 0; k < classFeaturesCount; k++) {
            if (k != 0) {
              addRow("classFeaturesTable");
            }
            if (debug == true) {
              console.info("loadCharacter - chara.classFeatures.classFeatures[" + k + "]:", chara.classFeatures.classFeatures[k]);
              console.info("loadCharacter - chara.classFeatures.classFeaturesCheckboxes[" + k + "]:", chara.classFeatures.classFeaturesCheckboxes[k]);
            }
            $("#classFeature" + k).val(chara.classFeatures.classFeatures[k]);
            $("#classFeatureCheckbox" + k).prop("checked", chara.classFeatures.classFeaturesCheckboxes[k]);
            setHeight("classFeature" + k);
          }

          alert("loadCharacter() - Character Sheet succesfully loaded!");

        } else {
          // doc.data() will be undefined in this case
          if (debug == true) {
            alert("loadCharacter() - No Character Sheet found");
            console.warn("loadCharacter() - No such document in collection", doc);
          }
        }
      }).catch((error) => {
        if (debug == true) {
          alert("loadCharacter() - Failed to load character correctly, see console error");
          console.error("loadCharacter() - Error getting document:", error);
        }
      });
    } else {
      alert("loadCharacter() - Cannot load because Player, Adventure and Character are not populated");
    }
  }

  function saveCharacter() {
    var dbVer = 0;
    var player = $("#player").val();
    var adventure = $("#adventure").val();
    var charaName = $("#charaName").val();
    var characterSheet = (player + adventure + charaName).replace(/\W/g, "");
    var owner = userEmail;
    var version = parseInt($("#charVer").val(), 10);
    if (!version && version != 0) {
      //No version in sheet so assume new character
      version = 0;
    }
    if (debug == true) {
      console.info("saveCharacter() - version:", version);
    }

    if (player && adventure && charaName) {

      if (debug == true) {
        console.info("saveCharacter() - characterSheet:", characterSheet);
      }
      db.collection("characters").doc(characterSheet).get().then((doc) => {
        if (doc.exists) {
          var loadedData = doc.data();
          var chara = loadedData.characterSheet;
          dbVer = chara.version;
          if (debug == true) {
            console.info("saveCharacter() - dbVer:", dbVer);
          }
        } else {
          // doc.data() will be undefined in this case so it is a new character
          if (debug == true) {
            console.info("saveCharacter() - Character does not exist in db - dbVer", dbVer);
          }
        }

        if (!dbVer && dbVer != 0) {
          alert("saveCharacter() - Cannot save because dbVer cannot be retrieved");
        } else if (version != dbVer) {
          alert("saveCharacter() - Cannot save because Character has been updated, please re-load and try again");
        } else if (!(owner)) {
          alert("saveCharacter() - Cannot save because user is not authenticated");
        } else if (abilityErrors) {
          alert("saveCharacter() - Cannot save because the total Ability Score is invalid");
        } else if (loadErrors) {
          alert("saveCharacter() - Cannot save because total Item Weight exceeds maximum load");
        } else {
          version = version + 1;
          if (debug == true) {
            console.info("saveCharacter() - newVersion -", version);
          }
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
          var xp = parseInt($("#xp").val(), 10);
          if (!xp && xp != 0) {
            xp = null;
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
          if (!armour && armour != 0) {
            armour = null;
          }
          var hp = parseInt($("#hp").val(), 10);
          if (!hp) {
            hp = null;
          }
          var funds = parseInt($("#funds").val(), 10);
          if (!funds && funds != 0) {
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
            if (!bonds[i]) {
              bonds[i] = null;
            }
          }

          //gearTable
          tableBody = $("#gearTable tbody");
          bodyRows = tableBody.children("tr");
          bodyRowsCount = bodyRows.length;
          var items = [];
          var itemsWeights = [];
          for (var j = 0; j < bodyRowsCount; j++) {
            items[j] = $("#item" + j).val();
            if (!items[j]) {
              items[j] = null;
            }
            itemsWeights[j] = parseInt($("#itemWeight" + j).val(), 10);
            if (!itemsWeights[j] && itemsWeights[j] != 0) {
              itemsWeights[j] = null;
            }
          }

          //classFeaturesTable
          tableBody = $("#classFeaturesTable tbody");
          bodyRows = tableBody.children("tr");
          bodyRowsCount = bodyRows.length;
          var classFeatures = [];
          var classFeaturesCheckboxes = [];
          for (var k = 0; k < bodyRowsCount; k++) {
            classFeatures[k] = $("#classFeature" + k).val();
            if (!classFeatures[k]) {
              classFeatures[k] = null;
            }
            classFeaturesCheckboxes[k] = $("#classFeatureCheckbox" + k).is(':checked');
            if (!classFeaturesCheckboxes[k]) {
              classFeaturesCheckboxes[k] = null;
            }
          }

          // debug
          if (debug == true) {
            console.info("saveCharacter() - xp", xp);
            console.info("saveCharacter() - bonds", bonds);
            console.info("saveCharacter() - items", items);
            console.info("saveCharacter() - itemsWeights", itemsWeights);
            console.info("saveCharacter() - classFeatures", classFeatures);
            console.info("saveCharacter() - classFeaturesCheckboxes", classFeaturesCheckboxes);
          }

          // SAVE FUNCTION
          db.collection("characters").doc(characterSheet).set({
              "characterSheet": {
                "owner": owner,
                "player": player,
                "adventure": adventure,
                "charaName": charaName,
                "look": look,
                "backstory": backstory,
                "dwClass": dwClass,
                "race": race,
                "alignment": alignment,
                "level": level,
                "xp": xp,
                "abilities": {
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
                "armour": armour,
                "hp": hp,
                "funds": funds,
                "bonds": bonds,
                "gear": {
                  "items": items,
                  "itemsWeights": itemsWeights
                },
                "classFeatures": {
                  "classFeatures": classFeatures,
                  "classFeaturesCheckboxes": classFeaturesCheckboxes
                },
                "version": version
              }
            })
            .then(() => {
              if (debug == true) {
                console.info("saveCharacter() - Document written with ID:", characterSheet);
              }
              $("#charVer").val(version);
              alert("saveCharacter() - Character Sheet succesfully saved!");
            })
            .catch((error) => {
              console.error("saveCharacter() - Error writing document:", error);
              alert("saveCharacter() - Failed to save Character Sheet, see console error");
            });
        }

      }).catch((error) => {
        if (debug == true) {
          alert("saveCharacter() - Failed to load character version data correctly, see console error");
          console.error("saveCharacter() -  Error getting document:", error);
        }
      });
    } else {
      alert("saveCharacter() - Cannot save because Player, Adventure and Character are not populated");
    }
  }

  // Set various drop down options and size cells
  setOptions();
  setHeight("bond0");
  setHeight("item0");
  setHeight("classFeature0");

  //listener functions
  $(document).on("change", "#dwClass, #race, #alignment", function() {

    var change = $(this).attr("id");

    if (debug == true) {
      console.info("$(#dwClass, #race, #alignment).change() - change:", change);
    }

    // Set stuff
    setRaceAttribute();
    setMaxLoad();
    setMaxHp();
    setDamage();

    // Set alignment options if class is changing
    if (change == "dwClass") {
      setAlignmentOptions();
    }

    // Set alignment attribute
    setAlignmentAttribute();

  });

  $(document).on("change", "#level", function() {
    setMaxXp();
  });

  $(document).on("change", "#xp", function() {
    validateXp();
  });

  $(document).on("change", ".ability, .abilityAffliction", function() {
    var ability = $(this).attr("id").replace("Affliction", "");
    setModifier(ability);
    validateAbilityScore();
  });

  $(document).on("change", "#str", function() {
    setMaxLoad();
  });

  $(document).on("change", "#con", function() {
    setMaxHp();
  });

  $(document).on("change", "#hp", function() {
    validateHp();
  });

  $(document).on("change", "[id^=itemWeight]", function() {
    setTotalLoad();
    validateLoad();
  });

  $(document).on("click", ".addRow", function() {
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
      setTotalLoad();
    }
  });

  $(document).on("keypress", "textarea", function() {
    var textareaID = this.id;
    if (debug == true) {
      console.info("textarea.keypress() - textareaID:", textareaID);
    }
    setHeight(textareaID);
  });

  $(document).on("click", ".clearCharacter", function() {
    location.reload(true);
  });

  $(document).on("click", ".saveCharacter", function() {
    saveCharacter();
  });

  $(document).on("click", ".loadCharacter", function() {
    loadCharacter();
  });

  $(document).on("click", ".faqLink", function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    $("#main").hide();
    $("#faq").show();
  });

  $(document).on("click", ".expandAll", function() {
    expandAll();
  });

  $(document).on("click", ".question", function() {
    var question = $(this).attr("id");
    var identifier = question.slice(-1);
    if (debug == true) {
      console.info("$(.question).click() - question:", question);
      console.info("$(.question).click() - identifier:", identifier);
    }

    expandcontainer(identifier);
  });

  $(document).on("click", ".sheetLink", function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    $("#main").show();
    $("#faq").hide();
  });

  $(".profPicture").hover(function() {
    $(".profDetails").show();
  }, function() {
    $(".profDetails").hide();
  });

});
