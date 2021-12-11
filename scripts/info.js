class Item_Stats {
  constructor(
    i_name,
    i_dist,
    i_type,
    i_par,
    d_order_type,
    d_order_quantity,
    default_order,
    on_hand
  ) {
    this.i_name = i_name;
    this.i_dist = i_dist;
    this.i_type = i_type;
    this.i_par = i_par;
    this.d_order_type = d_order_type;
    this.d_order_quantity = d_order_quantity;
    this.default_order = default_order;
    this.on_hand = on_hand;
  }
}

// function doItemInfo(selectedItem) {
//   var item_name = $(selectedItem).text();
//   var purpose = 7;
//   $(".itemList").remove();
//   $.post("fn.php", { purpose: purpose, item_name: item_name }).done(function (
//     data
//   ) {
//     $(".resultWrapper").append(data);
//     console.log("ajax response : " + data);
//   });
// }

function doItemInfo(selectedItem) {
  var values = [];
  $(".clickedItemInfo").each(function () {
    values.push($(this).text());
  });
  //I have the values pushed into an array, now all I need to do is send them to PHP, but I'm having a bit of trouble
  //values.push($(".clickedItemInfo").each().text());

  console.log(values);
  var item_name = $(selectedItem).text();
  var purpose = 7;

  $.post("fn.php", {
    purpose: purpose,
    values: values,
    item_name: selectedItem,
  }).done(function (data) {
    $(".resultWrapper").append(data);
    console.log("ajax response : " + data);
  });
}

function doItemInfoStats() {
  //I have the values pushed into statsArray
  var purpose = 8;
  var data = $(this).serializeArray();
  var itemNames = [];
  $(".clickedItemInfo").each(function () {
    itemNames.push($(this).text());
  });

  console.log(itemNames);

  for (i = 0; i < itemNames.length; i++) {
    data.push({
      name: "itemNames[]", // These blank empty brackets are imp!
      value: itemNames[i],
    });
  }

  $.post("fn.php", {
    url: jQuery(this).attr("action"),
    dataType: "json",
    purpose: purpose,
    data: data,
  }).done(function (data) {
    $(".resultWrapper").append(data);
    console.log("ajax response : " + data);
  });
}

function selectItemInfo() {
  $(function () {
    $(".itemList li").on("click", function () {
      $(this).addClass("clickedItemInfo"); // LINE MODIFIED
    });
  });
}
