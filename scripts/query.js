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
    $('.results').before('<button id = "sendOrder" onclick = "apiQuery()">Send Order</button>');
}


function apiQueryCheckSetup(dist) {
    //console.log(dist);
    //console.log($('#count').text());
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
        Items.push(OrderItem[[itemVar]].inventoryId);
        console.log(OrderItem[[itemVar]]);
    }
}

function doOrder() {
    for (p in Items) {
        let url = "http://localhost:3000/getitems/";
        url = url + Items[p];
        urlItems.push(url);
        //console.log(url);
    }
}



OrderItem.prototype.orderItemId = function(){
    //let searchReq = {'search':this.searchString, 'quantity':this.orderQuantity}
    return this;
};

$('.testResult').hide()
function apiQuery(){
    doOrder();
    $('.testResult').fadeIn(300)
    //http://104.42.49.64/
    //http://localhost:3000/getitems/109
    //$.get("http://localhost:3000/getitems/109", function(data) {
    for(p in urlItems) {
        $.get(urlItems[p], function(data) {
            let o = JSON.stringify(data);
            let newO = new Object(data);
            let oItems = o.split(',');
            //$(".testResult").append(`<p class = 'data'>${oItems[0]} | ${oItems[2]} | ${oItems[3]} | ${oItems[4]}</p>`);
            //$(".testResult").append(`<p class = 'data'>${oItems[0]} | ${oItems[2]}</p>`);
            $(".testResult").append(`<p class = 'data'>${JSON.stringify(data)}</p>`);
            
            //$(".testResult").append(JSON.stringify(data) + "\n");
        })
    }
}




