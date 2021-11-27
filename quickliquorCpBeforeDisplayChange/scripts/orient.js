function Orientation(id) {
    this.id = id;
};

Orientation.ScreenOrientation = new Orientation(getOrientation());

function getOrientation() {
    var o = screen.orientation.type;
    var orien = o.replace('-primary','');
    if(orien === 'portrait') {
        return 0;
    } else {
        return 1;
    }
};
//window.onload = getOrientation();

$(window).on("orientationchange load", function(event){
    //$('.col-sm-12').html('<h2>Contact</h2>');
    /*if(Orientation.ScreenOrientation.id < 1) {
        $('#rowDiv').removeClass('row');
    } else {
        if(!($('#rowDiv').hasClass('row'))) {
            $('#rowDiv').addClass('row');
        }
    }*/
    var names = ['portrait', 'landscape'];
    //Orientation.prototype.newOrientation = new Orientation(getOrientation());
    Orientation.ScreenOrientation = new Orientation(getOrientation());
    $( "#orientation" ).text(`${names[Orientation.ScreenOrientation.id]}:
        ${Orientation.ScreenOrientation.id} mode | 
        Width: ${document.body.clientWidth} px | 
        Height: ${document.body.clientHeight} px` 
        );
});