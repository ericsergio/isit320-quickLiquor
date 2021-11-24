



function Order(dist, count) {
    this.dist = dist;
    this.count = count || null;
}

function OrderItem(id, name, orderQuantity, unit, orderUnit) {
    this.id = id;
    this.name = name;
    this.orderQuantity = orderQuantity;
    this.unit = unit;
    this.orderUnit = orderUnit;
}


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
    //console.log($('#orderTable'));
    
    $('.results').before(`<button id = "checkOrder" onclick="apiQueryCheckSetup('${dist}')">Check Order</button>`);
    $('.results').before('<button id = "sendOrder">Send Order</button>');
    
    
}


function apiQueryCheckSetup(dist) {
    console.log(dist);
    console.log($('#count').text());
    Order.order = new Order(`${dist}`, $('#count').text());

}

function apiQuery(){
    
}