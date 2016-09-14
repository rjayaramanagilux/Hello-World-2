/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 May 2015     Rey Jayaraman 
 *
 */

var SANDBOX_SUITELET_URL = 'https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=426&deploy=1';

var PROD_SUITELET_URL = 'https://system.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=169&deploy=1';


var BETA_SUITELET_URL = 'https://system.beta.netsuite.com/app/site/hosting/scriptlet.nl?script=169&deploy=1';


var varLib = new setup();

var regularfields = [];
var deleteregularfields = [];


//Global Variables Pulled from the library
var variables = [];
var columns = [];
var columnMappingFields = [];

var editor;
var recordfields = {
	'custpage_tasktype': 'custevent_study_task_task_type',
	'custpage_id': 'custevent_sort_order',
	'custpage_batchid': 'custevent_study_task_batch_id',
	'custpage_passfail': 'custevent_pass_fail',
	'custpage_reason': 'custevent_study_task_reason',
	'custpage_otherreason': 'custevent_other_reason_description',
	'custpage_quantity': 'custevent_itemquantity',
	'custpage_dtperformed': 'custevent_study_task_performed_date',
	'custpage_nonbillable': 'custevent_study_task_nonbillable',
	'custpage_compound': 'custevent_study_task_compound',
	'custpage_linemgrapproved': 'custevent_study_task_line_mgr_approved',
	'custpage_species': 'custevent_species',
	'custpage_matrix': 'custevent_sample_name',
	'custpage_comments': 'custevent_comments',
	'custpage_purpose': 'custevent_purpose',
	'custpage_revrecdate': 'custevent_study_task_rev_rec_date',
	'custpage_itemname': 'custevent_itemname',
	'custpage_internalid': 'internalid'
};





function AddStyle(cssLink, pos) {
	var tag = document.getElementsByTagName(pos)[0];
	var addLink = document.createElement('link');
	addLink.setAttribute('type', 'text/css');
	addLink.setAttribute('rel', 'stylesheet');
	addLink.setAttribute('href', cssLink);
	tag.appendChild(addLink);
}

function lineInit(type) {

	//ADDJAVASCRIPT through library

	AddStyle('https://cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css', 'head'); //datatable.min
	AddStyle('https://system.na1.netsuite.com/core/media/media.nl?id=347834&c=3921476&h=bf1714e9d593252ee235&_xt=.css', 'head'); //Editor
	AddStyle('https://cdn.datatables.net/buttons/1.2.1/css/buttons.dataTables.min.css', 'head');
	AddStyle('https://system.na1.netsuite.com/core/media/media.nl?id=347833&c=3921476&h=e8afa5e7d292145cdd76&_xt=.css', 'head'); //select.datatable.min.css
	AddStyle('https://editor.datatables.net/extensions/Editor/css/editor.dataTables.min.css', 'head');

	if (nlapiGetContext().getEnvironment() == 'SANDBOX') {
		AddStyle('https://system.sandbox.netsuite.com/core/media/media.nl?id=175177&c=3921476&h=dc8101a772fcad65a50c&_xt=.css', 'head'); //popup.css
	} else {
		AddStyle('https://system.na1.netsuite.com/core/media/media.nl?id=175177&c=3921476&h=dc8101a772fcad65a50c&_xt=.css', 'head'); //SuiteScripts : Study Terms ->popup.css
	}



	var itemCount = nlapiGetLineItemCount('custpage_tasksublist');
	for (var i = 1; i <= itemCount; i++) {
		if (nlapiGetLineItemValue('custpage_tasksublist', 'custpage_linemgrapproved', i) == 'T' || nlapiGetLineItemValue('custpage_tasksublist', 'custpage_invoiced', i) == 'T') {

			for (var ij = 0; ij < variables.length; ij++) {
				//nlapiLogExecution('debug', variables[ij].id ,variables[ij].label );
				if (variables[ij].id != null) {
					if (variables[ij].id != 'custpage_linemgrapproved') {
						nlapiSetLineItemDisabled('custpage_tasksublist', variables[ij].id, true, i);
					}
				}
			}


		}



	}



	if (nlapiGetFieldValue('custpage_view') == 'update') {
		jQuery("input[name$='submitter']").val("Update StudyTask(s)");
		jQuery("#tbl_submitter").show();
		jQuery("#tbl_secondarysubmitter").show();
		jQuery("#tbl_custpage_addbutton").hide();
		jQuery("#tbl_custpage_deletebutton").hide();
		jQuery("#tbl_secondarycustpage_addbutton").hide();
		jQuery("#tbl_secondarycustpage_deletebutton").hide();

		if (NS.form.isInited() && NS.form.isValid()) {
			ShowTab("custpage_updatetask", true);
		}


	} else if (nlapiGetFieldValue('custpage_view') == 'add') {
		if (NS.form.isInited() && NS.form.isValid()) {
			ShowTab("custpage_addtasks", true);
		}
		jQuery("#tbl_submitter").hide();
		jQuery("#tbl_secondarysubmitter").hide();
		jQuery("#tbl_custpage_addbutton").show();
		jQuery("#tbl_custpage_deletebutton").hide();
		jQuery("#tbl_secondarycustpage_addbutton").show();
		jQuery("#tbl_secondarycustpage_deletebutton").hide();


	} else if (nlapiGetFieldValue('custpage_view') == 'delete') {
		if (NS.form.isInited() && NS.form.isValid()) {
			ShowTab("custpage_deletetasks", true);
		}
		jQuery("#tbl_submitter").hide();
		jQuery("#tbl_secondarysubmitter").hide();
		jQuery("#tbl_custpage_addbutton").hide();
		jQuery("#tbl_custpage_deletebutton").show();
		jQuery("#tbl_secondarycustpage_addbutton").hide();
		jQuery("#tbl_secondarycustpage_deletebutton").show();

	}

}

function buttonPress_updateallcompound(recID) {
	var regularfields = nlapiGetFieldValue('custpage_regularfields');
	if (regularfields != '') {
		jQuery.ajax({
			type: "get",
			dataType: "json",
			contentType: "application/json",
			url: '/app/site/hosting/restlet.nl?script=customscript_agx_rest_updatestudytask&deploy=1',
			data: JSON.stringify(encodeURIComponent(regularfields)),
			success: function (data) {
				console.log(data);
			}
		});
	}

	var w = 626;
	var h = 536;
	//var left = (window.screen.width/4)-(w/4);
	//var top = (window.screen.height/2)-(h/2);
	if (nlapiGetContext().getEnvironment() == 'SANDBOX') {
		var url = 'https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_agx_ssu_updateasscompoundal&deploy=1&recID=' + recID;
	} else if (nlapiGetContext().getEnvironment() == 'BETA') {
		var url = 'https://system.beta.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_agx_ssu_updateasscompoundal&deploy=1&recID=' + recID;
	} else {
		var url = 'https://system.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_agx_ssu_updateasscompoundal&deploy=1&recID=' + recID;

	}
	var win = window.open(url, '_blank', 'width=526,height=436');
	win.moveTo(800, 200);
}



function buttonPress_close(recID) {

	if (window.opener && !window.opener.closed) {
		self.close();
		window.opener.location.href = window.opener.location.href;
	} else {

		if (nlapiGetContext().getEnvironment() == 'SANDBOX') {
			var url = 'https://system.sandbox.netsuite.com/app/accounting/project/project.nl?id=' + recID;
		} else if (nlapiGetContext().getEnvironment() == 'BETA') {
			var url = 'https://system.beta.netsuite.com/app/accounting/project/project.nl?id=' + recID;
		} else {
			var url = 'https://system.na1.netsuite.com/app/accounting/project/project.nl?id=' + recID;

		}

		window.open(url, '_self');
	}
}


function buttonPress_updatecompound(recID) {
	if (nlapiLookupField('projecttask', recID, 'custevent_study_task_line_mgr_approved') == 'T') {
		alert('Record is locked');

	} else {
		var regularfields = nlapiGetFieldValue('custpage_regularfields');

		jQuery("#body").css("background-image", "url('https://system.na1.netsuite.com/core/media/media.nl?id=199610&c=3921476&h=3dfabf4c3cf8d73a89be')");
		jQuery("#body").css("background-repeat", "no-repeat");
		jQuery("#body").css('background-position-x', '800px');
		jQuery("#body").css('background-position-y', '17px');

		jQuery.ajax({
			type: "get",
			dataType: "json",
			contentType: "application/json",
			url: '/app/site/hosting/restlet.nl?script=customscript_agx_rest_updatestudytask&deploy=1',
			data: JSON.stringify(encodeURIComponent(regularfields)),
			success: function (data) {
				console.log(data);
				var w = 626;
				var h = 536;
				//var left = (window.screen.width/4)-(w/4);
				//var top = (window.screen.height/2)-(h/2);
				if (nlapiGetContext().getEnvironment() == 'SANDBOX') {
					var url = 'https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=183&deploy=1&recID=' + recID;
				} else if (nlapiGetContext().getEnvironment() == 'BETA') {
					var url = 'https://system.beta.netsuite.com/app/site/hosting/scriptlet.nl?script=183&deploy=1&recID=' + recID;
				} else {
					var url = 'https://system.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=183&deploy=1&recID=' + recID;

				}
				var win = window.open(url, '_blank', 'width=526,height=436');
				win.moveTo(800, 200);
			}
		});



		//refreshSublist();
	}
}





function buttonPress_addRecordsublist(recid) {

	if (recid != undefined && recid != '' && recid != null) {
		try {

			var itemCount = nlapiGetLineItemCount('custpage_taskadd');
			var count = 0;
			var tasktypefields = [];
			var fields = [];
			fields = JSON.parse(nlapiGetFieldValue("custpage_addregularfields"));
			//Converting to JSON format

			for (var j = 0; j < fields.length; j++) {
				tasktypefields.push({
					tasktype: fields[j]
				});
				//alert(fields[j]);	
			} //End of For addregularfields


			nlapiSetFieldValue("custpage_view", "update");
			var url = nlapiResolveURL("SUITELET", "customscript_agx_ssu_addstudytaskrecords", "1");
			url += '&recid=' + recid + '&custscript_tasktypeids=' + JSON.stringify(tasktypefields);

			nlapiRequestURL(url, null, null, handleResponse);
		} catch (err) {
			alert(err.message);
			nlapiLogExecution('DEBUG', 'err', err.message);
		}

	}
	//
}


function buttonPress_copyStudyTask(recid, tasktypeid) {

	if (tasktypeid != undefined && tasktypeid != '' && tasktypeid != null && recid != undefined && recid != '' && recid != null) {
		try {

			jQuery("#body").css("background-image", "url('https://system.na1.netsuite.com/core/media/media.nl?id=199610&c=3921476&h=3dfabf4c3cf8d73a89be')");
			jQuery("#body").css("background-repeat", "no-repeat");
			jQuery("#body").css('background-position-x', '800px');
			jQuery("#body").css('background-position-y', '17px');


			var itemCount = nlapiGetLineItemCount('custpage_taskadd');
			var count = 0;
			var tasktypefields = [];
			tasktypefields.push({
				tasktype: tasktypeid
			});

			var url = nlapiResolveURL("SUITELET", "customscript_agx_ssu_addstudytaskrecords", "1");
			url += '&recid=' + recid + '&custscript_tasktypeids=' + JSON.stringify(tasktypefields);

			nlapiRequestURL(url, null, null, handleResponse);




		} catch (err) {
			alert(err.message);
			nlapiLogExecution('DEBUG', 'err', err.message);
		}

	}
	//
}


function buttonPress_deleteRecordsublist(recid) {

	if (recid != undefined && recid != '' && recid != null) {

		try {

			var msg = confirm("Are you sure you want to delete the record(s)?");
			if (msg == true) {
				var itemCount = nlapiGetLineItemCount('custpage_taskdelete');
				var count = 0;
				for (var i = 1; i <= itemCount; i++) {
					if (nlapiGetLineItemValue('custpage_taskdelete', 'custpage_updatecheckbox_line', i) == 'T') {
						if (nlapiGetLineItemValue('custpage_taskdelete', 'custpage_task_type_linemanager_line', i) == 'T') {
							alert('Cannot Delete this Record,' + nlapiGetLineItemValue('custpage_taskdelete', 'custpage_tasktype_line', i) + '  Record is locked');
						} else {
							nlapiDeleteRecord('projecttask', nlapiGetLineItemValue('custpage_taskdelete', 'custpage_internalid_line', i));
						}
					}

				} //End of For Line count

				nlapiSetFieldValue("custpage_view", "update");

				refreshSublist();

			} else {
				alert("Record(s) not deleted!");
			}

		} catch (err) {
			alert(err.message);
			nlapiLogExecution('DEBUG', 'err', err.message);
		}
	}
}


function handleResponse(response) {
	refreshSublist();
	//window.location.href= document.URL;
	//	jQuery("#body").removeAttr("background-image");
	//	jQuery("#body").removeAttr("background-repeat");
	//	jQuery("#body").removeAttr("background-position");

	//	jQuery("body").css("background-image","");
	//	jQuery("body").css("background-repeat","");
	//	jQuery("body").css("background-position"," ");
}


var filterFields = ['custpage_temp_recid', 'custpage_temp_rectype', 'custpage_quotefield', 'custpage_view', 'custpage_species_rga_sda'];

function refreshSublist() {

	var url;
	var bool = false;
	if (nlapiGetContext().getEnvironment() == 'SANDBOX') {
		url = 'https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_agx_ssu_editstudytask_revis&deploy=1';
	} else if (nlapiGetContext().getEnvironment() == 'BETA') {
		url = 'https://system.beta.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_agx_ssu_editstudytask_revis&deploy=1';
	} else {
		url = 'https://system.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_agx_ssu_editstudytask_revis&deploy=1';
	}

	for (var j = 0; j < filterFields.length; j++) {
		var fieldValue = nlapiGetFieldValue(filterFields[j]);
		if (filterFields[j] == 'custpage_temp_recid') {
			url += '&recid=' + fieldValue;
			bool = true;

		} else if (filterFields[j] == 'custpage_temp_rectype') {
			url += '&rectype=' + fieldValue;
			bool = true;
		} else if (fieldValue != '' && fieldValue != null) {
			url += '&' + filterFields[j] + '=' + fieldValue;
			bool = true;
		}

	}

	if (bool == true) {
		window.open(url, '_self', 'true');

	} else {
		alert("Please enter the criteria to search!");
	}

}

function clearAll() {

	var url;

	if (nlapiGetContext().getEnvironment() == 'SANDBOX') {
		url = 'https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_agx_ssu_editstudytask_revis&deploy=1';
	} else if (nlapiGetContext().getEnvironment() == 'BETA') {
		url = 'https://system.beta.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_agx_ssu_editstudytask_revis&deploy=1';
	} else {
		url = 'https://system.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=customscript_agx_ssu_editstudytask_revis&deploy=1';
	}

	var recId = nlapiGetFieldValue('custpage_temp_recid');
	var recType = nlapiGetFieldValue('custpage_temp_rectype');

	if (recId != null && recId != '') {
		url += '&recid=' + recId;
	}
	if (recType != null && recType != '') {
		url += '&rectype=' + recType;
	}

	var fieldValue = nlapiGetFieldValue('custpage_view');

	if (fieldValue != '' && fieldValue != null) {
		url += '&custpage_view' + '=' + fieldValue;

	}
	window.location.href = url;
	//window.open(url), '_self';
}

/**
 * 
 * @param type
 * @param name
 * @param linenum
 */
function fieldChanged_RefreshStudyTaskSublist(type, name, linenum) {
	var str = '';

	if (type == 'custpage_tasksublist') {
		var lineCount = nlapiGetLineItemCount('custpage_tasksublist');
		if (lineCount != '' && lineCount != null) {
			nlapiSetLineItemValue('custpage_tasksublist', 'custpage_updatecheckbox_line', linenum, 'T');
			if (nlapiGetFieldValue('custpage_regularfields') != null) {

				regularfields.push({
					fieldname: columnMappingFields[name],
					value: nlapiGetLineItemValue(type, name, linenum),
					id: nlapiGetLineItemValue(type, 'custpage_internalid', linenum)
				});
				nlapiSetFieldValue('custpage_regularfields', JSON.stringify(regularfields));
				//alert(JSON.stringify(regularfields));
			}


		}


	}

	if (name == 'custpage_pf') {
		if (nlapiGetLineItemValue('custpage_tasksublist', 'custpage_pf', linenum) == 2) {
			nlapiSetLineItemDisabled('custpage_tasksublist', 'custpage_freason', false, linenum);
		} else {
			nlapiSetLineItemValue('custpage_tasksublist', 'custpage_freason', linenum, '');
			nlapiSetLineItemValue('custpage_tasksublist', 'custpage_other', linenum, '');
			nlapiSetLineItemDisabled('custpage_tasksublist', 'custpage_freason', true, linenum);
			nlapiSetLineItemDisabled('custpage_tasksublist', 'custpage_other', true, linenum);

		}

	}
	if (name == 'custpage_freason') {
		if (nlapiGetLineItemValue('custpage_tasksublist', 'custpage_freason', linenum) == 7) {
			nlapiSetLineItemDisabled('custpage_tasksublist', 'custpage_other', false, linenum);
		} else {
			nlapiSetLineItemValue('custpage_tasksublist', 'custpage_other', linenum, '');
			nlapiSetLineItemDisabled('custpage_tasksublist', 'custpage_other', true, linenum);
		}
	}


	if (name == 'custpage_plasma_quantity' || name == 'custpage_urine_quantity' || name == 'custpage_df_quantity' || name == 'custpage_tissue_quantity' ||
		name == 'custpage_other_quantity') {

		var quantity = getValue(nlapiGetLineItemValue('custpage_tasksublist', 'custpage_plasma_quantity', linenum)) + getValue(nlapiGetLineItemValue('custpage_tasksublist', 'custpage_urine_quantity', linenum)) +
			getValue(nlapiGetLineItemValue('custpage_tasksublist', 'custpage_df_quantity', linenum)) + getValue(nlapiGetLineItemValue('custpage_tasksublist', 'custpage_tissue_quantity', linenum)) + getValue(nlapiGetLineItemValue('custpage_tasksublist', 'custpage_other_quantity', linenum));

		if (quantity != null && quantity != '' && quantity != undefined) {
			nlapiSetLineItemValue('custpage_tasksublist', 'custpage_quantity', linenum, quantity);

		}







	}







}





function getValue(qty) {
	if (qty != '' && qty != null && qty != undefined) {

		return parseFloat(qty);
	} else {
		return 0;
	}

}



/**
 * 
 * @param name
 */
function refreshStudyTaskSublist(name) {
	var currentUrl = document.URL;
	// Refresh window with updated sublist
	var fieldValue = nlapiGetFieldValue(name);
	if (fieldValue != '' && fieldValue != null) {
		// Check if it's already in the url
		var param = getParameterFromUrl(name);
		if (param == null) {
			window.open(currentUrl + '&' + name + '=' + fieldValue, '_self');
		} else {
			var updatedUrl = currentUrl.replace(name + '=' + param, name + '=' + fieldValue);
			window.open(updatedUrl, '_self');
		}
	}
}

/**
 * Function is used to get the value of the get parameter
 * @param val
 * @returns {String}
 */
function getParameterFromUrl(val) {
	var result = null,
		tmp = [];
	location.search.substr(1).split("&").forEach(function (item) {
		tmp = item.split("=");
		if (tmp[0] === val)
			result = decodeURIComponent(tmp[1]);
	});
	return result;
}


jQuery("#tbl_custpage_addbutton").click(function () {
	//  alert( "Handler for .click() called." );
	jQuery("#body").css("background-image", "url('https://system.na1.netsuite.com/core/media/media.nl?id=199610&c=3921476&h=3dfabf4c3cf8d73a89be')");
	jQuery("#body").css("background-repeat", "no-repeat");
	jQuery("#body").css('background-position-x', '800px');
	jQuery("#body").css('background-position-y', '17px');
});


jQuery("#custpage_deletebutton").click(function () {
	//  alert( "Handler for .click() called." );
	jQuery("#body").css("background-image", "url('https://system.na1.netsuite.com/core/media/media.nl?id=199610&c=3921476&h=3dfabf4c3cf8d73a89be')");
	jQuery("#body").css("background-repeat", "no-repeat");
	jQuery("#body").css('background-position-x', '800px');
	jQuery("#body").css('background-position-y', '17px');
});


function AddJavascript(pos) {
	var tag = document.getElementsByTagName(pos)[0];
	var addScript = document.createElement('script');
	addScript.setAttribute('type', 'text/javascript');
	addScript.innerHTML = "window.onbeforeunload = function() {}";
	tag.appendChild(addScript);
}

jQuery(document).ready(function () {


	AddJavascript('body');

	var tasktypejsonRowData = [];
	var addregularfields = [];
	var addregularJSONfields = [];
	//var param=getParameterFromUrl('recid');



	//var strhtml= jQuery("#body").html();
	//var strstyle=  ' background-image: url("https://system.na1.netsuite.com/core/media/media.nl?id=199610&c=3921476&h=3dfabf4c3cf8d73a89be");' 
	//" background-repeat:no-repeat; background-position: 49% 2%;"
	//strhtml += "<div id='new' style='" + strstyle + "'/>";
	//jQuery("#body").html(strhtml);
	//jQuery("#body").addClass("loading");




	var service;
	var recid = getParameterFromUrl('recid');
	var rectype = getParameterFromUrl('rectype');
	service = nlapiLookupField(rectype, recid, 'custentity_study_service_line');

	if (service != null) {

		switch (parseInt(service)) {
			case 2:
				variables = varLib.setGLPVariables;
				columns = varLib.getGLPColumns;
				columnMappingFields = varLib.reverseMappingGLPFields;
				break;

			case 5:
				variables = varLib.setGLPVariables;
				columns = varLib.getGLPColumns;
				columnMappingFields = varLib.reverseMappingGLPFields;
				break;
			case 13:
				variables = varLib.setGLPVariables;
				columns = varLib.getGLPColumns;
				columnMappingFields = varLib.reverseMappingGLPFields;

				break;

			case 1:
				variables = varLib.setDiscoveryVariables;
				columns = varLib.getDiscoveryColumns;
				columnMappingFields = varLib.reverseMappingDiscoveryFields;
				break;
			default:
				variables = varLib.setInvivoVariables;
				columns = varLib.getInvivoColumns;
				columnMappingFields = varLib.reverseMappingInvivoFields;

		}

	} else {
		variables = varLib.setInvivoVariables;
		columns = varLib.getInvivoColumns;
		columnMappingFields = varLib.reverseMappingInvivoFields;

	}




	var arrClick = ['custpage_updatetask', 'custpage_deletetasks', 'custpage_addtasks'];


	for (var ij = 0; ij < arrClick.length; ij++) {

		jQuery('#' + arrClick[ij] + 'txt').click(function () {
			var id = jQuery(this).attr('id');
			var arrValue = {
				'custpage_updatetasktxt': 'update',
				'custpage_deletetaskstxt': 'delete',
				'custpage_addtaskstxt': 'add'
			};
			if (arrValue[id] == 'update') {
				jQuery("input[name$='submitter']").val("Update StudyTask(s)");
				jQuery("#tbl_submitter").show();
				jQuery("#tbl_secondarysubmitter").show();
				jQuery("#tbl_custpage_addbutton").hide();
				jQuery("#tbl_custpage_deletebutton").hide();
				jQuery("#tbl_secondarycustpage_addbutton").hide();
				jQuery("#tbl_secondarycustpage_deletebutton").hide();
				nlapiSetFieldValue('custpage_view', arrValue[id]);


			} else if (arrValue[id] == 'add') {
				jQuery("#tbl_submitter").hide();
				jQuery("#tbl_secondarysubmitter").hide();
				jQuery("#tbl_custpage_addbutton").show();
				jQuery("#tbl_custpage_deletebutton").hide();
				jQuery("#tbl_secondarycustpage_addbutton").show();
				jQuery("#tbl_secondarycustpage_deletebutton").hide();

				nlapiSetFieldValue('custpage_view', arrValue[id]);

			} else if (arrValue[id] == 'delete') {
				//jQuery("input[name$='submitter']").val("Delete StudyTask(s)");
				nlapiSetFieldValue('custpage_view', arrValue[id]);
				jQuery("#tbl_submitter").hide();
				jQuery("#tbl_secondarysubmitter").hide();
				jQuery("#tbl_custpage_addbutton").hide();
				jQuery("#tbl_custpage_deletebutton").show();
				jQuery("#tbl_secondarycustpage_addbutton").hide();
				jQuery("#tbl_secondarycustpage_deletebutton").show();

			} else {
				jQuery("input[name$='submitter']").val("Close");
				nlapiSetFieldValue('custpage_view', arrValue[id]);
			}

		});
	}



	jQuery('#tr_custpage_addbutton').addClass('pgBntB');
	jQuery('#tr_custpage_deletebutton').addClass('pgBntB');
	jQuery('#tr_secondarycustpage_addbutton').addClass('pgBntB');
	jQuery('#tr_secondarycustpage_deletebutton').addClass('pgBntB');

	jQuery("#tbl_custpage_addbutton").hide();
	jQuery("#tbl_custpage_deletebutton").hide();

	jQuery("#tbl_secondarycustpage_addbutton").hide();
	jQuery("#tbl_secondarycustpage_deletebutton").hide();


	//jQuery('#tbl_custpage_button1 tr:contains("tr_custpage_button1")').addClass('pgBntG');
	var _agx_rest_gettasktype = '/app/site/hosting/restlet.nl?script=customscript_agx_rest_gettasktype&deploy=1&data=' + recid;

	var fields = [];
	var bool = false;
	for (var j = 0; j < filterFields.length; j++) {
		var fieldValue = nlapiGetFieldValue(filterFields[j]);
		if (fieldValue != '' && fieldValue != null && filterFields[j] != 'custpage_view') {
			bool = true;
			fields.push({
				field: filterFields[j],
				value: fieldValue
			});
		}

	}

	var extrafield;

	_agx_rest_gettasktype += '&filtervalue=' + JSON.stringify(fields);



	var tasktypecolumnfields = ['select',
		                          'internalid',
		                  'name',
		                  'custrecord_sort_order',
		                  'pricebookitem',
		                  'masterstudy',
		                  'custrecord_task_type_service_line'
		                  		];

	var tasktypemappingfields = {
		'select': 'select',
		'internalid': 'ID',
		'name': 'Task Type',
		'masterstudy': 'Exists Under Quote',
		'custrecord_sort_order': 'Sort Order',
		'pricebookitem': 'PRICEBOOKITEM',
		'custrecord_task_type_service_line': 'Service Line'


	};


	for (var jk = 0; jk < tasktypecolumnfields.length; jk++) {
		var columnName = tasktypecolumnfields[jk];

		tasktypejsonRowData.push({
			"mDataProp": columnName,
			"title": tasktypemappingfields[columnName],
			"width": "10%"
		});




	} //for j=0

	//Custpage_taskadd
	//		   editor = new $.fn.dataTable.Editor( {
	//			   ajax: {
	//		                 type: 'Get',
	//		                url:  '/app/site/hosting/restlet.nl?script=424&deploy=1'
	//		            },
	//		        edit: function ( method,url, data, success, error ) {
	//			        jQuery.ajax( {
	//			            url:   '/app/site/hosting/restlet.nl?script=424&deploy=1',
	//			            dataType:'json',
	//			            data:data,
	//			            success: function (json) {
	//			            success(json);
	//			            },
	//			            error: function (xhr, error, thrown) {
	//			               alert(error);
	//			             
	//			            }
	//			          
	//			        } );  
	//			    
	//			 },
	//		        table: "#custpage_taskadd_splits",
	//		        fields: [ {
	//		                label: "ID:",
	//		                name: "custrecord_sort_order"
	//		            }, {
	//		                label: "internalid:",
	//		                name: "internalid"
	//		            }, {
	//		                label: "TaskType:",
	//		                name: "name"
	//		            }, {
	//		                label: "NoofTimes:",
	//		                name: "nooftimes"
	//		            }, {
	//		                label: "PartNo:",
	//		                name: "pricebookitem"
	//		            }, {
	//		                label: "Quote Exists:",
	//		                name: "masterstudy",
	//		                
	//		            }, {
	//		                label: "ServiceLine:",
	//		                name: "custrecord_task_type_service_line"
	//		            }
	//		        ]
	//		    } );
	//		   
	//		   jQuery('#custpage_taskadd_splits').on( 'click', 'tbody td:not(:first-child)', function (e) {
	//		        editor.bubble( this );
	//		    } );
	//		 
	var boolIsChrome = false;
	boolIsChrome = isChrome();

	oTable4 = jQuery('#custpage_taskadd_splits').DataTable({
		"iDisplayLength": 100,

		dom: 'Bfrtip',
		ajax: {
			url: _agx_rest_gettasktype

		},

		columns: [
			{
				data: null,
				defaultContent: '',
				className: 'select-checkbox',
				orderable: false
		                  },
			{
				data: "custrecord_sort_order",
				"title": "Order"
			},
			{
				data: "internalid",
				"title": "InternalID"
			},
			{
				data: "name",
				"title": "TaskTYPE"
			},
			{
				data: "nooftimes",
				"title": "#Times"
					//		                	  ,
					//		                	  "render": function(data, type, full) {
					//	                           	     return '<input type="text" name="'+full.name +'" value='+ data +'>';
					//	                           	      
					//	                              }
		                  },
			{
				data: "pricebookitem",
				"title": "PARTNO",
				"render": function (data, type, full) {
					if (boolIsChrome) {
						if (data.includes("*")) {
							return '<span data-toggle="tooltip" title= "* - ' + full.name + " (contains multiple partnumbers)" + '" >' + data + '</span>';
						} else {
							return '<span data-toggle="tooltip" title="' + full.name + "( PriceBookItem: " + data + ')">' + data + '</span>';
						}
					}
					else{
						return data;
					}


				}
		                  },
			{
				data: "masterstudy",
				"title": "Exists under Quote",
				"width": '1',
				"render": function (data, type, full) {
					if (boolIsChrome) {
						if (data == "*") {
							return '<span data-toggle="tooltip" title= "* - ' + full.name + " (exists under Quote)" + '" >' + data + '</span>';
						} else {
							return '';
						}
					}
					else{return data;}
				}
		                  },
			{
				data: 'custrecord_task_type_service_line',
				"title": "ServiceLine"
			}


		              ],
		order: [1, 'asc'],
		select: {
			style: 'os',
			selector: 'td:first-child'
		},
		buttons: [
			{
				text: 'Select all',
				action: function () {
					addregularfields = [];
					oTable4.rows().select();
				}
		            },
			{
				text: 'Select none',
				action: function () {
					addregularfields = [];
					oTable4.rows().deselect();

				}
		            }
		        ]

	});



	$('#custpage_taskadd_splits').on('draw.dt', function () {
		$('[data-toggle="tooltip"]').tooltip();
	});

	oTable4
		.on('select', function (e, dt, type, indexes) {
			var rowData = oTable4.rows(indexes).data().toArray();

			for (var ji = 0; ji < rowData.length; ji++) {
				addregularfields.push(rowData[ji].internalid);

			}



			if (addregularfields.length > 0) {

				var unique = addregularfields.filter(function (itm, i, addregularfields) {
					console.log(i);
					console.log(itm);
					return i == addregularfields.indexOf(itm);
				});

				addregularfields = unique;

				nlapiSetFieldValue("custpage_addregularfields", JSON.stringify(unique));


			} else {

				nlapiSetFieldValue("custpage_addregularfields", "");


			}

			//	            for(var kl=0;kl<addregularfields.length;kl++){
			//
			//	            	console.log(oTable4
			//		            .columns( 2 )
			//		            .search( addregularfields ).data());
			//	            	
			//		            	
			//	            }

		})
		.on('deselect', function (e, dt, type, indexes) {
			var rowData = oTable4.rows(indexes).data().toArray();


			for (var jk = 0; jk < rowData.length; jk++) {
				for (var im = 0; im < addregularfields.length; im++) {
					if (addregularfields[im] == rowData[jk].internalid) {
						console.log("removing:" + rowData[jk].internalid);
						addregularfields.splice(im, 1);

					}
				}
			}
			if (addregularfields.length > 0) {

				var unique = addregularfields.filter(function (itm, i, addregularfields) {
					console.log(i);
					console.log(addregularfields.indexOf(itm));
					return i == addregularfields.indexOf(itm);
				});

				addregularfields = unique;
				nlapiSetFieldValue("custpage_addregularfields", JSON.stringify(unique));

			} else {

				nlapiSetFieldValue("custpage_addregularfields", "");

			}

		});


	var jsonRowData = [];

	for (var jk = 0; jk < variables.length; jk++) {

		jsonRowData.push({
			"name": variables[jk].id,
			"label": variables[jk].label
		});


	} //for j=0



});

function isChrome() {
	// please note, 
	// that IE11 now returns undefined again for window.chrome
	// and new Opera 30 outputs true for window.chrome
	// and new IE Edge outputs to true now for window.chrome
	// and if not iOS Chrome check
	// so use the below updated condition
	var isChromium = window.chrome,
		winNav = window.navigator,
		vendorName = winNav.vendor,
		isOpera = winNav.userAgent.indexOf("OPR") > -1,
		isIEedge = winNav.userAgent.indexOf("Edge") > -1,
		isIOSChrome = winNav.userAgent.match("CriOS");

	if (isIOSChrome) {
		// is Google Chrome on IOS
		return false;
	} else if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
		// is Google Chrome
		return true;
	} else {
		// not Google Chrome 
		return false;

	}
	return false;
}

function success(json) {

}
//function refreshdata(){
//	var addregularfields=
//	for (i=0;i<nlapiGet)
//}
function error(xhr, error, thrown) {
	alert(error.message);
}
//REST TABLE