 
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

function genNode(divContent, did,title,pos_x,pos_y)
{
    //alert(JSON.stringify({v:divContent}));
    //alert(did + ":" + divContent);
   
	//var node = new nodeTypes.Custom({x:200,y:200,title:table_name,content:data});
	var node = new nodeTypes.Custom(
	    {
	        id: did,
	        x : pos_x,
	        y : pos_y,
	        title : title,
	        content : divContent
	    });

	//alert("11node="+node);    
	
	if( node != null)
	    nodeMap[title] = node;
	    
	//alert("22node="+node);    
	    
	return node;
}

var objApp = window.external;
var objWindow = objApp.Window;

function genNodes(jsonFile)
{
    /*
    $.getJSON(jsonFile, function(data)
    { 
         objWindow.ShowMessage( JSON.stringify(data), "Info",0x40);
         
         //$('#xxx').lobiList(data);
         //objWindow.ShowMessage( JSON.stringify( $('#Todo').data('lobiList').lists[0].title ), "Info",0x40);
    });
    */
    
    /*
    
     list_to = genNode($('#Todo').data('lobiList'),'Todo',60,250);
    
    var off_x = list_to.widget.x + list_to.widget.w + 60;
    list_doing = genNode($('#Doing').data('lobiList'),'Doing',off_x,100);
    
    var off_y = list_doing.widget.y + list_doing.widget.h + 30;
    list_done = genNode($('#Done').data('lobiList'),'Done',off_x,off_y);
        
    connectTable(list_to,list_doing);
    connectTable(list_doing,list_done);
    */
}

 
   
  
  

