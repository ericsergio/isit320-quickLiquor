//Function to select or deselect lis
function selectItemInfo() {
    $(function () {
        //doubleclick will remove LI from clickedItemInfo Class
        $(".itemList li").on("dblclick", function () {
            $(this).removeClass("clickedItemInfo");
        });
        //click will add LI to clickedItemInfo class (highlights the li Blue)
        $(".itemList li").on("click", function () {
            $(this).addClass("clickedItemInfo"); // LINE MODIFIED
        });
    });
}
function doItemInfoStats() {
    //hide the original .itemList li's
    $(".itemList").hide();
    if ($("#resultTable").length) {
        $("#resultTable").remove();
    }

    //remove instructions for padding issues
    $("#statsInstruction").remove();
    //I have the values pushed into itemNames
    const purpose = 7;
    let data = $(this).serializeArray();
    let itemNames = [];
    //Grab clicked LI's
    $(".clickedItemInfo").each(function () {
        itemNames.push($(this).text());
    });
    //Loop through all values in throwaway array + push new array into data var to prepare for AJAX call;
    for (i = 0; i < itemNames.length; i++) {
        data.push({
            //One Dimension Array trick https://stackoverflow.com/questions/9001526/send-array-with-ajax-to-php-script
            //faking a key value pair so it doesn't throw an exception when it lands on fn.php... see above SO post.
            name: "itemNames[]", // These blank empty brackets are imp!
            value: itemNames[i],
        });
    }
    //ajax call to post to fn.php which calls purpose 7 -> see do_item_info_stats
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
