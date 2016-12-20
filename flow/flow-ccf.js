 
var nodeMap = {};
function genHeader(subNodes)
{
    var data = '<tr>';
    for(var j = 0; j < subNodes.length; j++)
    {
        var attrsOfChild = subNodes[j].attributes;
        var _label = attrsOfChild[0].nodeValue;
	    
	    data += "<td>" + _label + "</td>";
    }
    
    data += '</tr>';
    return data;
}

function genCompactTableData(children)
{
    var data = '<table border="1">';
	for (var i = 0; i < children.length; i++)
	{
	    var subNodes = mxUtils.getChildNodes(children[i]);
	    
	    for(var j = 0; j < subNodes.length; j++)
	    {
	        data += '<tr>';
	        //alert(subNodes[j].baseName + ":" + subNodes[j].nodeTypedValue);
	        var attrsOfChild = subNodes[j].attributes;
	        
	        var _label = attrsOfChild[0].nodeValue;
		    var _value = attrsOfChild[1].nodeValue;
		    //alert(_label+"="+_value);
		    
		    data += "<td>" + _label + "</td>" + "<td>" + _value + "</td>";
		    data += '</tr>';
	    }
	}
	
	data += '</table>';
	return data;
}

function genNormalTableData(children)
{
    var data = '<table border="1">';
    for (var i = 0; i < children.length; i++)
	{
	    data += '<tr>';
	    var subNodes = mxUtils.getChildNodes(children[i]);
	    
	    if( i == 0 )
	        data += genHeader(subNodes);
	    
	    for(var j = 0; j < subNodes.length; j++)
	    {
	        //alert(subNodes[j].baseName + ":" + subNodes[j].nodeTypedValue);
	        var attrsOfChild = subNodes[j].attributes;
	        
	        var _label = attrsOfChild[0].nodeValue;
		    var _value = attrsOfChild[1].nodeValue;
		    //alert(_label+"="+_value);
		    
		    data += "<td>" + _value + "</td>";
	    }
	    data += '</tr>';
	}

	data += '</table>';
    return data;
}
 
function connectTable(n1,n2)
{
    c = 190;
    if(n1 != null && n2 != null)
        mkWire(n1,'key',n2,'key',c);
} 

function genNode(root, table_name,pos_x,pos_y)
{
    var tableNode = mxUtils.findNodeByAttribute(root,"id",table_name);
    if(tableNode == null)
        return null;
        
	var children = mxUtils.getChildNodes(tableNode);
	
	//mxUtils.popup( mxUtils.getTextContent(tableNode) , true);
	//data = mxUtils.getXml(tableNode);
	//mxUtils.popup( data , true);
	
    //count($rows) &lt; 3 and count(./field) &gt; 5
    var table_content = '';
	if(children.length < 3 && mxUtils.getChildNodes(children[0]).length >5)
	    table_content = genCompactTableData(children);
	else
        table_content = genNormalTableData(children);
	
	//var node = new nodeTypes.Custom({x:200,y:200,title:table_name,content:data});
	var node = new nodeTypes.Custom({x:pos_x,y:pos_y,title:table_name,content:table_content});
	
	if( node != null)
	    nodeMap[table_name] = node;
	return node;
}

function genNodes(workflowFile)
{
    var req = mxUtils.load(workflowFile);
    //mxUtils.popup(req.getText(), true);
    
    var root = req.getDocumentElement();
    tbl_eccf_workflow_list = genNode(root,'ECCF_WORKFLOW_LIST',60,250);
    
    var off_x = tbl_eccf_workflow_list.widget.x + tbl_eccf_workflow_list.widget.w + 60;
    tbl_eccf_xdr_definition = genNode(root,'ECCF_XDR_DEFINITION',off_x,100);
    
    var off_y = tbl_eccf_xdr_definition.widget.y + tbl_eccf_xdr_definition.widget.h + 30;
    tbl_eccf_workflow_definition = genNode(root,'ECCF_WORKFLOW_DEFINITION',off_x,off_y);
    
    off_y = tbl_eccf_workflow_definition.widget.y + tbl_eccf_workflow_definition.widget.h + 30;
    tbl_eccf_action_definition = genNode(root,'ECCF_ACTION_DEFINITION',off_x,off_y);
        
    connectTable(tbl_eccf_workflow_list,tbl_eccf_xdr_definition);
    connectTable(tbl_eccf_workflow_list,tbl_eccf_workflow_definition);
    connectTable(tbl_eccf_workflow_list,tbl_eccf_action_definition);
    
    //try if table is not exist
    tbl_eccf_xxx = genNode(root,'xxx',700,600);

    //should enhance to be: line should be connected with two leys(PK and FK, even 1 output v.s. N inputs)
    tbls=[    
        'ECCF_RF_ADAPTER_CONFIG',
        'ECCF_XDR_GENERATION',

        'ECCF_VALIDATION_CONFIG',

        'ECCF_PRE_CORRE_CONFIG',
        'ECCF_XDR_PRE_CORRELATION',

        'ECCF_AGGREGATION_CONFIG',
        'ECCF_XDR_AGGREGATION',
        'ECCF_XDR_CORRELATION',

        'ECCF_HOST_GROUP',
        'ECCF_FIELD_MAP_CONFIG',
        'ECCF_MAPPING_DATA_SOURCE',
        'ECCF_POLICY_LIST',

        'ECCF_XDR_RO_CONSTRUCTION',
        'ECCF_XDR_SH_CONSTRUCTION',
        'ECCF_VX_CONFIG',

        'ECCF_XDR_CDR',
        'ECCF_DISTRIBUTION_CONFIG',
        
        'ECCF_DICT_DEFINITION'
        //'ECCF_WORKFLOW_LIST' //should not list here because all related data are listed already
    ];
    
    var pre_tbl = null;
    var tbl_eccf_field_map_config,tbl_eccf_mapping_data_source,tbl_eccf_dict_definition;
    var index = 1;
    for (var i = 0; i < tbls.length; i++)
    {
        var height = 100;
        var width = 1000;
        //mxUtils.popup(tbls[i], true);
        if(pre_tbl != null)
            height = pre_tbl.widget.y + pre_tbl.widget.h + 30;
        
        var off_x = tbl_eccf_action_definition.widget.x + tbl_eccf_action_definition.widget.w + 80;
        
        if(tbls[i] == 'ECCF_FIELD_MAP_CONFIG')
        {
            tbl_eccf_ref = genNode(root,tbls[i],off_x,height);
            tbl_eccf_field_map_config = tbl_eccf_ref;
        }   
        else if(tbls[i] == 'ECCF_MAPPING_DATA_SOURCE')
        {    
            if(tbl_eccf_field_map_config != null)
                off_x += tbl_eccf_field_map_config.widget.w + 100;
            tbl_eccf_ref = genNode(root,tbls[i],off_x,height);
            tbl_eccf_mapping_data_source = tbl_eccf_ref;
        }
        else if(tbls[i] == 'ECCF_DICT_DEFINITION')
        {    
            //if(tbl_eccf_field_map_config != null)
            //    off_x += tbl_eccf_field_map_config.widget.w + 100;
            off_x += 800;
            height = 500;
            tbl_eccf_ref = genNode(root,tbls[i],off_x,height);
            tbl_eccf_dict_definition = tbl_eccf_ref;
        }
        else
        {
            tbl_eccf_ref = genNode(root,tbls[i],off_x,height);            
        }
        
        if(tbl_eccf_ref == null)
            continue;
        
        pre_tbl = tbl_eccf_ref;
        //alert(tbl_eccf_xxx.widget.x + ',' + tbl_eccf_xxx.widget.y);
        
        index++;
        if( tbls[i] != 'ECCF_MAPPING_DATA_SOURCE' && tbls[i] != 'ECCF_DICT_DEFINITION')
            connectTable(tbl_eccf_action_definition,tbl_eccf_ref);
    }

    connectTable(tbl_eccf_field_map_config,tbl_eccf_mapping_data_source);
    
    connectTable(nodeMap['ECCF_XDR_GENERATION'],nodeMap['ECCF_DICT_DEFINITION']);
    connectTable(nodeMap['ECCF_XDR_CDR'],nodeMap['ECCF_DICT_DEFINITION']);
    
    connectTable(nodeMap['ECCF_XDR_PRE_CORRELATION'],nodeMap['ECCF_DICT_DEFINITION']);
    connectTable(nodeMap['ECCF_XDR_AGGREGATION'],nodeMap['ECCF_DICT_DEFINITION']);
    connectTable(nodeMap['ECCF_XDR_CORRELATION'],nodeMap['ECCF_DICT_DEFINITION']);
}
/////////////

  

