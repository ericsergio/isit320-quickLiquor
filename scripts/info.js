function doItemInfo(selectedItem) {
  var item_name = $(selectedItem).text();
  var purpose = 7;
  $(".itemList").remove();
  $.post("fn.php", { purpose: purpose, item_name: item_name }).done(function (
    data
  ) {
    $(".resultWrapper").append(data);
    console.log("ajax response : " + data);
  });
}
