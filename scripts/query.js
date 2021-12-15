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

const _Items = [];
const urlItems = [];
$('.testResult').hide()
function placeControls(that){
    let dist = $(that).attr('id').substr($(that).attr('id').length - 2);
    $(that).addClass('verify');
    console.log(that);
    if($('button').length < 2 ) {
        $('.results').before(`<button id = "checkOrder" onclick="apiQueryCheckSetup('${dist}')">Check Order</button>`);
    }
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
        let unitTypeStr = vars[3].replace("1 Liter", "_1L").replace("750 ml", "_750ml").replace("187 ml","_187ml").replace("Can","_Can");
        let isCase = vars[2] === 'Case';
        let searchString = `${vars[0]}${unitTypeStr}`
        let searchStr = isCase ? `${searchString}_case` : `${searchString}`;
        OrderItem[[itemVar]] = new OrderItem(i, vars[5], vars[0], vars[1], vars[2], vars[3], searchStr);
        for(let q = 0; q < OrderItem[[itemVar]].orderQuantity;q++){
            _Items.push(OrderItem[[itemVar]].inventoryId);
        }
        console.log(OrderItem[[itemVar]]);
    }
    setTimeout(apiQuery, 1200);
}

function doOrder() { 
    for (p in _Items) {
        let url = "http://localhost:3000/getitems/";
        url = url + _Items[p];
        urlItems.push(url);
    }
}

function doTempTbl() {
    $.get('http://localhost:3000/createordertable', function(data) {
        console.log(data);
    })
}

function sendOrder() {
    doTempTbl();
    doOrder();
    var counter = 0;
    //$(".testResult").fadeIn(700)
    for(p in urlItems) {
        $.get(urlItems[p], function(data) {
            var o = JSON.stringify(data);
            let oItems = o.split(',');
            var name = oItems[2].substring(7).replace('":\\"','').replace('\\"','').replace('_', ' ');
            var price = Number(oItems[3].substring(8).replace(':\\"', '').replace('\\"','').replace('"',''));
            console.log();
            let rowId = `row${counter}`;
            $("#itemizedBody").append(`<tr id = ${rowId}><td class = 'data'>${name}</td><td class = 'data'>$${price}</td></tr>`);
            counter++;
        })
    }
    $(".itemized").before(`<h2>Your Itemized Invoice:</h2>`);
    $('.itemized').before(`<button id = "OkBtn" onclick = "doHideMsg()">OK</button>`);
    $('.testResult').fadeIn(700)
}

function doTotal() {
    setTimeout(function() {
        $.get('http://localhost:3000/total', function(data) {
            let o = JSON.stringify(data);
            let oItems = o.split(':');
            console.log(`${oItems[1]}++++++`)
            let total = oItems[1].replace('"}]','').replace('"','');
            
            console.log(total);
            $('.itemized').before(`<h2 id = 'totalLbl'>Invoice Total</h2><h3 id = 'InvoiceTotal'>$${total}</h3>`);
        })
    },1800);
}

function doHideMsg() {
    $('.testResult').fadeOut(300);
}

function doOutOfStockItems() {
       setTimeout(function() {
        $.get('http://localhost:3000/outofstock', function(data) {
            let o = JSON.stringify(data);
            let oItems = o.split(',');
            $('.outOfStock ul').before(`<h2>Items Not Currently In Stock:</h2>`);
            for(var i=2;i<oItems.length;i+=3) {
                $('.outOfStock ul').append(`<li>${oItems[i].slice(12,-2).replace('"','').replace('_', ' ')}</li>`);
            }
        })
    },1500);
}

function apiQuery(){
    sendOrder();
    doTotal();
    doOutOfStockItems();
}


                                                                                                       




