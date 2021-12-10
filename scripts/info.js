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
  //I have the values pushed into an array, now all I need to do is send them to PHP, but I'm having a bit of trouble doing so.
  
  //values.push($(".clickedItemInfo").each().text());

  console.log(values);
  var item_name = $(selectedItem).text();
  var purpose = 7;
  
  $.post("fn.php", { purpose: purpose, item_name: item_name }).done(function (
    data
  ) {
    $(".resultWrapper").append(data);
    console.log("ajax response : " + data);
  });
}

function selectItemInfo() {
  $(function () {
    $(".itemList li").on("click", function () {
      $(this).toggleClass("clickedItemInfo"); // LINE MODIFIED
    });
  });
}
