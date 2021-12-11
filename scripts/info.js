function doItemInfo(selectedItem) {
<<<<<<< HEAD
    var item_name = $(selectedItem).text();
    var purpose = 7;
    $(".itemList").remove();
    $.post("fn.php", { purpose: purpose, item_name: item_name }).done(function (
        data
    ) {
        $(".resultWrapper").append(data);
        console.log("ajax response : " + data);
    });
=======
  var item_name = $(selectedItem).text();
  var purpose = 7;
  $(".itemList").remove();
  $.post("fn.php", { purpose: purpose, item_name: item_name }).done(function (
    data
  ) {
    $(".resultWrapper").append(data);
    console.log("ajax response : " + data);
  });
>>>>>>> a47bd401705b06dd86a91a6b214602dd9d1e516f
}
