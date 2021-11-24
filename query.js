function Order(dist, count) {
    this.dist = dist;
    this.count = count || null;
}

function OrderItem(id, name, orderQuantity, unit, unitType) {
    this.id = id;
    this.name = name;
    this.orderQuantity = orderQuantity;
    this.unit = unit;
    this.unitType = unitType;
}



function placeControls(that){
    let dist = $(that).attr('id').substr($(that).attr('id').length - 2);
    //console.log($('#orderTable'));
    
    $('.results').before(`<button id = "checkOrder" onclick="apiQueryCheck('${dist}')">Check Order</button>`);
    $('.results').before('<button id = "sendOrder">Send Order</button>');
    
    
}


function apiQueryCheck(dist) {
    console.log(dist);
    console.log($('#count').text());
    Order.order = new Order(`${dist}`, $('#count').text());
}

function apiQuery(){
    
}