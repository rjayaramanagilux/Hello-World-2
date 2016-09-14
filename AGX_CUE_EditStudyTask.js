/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 May 2015     Rey Jayaraman 
 *
 */

var SANDBOX_SUITELET_URL = 'https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=169&deploy=1';

var PROD_SUITELET_URL = 'https://system.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=169&deploy=1';

var BETA_SUITELET_URL = 'https://system.beta.netsuite.com/app/site/hosting/scriptlet.nl?script=169&deploy=1';


var regularfields =[];

var recordfields={'custpage_batchid_line':'custevent_study_task_batch_id','custpage_purpose_line':'custevent_purpose','custpage_billable_quantity_line':'custevent_itemquantity',
		'custpage_dateperformed_line':'custevent_study_task_performed_date','custpage_task_type_linemanager_line':'custevent_study_task_line_mgr_approved',
		'custpage_pf_line':'custevent_pass_fail','custpage_freason_line':'custevent_study_task_reason','custpage_other_line':'custevent_other_reason_description','custpage_task_type_nonbillable_line':'custevent_study_task_nonbillable',
		'custpage_notes_line':'custevent_comments','custpage_tasktype_line':'custevent_study_task_task_type','custpage_dateplanned_line':'custevent_planned_date',
		'custpage_id_line':'custevent_sort_order','custpage_plasma_quantity_line':'custevent_plasma_quantity','custpage_urine_quantity_line':'custevent_urine_quantity',
		'custpage_df_quantity_line':'custevent_df_quantity','custpage_tissue_quantity_line':'custevent_tissue_quantity',
		'custpage_other_quantity_line':'custevent_other_quantity',
		'custpage_matrix_line':'custevent_sample_name','custpage_species_line':'custevent_species', 'custpage_study_task_rev_rec_date_line': 'custevent_study_task_rev_rec_date' };

function resetSublist(){
	if(nlapiGetContext().getEnvironment()=='SANDBOX'){
	window.open(SANDBOX_SUITELET_URL), '_self';
	}
	else if(nlapiGetContext().getEnvironment()=='BETA'){
		window.open(BETA_SUITELET_URL), '_self';
	}
	else{
		window.open(PROD_SUITELET_URL), '_self';
	}
}



	

function lineInit(type){
	
	
	
var itemCount = nlapiGetLineItemCount('custpage_task'); 
			for ( var i = 1; i <= itemCount; i++) 
			{     if(nlapiGetLineItemValue('custpage_task', 'custpage_task_type_linemanager_line', i)=='T'){
		
					nlapiSetLineItemDisabled('custpage_task','custpage_billable_quantity_line',true,i); 
					nlapiSetLineItemDisabled('custpage_task','custpage_dateperformed_line',true,i); 
					nlapiSetLineItemDisabled('custpage_task','custpage_dateplanned_line',true,i); 
					nlapiSetLineItemDisabled('custpage_task','custpage_task_type_nonbillable_line',true,i); 
					nlapiSetLineItemDisabled('custpage_task','custpage_tasktype_line',true,i);
					nlapiSetLineItemDisabled('custpage_task','custpage_notes_line',true,i);
					nlapiSetLineItemDisabled('custpage_task','custpage_id_line',true,i);
					nlapiSetLineItemDisabled('custpage_task','custpage_batchid_line',true,i);
					nlapiSetLineItemDisabled('custpage_task','custpage_pf_line',true,i);
					nlapiSetLineItemDisabled('custpage_task','custpage_freason_line',true,i);
					nlapiSetLineItemDisabled('custpage_task','custpage_other_line',true,i);
					nlapiSetLineItemDisabled('custpage_task','custpage_purpose_line',true,i);
					nlapiSetLineItemDisabled('custpage_task','custpage_study_task_rev_rec_date_line',true,i);
					
				}
				
				
				if(nlapiGetLineItemValue('custpage_task', 'custpage_pf_line', i)==2){
					nlapiSetLineItemDisabled('custpage_task','custpage_freason_line',false,i);					
				     if(nlapiGetLineItemValue('custpage_task', 'custpage_freason_line', i)==7){
					 nlapiSetLineItemDisabled('custpage_task','custpage_other_line',false,i);
					 
					 }
				  }
				  else{
					  nlapiSetLineItemDisabled('custpage_task','custpage_freason_line',true,i);	
					   nlapiSetLineItemDisabled('custpage_task','custpage_other_line',true,i);
					  
				  }
				  
				
				
			}		  
	 
	
 

}

function buttonPress_updatecompound(recID){
	if(nlapiLookupField('projecttask',recID, 'custevent_study_task_line_mgr_approved')=='T'){
		 alert('Record is locked');
		 
	 }
	else{
		var w =626;
		var h = 536;
		//var left = (window.screen.width/4)-(w/4);
		//var top = (window.screen.height/2)-(h/2);
		if(nlapiGetContext().getEnvironment()=='SANDBOX'){
		var url='https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=183&deploy=1&recID=' + recID;
		}
		else if(nlapiGetContext().getEnvironment()=='BETA'){
		var url='https://system.beta.netsuite.com/app/site/hosting/scriptlet.nl?script=183&deploy=1&recID=' + recID;
		}
		else{
			var url='https://system.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=183&deploy=1&recID=' + recID;
				
		}
		var win =window.open(url,'_blank','width=526,height=436');
		win.moveTo(800, 200);
	}
}

function buttonPress_deleteRecord(recID){
	if(nlapiLookupField('projecttask',recID, 'custevent_study_task_line_mgr_approved')=='T'){
		 alert('Record is locked');
		 
	 }
	else{
		var msg= confirm("Are you sure you want to delete this record?");
		if(msg== true){
		
			nlapiDeleteRecord('projecttask',recID);
			window.location.href= document.URL;
		}
		else{
			alert("Record is not deleted!");
		}
	}
}

/*function buttonPress_addRecord(recid){
	
if(recid != undefined && recid !='' && recid != null){
		try{
			
				var tasktype= nlapiGetFieldValue('custpage_newtasktype');
				var title = nlapiGetFieldText('custpage_newtasktype');
				var nooftimes = nlapiGetFieldValue('custpage_newnooftimes');
				if(tasktype != null && tasktype != '' ){
				var url='https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=191&deploy=1&recid=' + recid +'&tasktype=' + tasktype + '&nooftimes=' + nooftimes +'&title='+ title ;
				nlapiRequestURL(url,null,null,handleResponse);
					
				}
		}
			catch(err){
				alert(err);
				nlapiLogExecution('DEBUG', 'err',err);
			}
			
	} 
			//
}*/

function buttonPress_addRecordsublist(recid){
	
	if(recid != undefined && recid !='' && recid != null){
			try{
				var itemCount = nlapiGetLineItemCount('custpage_taskadd'); 
				
				var service =  nlapiLookupField('job',recid,'custentity_study_service_line');
				var matrixid= nlapiLookupField('job',recid,'custentity_matrix');
				var species= nlapiLookupField('job',recid,'custentity_species',true);
				var associatedcompounds = nlapiLookupField('job',recid,'custentity_apply_associated_compounds');
				
				var idfilters = [];
				idfilters.push(new nlobjSearchFilter('company', null, 'is', recid));
				
				var idcolumns=[];
				idcolumns.push(new nlobjSearchColumn('id', null, 'max'));
				idcolumns.push(new nlobjSearchColumn('company', null, 'group'));
				
				var idresults = nlapiSearchRecord('projecttask', null, idfilters, idcolumns);
				
				var count =0;
				for ( var j = 1; j <= itemCount; j++) 
				{  
					var tasktype=nlapiGetLineItemValue('custpage_taskadd', 'custpage_newtasktype', j);
					var title = tasktype
					var nooftimes = nlapiGetLineItemValue('custpage_taskadd', 'custpage_newnooftimes', j);
					
					if(tasktype != null && tasktype != '' ){
						var compoundFieldValue = [];
						//Verify if apply associated compounds checked
						var boolassociatedcompounds=false;
						if(associatedcompounds != null && associatedcompounds !=''){
							if(associatedcompounds =='T'){
								boolassociatedcompounds=true;
								compoundFieldValue=getStudyAssociatedCompounds(recid);
							}
						}
						
						for (var i = 0; i < nooftimes; i++) {
						var studyTask = nlapiCreateRecord('projectTask', {
									recordmode : 'dynamic'
							});
							studyTask.setFieldValue('company', recid);
							studyTask.setFieldValue('custevent_study_task_task_type', tasktype);
							studyTask.setFieldValue('title', title);
							if(boolassociatedcompounds == true){
								studyTask.setFieldValue('custevent_study_task_compound',compoundFieldValue);
							}
						
							if(service != 6 && service !=3 ){
							
							
							if(matrixid != null && matrixid !='' && matrixid != undefined){studyTask.setFieldValue('custevent_sample_name', nlapiLookupField('inventoryitem',matrixid,'itemid'));}
							
							if(species != null && species !='' && species != undefined){studyTask.setFieldValue('custevent_species', species);}
							}
							
							if(idresults != null){
							if( idresults[0].getValue(idcolumns[0]) != null && idresults[0].getValue(idcolumns[0]) !='' && idresults[0].getValue(idcolumns[0]) != undefined ){
								var sortorder=parseInt(idresults[0].getValue(idcolumns[0]))+count+1;
								
								studyTask.setFieldValue('custevent_sort_order',sortorder );
							}
							}
							else{
								var sortorder=count+1;
								studyTask.setFieldValue('custevent_sort_order',sortorder );
							}
							
						var id= nlapiSubmitRecord(studyTask, true, true);	
						count +=1;
						
						}
						}
						
						
				}//End of For Line count
						
					window.location.href=window.location.href;
					
				}
			
			
				catch(err){
					alert(err.message);
					nlapiLogExecution('DEBUG', 'err',err.message);
				}
				
		} 
				//
	}



function buttonPress_addRecordsublist2(recid){
	
	if(recid != undefined && recid !='' && recid != null){
			try{
				
				var itemCount = nlapiGetLineItemCount('custpage_taskadd'); 
				var count =0;
				var tasktypefields=[];
				for ( var j = 1; j <= itemCount; j++) 
				{  
					tasktypefields.push({tasktype:nlapiGetLineItemValue('custpage_taskadd', 'custpage_newtasktype', j),nooftimes:nlapiGetLineItemValue('custpage_taskadd', 'custpage_newnooftimes', j),recid:recid});
				}//End of For Line count
				
				if(nlapiGetContext().getEnvironment()=='SANDBOX'){
					var url='https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=191&deploy=1&custscript_tasktypeids_nooftimes=' +JSON.stringify(tasktypefields) ;
				}
				else if(nlapiGetContext().getEnvironment()=='BETA'){
					var url='https://system.beta.netsuite.com/app/site/hosting/scriptlet.nl?script=191&deploy=1&custscript_tasktypeids_nooftimes=' +JSON.stringify(tasktypefields) ;
				}
				else{
					var url='https://system.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=191&deploy=1&custscript_tasktypeids_nooftimes=' +JSON.stringify(tasktypefields) ;
					
				}	
				nlapiRequestURL(url,null,null,handleResponse);	
				
				//window.location.href=window.location.href;
				}
			
			
				catch(err){
					alert(err.message);
					nlapiLogExecution('DEBUG', 'err',err.message);
				}
				
		} 
				//
	}



function buttonPress_addRecord(recid){
	
if(recid != undefined && recid !='' && recid != null){
		try{
			
				var tasktype= nlapiGetFieldValue('custpage_newtasktype');
				var title = nlapiGetFieldText('custpage_newtasktype');
				var nooftimes = nlapiGetFieldValue('custpage_newnooftimes');
				
				var service =  nlapiLookupField('job',recid,'custentity_study_service_line');
				var matrixid= nlapiLookupField('job',recid,'custentity_matrix');
				var species= nlapiLookupField('job',recid,'custentity_species',true);
				var associatedcompounds = nlapiLookupField('job',recid,'custentity_apply_associated_compounds');
				
				
				var idfilters = [];
				idfilters.push(new nlobjSearchFilter('company', null, 'is', recid));
				
				var idcolumns=[];
				idcolumns.push(new nlobjSearchColumn('id', null, 'max'));
				idcolumns.push(new nlobjSearchColumn('company', null, 'group'));
				
				var idresults = nlapiSearchRecord('projecttask', null, idfilters, idcolumns);
				
				if(tasktype != null && tasktype != '' ){
					var compoundFieldValue = [];
					//Verify if apply associated compounds checked
					var boolassociatedcompounds=false;
					if(associatedcompounds != null && associatedcompounds !=''){
						if(associatedcompounds =='T'){
							boolassociatedcompounds=true;
							compoundFieldValue=getStudyAssociatedCompounds(recid);
						}
					}
					
					for (var i = 0; i < nooftimes; i++) {
					var studyTask = nlapiCreateRecord('projectTask', {
								recordmode : 'dynamic'
						});
						studyTask.setFieldValue('company', recid);
						studyTask.setFieldValue('custevent_study_task_task_type', tasktype);
						studyTask.setFieldValue('title', title);
						if(boolassociatedcompounds == true){
							studyTask.setFieldValue('custevent_study_task_compound',compoundFieldValue);
						}
					
						if(service != 6 && service !=3 ){
						
						
						if(matrixid != null && matrixid !='' && matrixid != undefined){studyTask.setFieldValue('custevent_sample_name', nlapiLookupField('inventoryitem',matrixid,'itemid'));}
						
						if(species != null && species !='' && species != undefined){studyTask.setFieldValue('custevent_species', species);}
						}
						
						if(idresults != null){
						if( idresults[0].getValue(idcolumns[0]) != null && idresults[0].getValue(idcolumns[0]) !='' && idresults[0].getValue(idcolumns[0]) != undefined ){
							var sortorder=parseInt(idresults[0].getValue(idcolumns[0]))+i+1;
							
							studyTask.setFieldValue('custevent_sort_order',sortorder );
						}
						}
						else{
							var sortorder=i+1;
							studyTask.setFieldValue('custevent_sort_order',sortorder );
						}
						
					var id= nlapiSubmitRecord(studyTask, true, true);	
					}
					}
					
					
					
					
				window.location.href=window.location.href;
				}
		
		
			catch(err){
				alert(err.message);
				nlapiLogExecution('DEBUG', 'err',err.message);
			}
			
	} 
			//
}


function buttonPress_deleteRecordsublist(recid){
	
	if(recid != undefined && recid !='' && recid != null){
		
			try{
				
					var msg= confirm("Are you sure you want to delete the record(s)?");
					if(msg== true){
				var itemCount = nlapiGetLineItemCount('custpage_taskdelete'); 
				var count =0;
				for ( var i = 1; i <= itemCount; i++) 
				{  
					if(nlapiGetLineItemValue('custpage_taskdelete', 'custpage_updatecheckbox_line', i)=='T'){
						if(nlapiGetLineItemValue('custpage_taskdelete', 'custpage_task_type_linemanager_line', i)=='T'){
							 alert('Cannot Delete this Record,'+ nlapiGetLineItemValue('custpage_taskdelete', 'custpage_tasktype_line', i) +'  Record is locked');
						}
						else{
							nlapiDeleteRecord('projecttask',nlapiGetLineItemValue('custpage_taskdelete', 'custpage_internalid_line',i));
						}
					}
					
				}//End of For Line count
				
				window.location.href=window.location.href;
				
					}
					else{
						alert("Record(s) not deleted!");
					}
				
			}
			catch(err){
				alert(err.message);
				nlapiLogExecution('DEBUG', 'err',err.message);
			}
	}
}


function handleResponse(response)
{
	window.location.href= document.URL;
}

function findSortOrder(recid){
	var filters = [];
	filters.push(new nlobjSearchFilter('company', null, 'is', recid));//studyid filter
	
	
	var columns=[];
	columns[0] = new nlobjSearchColumn('id',null,'max');
	
	var results = nlapiSearchRecord('projecttask', null, filters, columns);
	if(results != null){
	return results[0].getValue(columns[0]);
	}
	
}
function getStudyAssociatedCompounds(recid){
	var filters = [];
	filters.push(new nlobjSearchFilter('custrecord_compound_study', null, 'is', recid));//studyid filter
	
	var searchCompound = nlapiLoadSearch('customrecord_associated_study_compound', 'customsearch_associated_compound');
	var columns=[];
	
	columns=searchCompound.getColumns();
	
	var results = nlapiSearchRecord('customrecord_associated_study_compound', null, filters, columns);
	var retresults=[];
	var i=0;
	for (result in results){
	retresults[i]=results[result].getValue(columns[1])	;
	i +=1;
	}
	return retresults;
	
}

/**
 * 
 * @param type
 * @param name
 * @param linenum
 */
function fieldChanged_RefreshStudyTaskSublist(type, name, linenum){
var str='' ;

	if (name.indexOf('_line') ) {
		var lineCount = nlapiGetLineItemCount('custpage_task');
		if (lineCount != '' && lineCount != null) {
			nlapiSetLineItemValue('custpage_task', 'custpage_updatecheckbox_line', linenum, 'T');
			if(nlapiGetFieldValue( 'custpage_regularfields') != null){
				regularfields.push({uifieldname:name,fieldname:recordfields[name],value:nlapiGetLineItemValue(type, name, linenum),id:nlapiGetLineItemValue(type, 'custpage_internalid_line', linenum)});
				nlapiSetFieldValue('custpage_regularfields', JSON.stringify(regularfields));
			//	alert(JSON.stringify(regularfields));
			}
			
			
		}
		
		
	}
	
	if(name=='custpage_pf_line'){
			if(nlapiGetLineItemValue('custpage_task', 'custpage_pf_line', linenum)==2){
				nlapiSetLineItemDisabled('custpage_task','custpage_freason_line',false,linenum);	
			}
			else{
				nlapiSetLineItemValue('custpage_task', 'custpage_freason_line', linenum,'');
				nlapiSetLineItemValue('custpage_task', 'custpage_other_line', linenum,'');
				nlapiSetLineItemDisabled('custpage_task','custpage_freason_line',true,linenum);
				nlapiSetLineItemDisabled('custpage_task','custpage_other_line',true,linenum);				
				
			}
			
	}
	if(name=='custpage_freason_line'){
		if(nlapiGetLineItemValue('custpage_task', 'custpage_freason_line', linenum)==7){
				nlapiSetLineItemDisabled('custpage_task','custpage_other_line',false,linenum);
		}
		else{
			 nlapiSetLineItemValue('custpage_task', 'custpage_other_line', linenum,'');
			 nlapiSetLineItemDisabled('custpage_task','custpage_other_line',true,linenum);
		}
	}
	
	
	if(name=='custpage_plasma_quantity_line' || name=='custpage_urine_quantity_line'|| name=='custpage_df_quantity_line'||name=='custpage_tissue_quantity_line' || 
			name=='custpage_other_quantity_line' ){
		
		
			var quantity = getValue(nlapiGetLineItemValue('cutpage_task', 'custpage_plasma_quantity_line', linenum)) + getValue(nlapiGetLineItemValue('custpage_task', 'custpage_urine_quantity_line', linenum))  + getValue(nlapiGetLineItemValue('custpage_task', 'custpage_df_quantity_line', linenum))
			+ getValue(nlapiGetLineItemValue('custpage_task', 'custpage_tissue_quantity_line', linenum))  + getValue(nlapiGetLineItemValue('custpage_task', 'custpage_other_quantity_line', linenum)) ;
			
			if(quantity != null && quantity !='' && quantity != undefined){
				nlapiSetLineItemValue('custpage_task', 'custpage_billable_quantity_line', linenum,quantity);
				
				}
			
			
		
			
		
		
		
	}
	
	

	
	
	
	
}


 function getValue(qty){
	if(qty !='' && qty != null && qty != undefined ){   
		
	return parseFloat(qty);
	}
	else{
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
		var param=getParameterFromUrl(name);
		if ( param== null){
			window.open(currentUrl + '&' + name + '=' + fieldValue, '_self');
		}
		else {
			var updatedUrl = currentUrl.replace(name + '=' + param, name + '=' +fieldValue);
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
	var result = null, tmp = [];
	location.search.substr(1).split("&").forEach(function(item) {
		tmp = item.split("=");
		if (tmp[0] === val)
			result = decodeURIComponent(tmp[1]);
	});
	return result;
}