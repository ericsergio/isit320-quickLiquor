function doFilters(typeName) {
    if($('#filterList').children().length > 0) {
        $('#filterList').remove();
    }
   $('.results').before(' \
   <ul id = "filterList"> \
       <li id = "searchFilter"> \
           <input type = "text" id = "nameFilter_Input" placeholder = "SEARCH"> \
           </input> \
       </li> \
       <li id = "distFilter"> \
           <select id = "distFilter_Select"> \
               <option value = "empty"> \
                   Distributors \
               </option> \
               <option value = "Southern"> \
                   Southern \
               </option> \
               <option value = "Columbia"> \
                   Columbia \
               </option> \
               <option value = "Crown"> \
                   Crown \
               </option> \
               <option value = "Youngs"> \
                   Youngs \
               </option> \
           </select> \
       </li> \
       <li id = "typeFilter"> \
           <select id = "typeFilter_Select"> \
               <option value = "empty"> \
                   Types \
               </option> \
               <option value = "Liquor"> \
                   Liquor \
               </option> \
               <option value = "Wine"> \
                   Wine \
               </option> \
               <option value = "Bottle Beer"> \
                   Bottle Beer \
               </option> \
               <option value = "Keg Beer"> \
                   Keg Beer \
               </option> \
               <option value = "NA"> \
                   Non-Alcoholic \
               </option> \
           </select> \
       </li> \
       <li id = "orderTypeFilter"> \
           <select id = "orderTypeFilter_Select"> \
               <option value = "empty"> \
                   Order Unit \
               </option> \
               <option value = "Bottle"> \
                   Bottle \
               </option> \
               <option value = "Case"> \
                   Case \
               </option> \
               <option value = "Keg"> \
                   Keg \
               </option> \
           </select> \
       </li> \
   </ul>'
   );
   	/////////
	//Type Filter
	/////////
	$('#typeFilter_Select').on('change', function () {
        var matchId = $(this).val();
		$('#resultTable tbody tr').each(function () {
			$(this).hide();
			if($(this).children(':eq(2)').text() === matchId) {
				$('.tblHead').show();
				$(this).show();
			}
		});
    });
    ////////
	//Dist Filter
	///////
	$('#distFilter_Select').on('change', function () {
		var matchId = $(this).val();
		$('#resultTable tbody tr').each(function () {
			$(this).hide();
			if($(this).children(':eq(1)').text() === matchId) {
				$('.tblHead').show();
				$(this).show();
			}
		});
	});
    ////////
	//OrderType Filter
	///////
	$('#orderTypeFilter_Select').on('change', function () {
		var matchId = $(this).val();
		//var orderTypeMatch = Number(matchId.substring(matchId.length - 1, matchId.length));
		$('#resultTable tbody tr').each(function () {
			$(this).hide();
			if($(this).children(':eq(4)').text() === matchId) {
				$('.tblHead').show();
				$(this).show();
			}
		});
	});
	////////
	//Search Filter
	///////
	$('#nameFilter_Input').on('keyup', function () {
        var textVal = $(this).val();
        var head = $('.resultHead');
		$('#resultTable tr:gt(0)').filter(function () {
            $('.tableHead').toggle();
			$(this).toggle($(this).text().indexOf(textVal) > -1);
		});
	});
};