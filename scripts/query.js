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
        let unitTypeStr = vars[3].replace("1 Liter", "_1L").replace("750 ml", "_750ml").replace("187 ml","_187ml").replace("Can","_Can");
        let isCase = vars[2] === 'Case';
        let searchString = `${vars[0]}${unitTypeStr}`
        let searchStr = isCase ? `${searchString}_case` : `${searchString}`;
        //console.log(searchStr);
        //make sure searchStr is what goes in the last param, not searchString.
        OrderItem[[itemVar]] = new OrderItem(i, vars[5], vars[0], vars[1], vars[2], vars[3], searchStr);
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
            $(".testResult").append(`<p class = 'data'>${oItems[0]} | ${oItems[2]}</p>`);
            //$(".testResult").append(`<p class = 'data'>${JSON.stringify(data)}</p>`);
            //$(".testResult").append(JSON.stringify(data) + "\n");
            
            //$(".testResult").css[{'height':'400px'}]
        })
    }
}
    //$.get("http://localhost:3000/getitems/102   ", function(data) {
      //  let o = JSON.stringify(data);
       // let oItems = o.split(',');
        /*for (p in oItems) {
            console.log(oItems[p])
        }*/
        //console.log(data);
        //console.log(o.length);
        //console.log(o[2]);
        //console.log(typeof data);
        //console.log(JSON.stringify(data));    
        //$(".testResult").text(JSON.stringify(data));
        //alert(JSON.stringify(data));
  //      postProcessedData();
    //});

//function postProcessedData() {
    //http://localhost:3000
    //let obj = OrderItem.item1.search();
    //$.post("http://localhost:3000/data.php", {obj})

    //$.post("data.php", {name:OrderItem.item1.search().search})
    //.done(function(data) {
    //    console.log("ajax response : " + data);
    //})
//}


/******************************************
      $.post("fn.php", {idx: idx, purpose: purpose, originalname: origName, changeArr: changes})
      .done(function(data) {
          //Need to display error here if one occurs via alert or something
          console.log("ajax response : " + data);
      });

**************************************************/

//This works - back up
/*
function apiQueryCheckSetup(dist) {
    console.log(dist);
    console.log($('#count').text());
    const itemCount = Number($('#count').text()) - 1;
    Order.order = new Order(`${dist}`, itemCount);
    for(var i = 1;i<=itemCount;i++) {
        const itemVar = 'item' + i;
        let itemName = $('#orderTable').find('tr')[i].children[0].innerHTML;
        let itemQuantity = $('#orderTable').find('tr')[i].children[1].innerHTML;
        let itemUnit = $('#orderTable').find('tr')[i].children[2].innerHTML;
        let itemUnitType = $('#orderTable').find('tr')[i].children[3].innerHTML;
        let unitTypeStr = itemUnitType.replace("1 Liter", "_1L").replace("750 ml", "_750ml").replace("187 ml","_187ml").replace("Can","_Can");
        let isCase = itemUnit === 'Case';
        let searchString = `${itemName}${unitTypeStr}`
        let searchStr = isCase ? `${searchString}_case` : `${searchString}`;
        console.log(searchStr);
        //make sure searchStr is what goes in the last param, not searchString.
        OrderItem[[itemVar]] = new OrderItem(i, itemName, itemQuantity, itemUnit, itemUnitType, searchStr);
        console.log(OrderItem[[itemVar]]);
    }
}
*/


