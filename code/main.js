$(document).ready(function() {

  $("#dwClass").change(function() {
    var $dwClass = $(this);
    var $str = $("#str");
    var $con = $("#con");

    $.getJSON("data/classes.json", function(data) {
      var dwClass = $dwClass.val();
      var str = $str.val();
      var con = $con.val();
      if (debug == true) {
        console.info(
          "$(#dwClass).change() - dwClass: " + dwClass + '\n' +
          "$(#dwClass).change() - str: " + str + '\n' +
          "$(#dwClass).change() - con: " + con)
      };
      var alignments = [];
      var damage = "";
      var baseLoad = 0;
      var baseHP = 0;
      var maxLoad = 0;
      var maxHP = 0;

      // set MaxLoad based upon strength
      if (str) {
        str = parseInt(str, 10);
        baseLoad = data[dwClass].baseLoad;
        if (debug == true) {
          console.info("$(#dwClass).change() - baseLoad: " + baseLoad)
        };
        baseLoad = parseInt(baseLoad, 10);
        maxLoad = baseLoad + str;
        if (debug == true) {
          console.info("$(#dwClass).change() - maxLoad: " + maxLoad)
        };
        $("#maxLoad").val("/ " + maxLoad)
      }

      // set MaxHP based upon constitution
      if (con) {
        con = parseInt(con, 10);
        baseHP = data[dwClass].baseHP;
        if (debug == true) {
          console.info("$(#dwClass).change() - baseHP: " + baseHP)
        };
        baseHP = parseInt(baseHP, 10);
        maxHP = baseHP + con;
        if (debug == true) {
          console.info("$(#dwClass).change() - maxHP: " + maxHP)
        };
        $("#maxHP").val("/ " + maxHP)
      }

      // set damage based upon class
      damage = data[dwClass].damage;
      if (debug == true) {
        console.info(
          "$(#dwClass).change() - damage: " + damage)
      };
      $("#damage").val(damage);

      // set alignments based upon class
      alignments = data[dwClass].alignments.split(",");
      if (debug == true) {
        console.info(
          "$(#dwClass).change() - alignments: " + alignments)
      };
      var $alignments = $("#alignment");
      $alignments.empty();
      $.each(alignments, function(index, value) {
        $alignments.append("<option>" + value + "</option>");
      });

    });
  });

  $("#race").change(function() {
    var $race = $(this);
    var $dwClass = $("#dwClass");

    $.getJSON("data/classes.json", function(data) {

      var dwClass = $dwClass.val();
      var race = $race.val();
      var raceAttribute = "";

      raceAttribute = data[dwClass].raceAttributes[race];

      $("#raceAttribute").val(raceAttribute);
    });
  });

  $("#alignment").change(function() {
    var $alignment = $(this);
    var $dwClass = $("#dwClass");

    $.getJSON("data/classes.json", function(data) {

      var dwClass = $dwClass.val();
      var alignment = $alignment.val();
      var alignmentAttribute = "";

      alignmentAttribute = data[dwClass].alignmentAttributes[alignment];

      $("#alignmentAttribute").val(alignmentAttribute);
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
            "$(#str).change() - dwClass: " + dwClass + '\n' +
            "$(#str).change() - str: " + str + '\n' +
            "$(#str).change() - baseLoad: " + baseLoad + '\n' +
            "$(#str).change() - maxLoad: " + maxLoad)
        };

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
            "$(#con).change() - dwClass: " + dwClass + '\n' +
            "$(#con).change() - con: " + con + '\n' +
            "$(#con).change() - baseHP: " + baseHP + '\n' +
            "$(#con).change() - maxHP: " + maxHP)
        };

        $("#maxHP").val("/ " + maxHP);
      } else {
        $("#maxHP").val("");
      }
    });
  });

  $(document).on("change", "[id^=itemWeight]", function() {
    //on change of any itemWeight elements add weight together and display in load
    var tbl = document.getElementById("gearTable");
    var tableBody = tbl.getElementsByTagName('tbody')[0];
    var bodyRowCount = tableBody.getElementsByTagName('tr').length;
    if (debug == true) {
      console.info("itemWeight.change() - gearTable bodyRowCount:" + bodyRowCount)
    };
    var totalload = 0;
    var itemload = 0;
    for (var i = 0; i < bodyRowCount; i++) {
      if (debug == true) {
        console.info("itemID: itemWeight" + i)
      };
      itemload = $("#itemWeight" + i).val();
      if (itemload) {
        itemload = parseInt(itemload, 10);
        totalload = totalload + itemload
        if (debug == true) {
          console.info(
            "itemWeight.change() - itemload:" + itemload + '\n' +
            "itemWeight.change() - totalload:" + totalload
          )
        }
      }
    };

    $("#load").val(totalload);

  });

  $("#saveCharacter").click(function() {
    db.collection("users").add({
        first: "Ada",
        last: "Lovelace",
        born: 1815
      })
      .then(function(docRef) {
        if (debug == true) {
          console.info("saveCharacter() - Document written with ID: ", docRef.id)
        };
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  });

  $("#loadCharacter").click(function() {
    db.collection("users").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (debug == true) {
          console.info(`${doc.id} => ${doc.data()}`)
        };
      });
    });
  });

  $("#clearCharacter").click(function() {
    db.collection("users").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (debug == true) {
          console.info(`${doc.id} => ${doc.data()}`)
        };
      });
    });
  });

  $("#level").change(function() {
    setMaxXP();
  });

  $(".ability, .abilityAffliction").change(function() {
    setModifier("dex");
  });

  $(".expandAll").click(function() {
    expandall();
  });

  $(".question").click(function() {
    expandcontainer(0);
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
    $(this)
    addRow('bondsTable');
  });

  $(".deleteRow").click(function() {
    deleteRow('bondsTable', 0);
  });

  //$("#").click(function() {});

});
