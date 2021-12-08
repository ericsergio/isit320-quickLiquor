function Order(dist, count) {
    this.dist = dist;
    this.count = count || null;
}

function OrderItem(orderItemId, inventoryId, name, orderQuantity, unit, orderUnit,searchString) {
    this.orderItemId = orderItemId;
    this.inventoryId = inventoryId;
    this.name = name;
    this.orderQuantity = orderQuantity;
    this.unit = unit;
    this.orderUnit = orderUnit;
    this.searchString = searchString;
}

const Items = [];
const urlItems = [];
$('.testResult').hide()

//this function is placed as event listener on div#distWrapper ul#distList li children. The param "that" refers to 
//this which has the context of that element. the variable dist below is taking the last 2 characters of the li id 
//to eventually provide the property "dist" above in the Order constructer once the button gets clicked. 
//The function is creating two new buttons on the page which add the dist variable as a param to a function that on 
//the button's creation assign an event listener to named apiQueryCheck. apiQueryCheck will use dist for the Order object's
//name and at this point a count variable of the order items from fn.php will be made available. While the function
//placeControls(that) is executing, the count value from fn.php is not yet available so this function needs to 
//finish its execution. In apiQueryCheck the Order object will be created with the distributer and the order item count. 
function placeControls(that){
    let dist = $(that).attr('id').substr($(that).attr('id').length - 2);
    $(that).addClass('verify');
    console.log(that);
    $('.results').before(`<button id = "checkOrder" onclick="apiQueryCheckSetup('${dist}')">Check Order</button>`);
    //apiQueryCheckSetup(dist) -> Object Creation & Order Array Populated -> apiQuery() -> doOrder()
    $('.results').before('<button id = "sendOrder" onclick = "apiQuery()">Send Order</button>');
}


function apiQueryCheckSetup(dist) {
    const itemCount = Number($('#count').text()) - 1;
    Order.order = new Order(`${dist}`, itemCount);
    for(var i = 1;i<=itemCount;i++) {
        const itemVar = 'item' + i;
        var vars = ['itemName', 'itemQuantity', 'itemUnit', 'itemUnitType', 'inventoryId'];
        for (let n = 0;n < 6; n++){
            vars[n] = $('#orderTable').find('tr')[i].children[n].innerHTML
        }
        //These next 4 variables create the exact string that is in the name field of the distributer's API. Originally,
        //I planned to use the name to query the OrderItems but later changed it to query the Order items based on
        //their numeric Inventory id.
        let unitTypeStr = vars[3].replace("1 Liter", "_1L").replace("750 ml", "_750ml").replace("187 ml","_187ml").replace("Can","_Can");
        let isCase = vars[2] === 'Case';
        let searchString = `${vars[0]}${unitTypeStr}`
        let searchStr = isCase ? `${searchString}_case` : `${searchString}`;
        //make sure searchStr is what goes in the last param, not searchString.
        OrderItem[[itemVar]] = new OrderItem(i, vars[5], vars[0], vars[1], vars[2], vars[3], searchStr);
        //Items is an array that gets populated with the Inventory ids which will later get appended to the end of the URL
        //This next for nested loop adds an item for each product being ordered so that the ordered quantity is accounted for.
        //This means that the Items array will have duplicates which is what we want since if the order consists of 2 of something
        //you want to order it twice.
        for(let q = 0; q < OrderItem[[itemVar]].orderQuantity;q++){
            Items.push(OrderItem[[itemVar]].inventoryId);
        }
        //Items.push(OrderItem[[itemVar]].inventoryId);
        console.log(OrderItem[[itemVar]]);
        //apiQuery();
    }
}

function doOrder() { 
    for (p in Items) {
        let url = "http://localhost:3000/getitems/";
        url = url + Items[p];
        urlItems.push(url);
    }
}

OrderItem.prototype.orderItemId = function(){
    return this;
};


function doTempTbl() {
    $.get('http://localhost:3000/createordertable', function(data) {
        console.log(data);
    })
}

function doTotal() {
    //setTimeout is needed to ensure all the requests finish before the total is retrieved
    setTimeout(function() {
        $.get('http://localhost:3000/total', function(data) {
            let o = JSON.stringify(data);
            let oItems = o.split(':');
            let total = oItems[1].replace(/"}]/gi,'').replace(/"/gi,'');
            console.log(total);
            $('.itemized').before(`<h2 id = 'totalLbl'>Invoice Total</h2><h3 id = 'InvoiceTotal'>$${total}</h3>`);
            
        })
    },800);
}

function sendOrder() {
    doOrder();
    var counter = 0;
    $(".testResult").fadeIn(700)
    for(p in urlItems) {
        $.get(urlItems[p], function(data) {
            var o = JSON.stringify(data);
            let oItems = o.split(',');
            var name = oItems[2].substring(7).replace(/":\\"/gi,'').replace(/\\"/gi,'').replace(/_/gi, ' ');
            var price = Number(oItems[3].substring(8).replace(/:\\"/gi, '').replace(/\\"/gi,'').replace(/"/gi,''));
            console.log(o);
            //$(".testResult").html(`<p class = 'data'>${oItems[0]}</p>`);
            let rowId = `row${counter}`;
            $("#itemizedBody").append(`<tr id = ${rowId}><td class = 'data'>${name}</td><td class = 'data'>$${price}</td></tr>`);
            counter++;
            //$(".testResult").append(`<p class = 'data'>${oItems[0]} | ${oItems[2]}</p>`);
            //$(".testResult").append(`<p class = 'data'>${JSON.stringify(data)}</p>`);
            //$(".testResult").append(JSON.stringify(data) + "\n");
        })
    }
    $(".itemized").before(`<h2>Your Itemized Invoice:</h2>`);
}

function doHideMsg() {
    $('.testResult').fadeOut(300);
}

function doButtons() {
    $('.testResult').fadeIn(700)
    $('.itemized').before(`<button id = "OkBtn" onclick = "doHideMsg()">OK</button>`);
}

function doOutOfStockItems() {
       //setTimeout is needed to ensure all the requests finish before the total is retrieved
       setTimeout(function() {
        $.get('http://localhost:3000/outofstock', function(data) {
            let o = JSON.stringify(data);
            let oItems = o.split(',');
            $('.outOfStock ul').before(`<h2>Items Not Currently In Stock:</h2>`);
            for(var i=2;i<oItems.length;i+=3) {
                $('.outOfStock ul').append(`<li>${oItems[i].slice(12,-2).replace(/"/gi,'').replace(/_/gi, ' ')}</li>`);
                //console.log(oItems[i]);
            }
            //$('.outOfStock ul').append(`<li></li>`);
        })
    },1500);
}

function doInStockItems() {
    //setTimeout is needed to ensure all the requests finish before the total is retrieved
    setTimeout(function() {
     $.get('http://localhost:3000/instock', function(data) {
         let o = JSON.stringify(data);
         let oItems = o.split(':');
         console.log(o);
         
     })
 },1500);
}


function apiQuery(){
    doTempTbl();
    sendOrder();
    doButtons();
    doTotal();
    doOutOfStockItems();
    doInStockItems();
}









    //http://104.42.49.64/
    //http://localhost:3000/getitems/109
    //$.get("http://localhost:3000/getitems/109", function(data) {