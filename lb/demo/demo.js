
//MY_NOTE_FOLDER_NAME = "/My Notes/";
TRASH_FOLDER_NAME="/Deleted Items/";
TASK_BOARD_FOLDER_NAME = "/My Notes/TaskBoard/";

TODO_FOLDER_NAME = "Todo";
DOING_FOLDER_NAME = "Doing";
DONE_FOLDER_NAME = "Done";

var useWizFileSystem = !true;
var useJSFlow = true;

var board = {};
/* 
//FOR TEST
TASK_BOARD_FOLDER_NAME = "/My Notes/Life";
TODO_FOLDER_NAME = "GTD";
DOING_FOLDER_NAME = "20S";
DONE_FOLDER_NAME = "English";
*/

/*
//NOT WORK
var objApp;
try 
{
    // check whether the page is opened in Wiz
    if (window.external !== undefined && window.external.Wiz !== undefined)
    {
        objApp = window.external;
    } 
    else 
    {
        // if it is opened via browser, create activex object
        // this should be supported only from IE8 to IE11.
        // IE Edge currently does not support ActiveXObject
        objApp = new ActiveXObject("Wiz.Application");
    }
}
catch(e) 
{ 
    alert(e);
    console.log(e); 
}
*/
        
var objApp = window.external;

var objDatabase = objApp.Database;
var objWindow = objApp.Window;

var objCategoryCtrl = objWindow.CategoryCtrl;
var objCurrentFolder = objCategoryCtrl.SelectedFolder;
var objDoc = null;

function saveTask(objCurrentFolder, title, desc)
{ 
    if(!useWizFileSystem)
        return;

    try 
    {
        if (title == null || title == "") 
        {
            title = "Untitled";
        }
        
        //if (objDoc == null) 
        { 
            //如果是第一次保存
            objDoc = objCurrentFolder.CreateDocument2(title, ""); //生成文档
            objDoc.Type = "document"; //设置文档类型
        }
        
        objDoc.ChangeTitleAndFileName(title); //更改文档标题和文件名

        //var htmltext = "<h1>" + title + "</h1><div>" + TextArea1.innerHTML + "</div>"; //生成的文档的html内容
        objDoc.UpdateDocument3(desc, 0);

        //objWindow.CategoryCtrl.SelectedFolder = objCurrentFolder;
        //objWindow.DocumentsCtrl.SetDocuments(objCurrentFolder);
        //objWindow.DocumentsCtrl.SelectedDocuments = objDoc;
        //objWindow.ViewDocument(objDoc, true);
    }
    catch (err) 
    {
        myalert(err.message); //出错了
    }
}
  
function getTrashFolder()
{
    return objDatabase.GetFolderByLocation(TRASH_FOLDER_NAME, true);
    
    /*
    //old style code, not good enough
    for(var i = 0 ; i < objApp.Database.Folders.Count;i++)
    {
        var item = objApp.Database.Folders.Item(i);
        if(item.Name == TRASH_FOLDER_NAME)
        {
            return item;
        }
    }
    */
}
  
//no need now  
function getTaskBoardFolder()
{
    return objDatabase.GetFolderByLocation(TASK_BOARD_FOLDER_NAME, true);  
}

function getTargetList(listId)
{
    var location = TASK_BOARD_FOLDER_NAME + listId; 
    return objDatabase.GetFolderByLocation(location, true); 
}

function getDocumentsFromList(folderName)
{
    return getTargetList(folderName).Documents;
}
 
//Utilities Functions 
function strToJson(str)
{ 
    return JSON.parse(str); 
} 

function plist(list)
{
    document.write("items number=" + list.Count + "<p>");
    for( var i = 0;i < list.Count;i++)
    {
        document.write(list.Item(i).Title + "<p>");
    }
}

    function formatInt(val) 
    {
        //alert(val);
    	if (val < 10)
    		return "0" + val;
    	else
    		return "" + val;
    }


//Main
$(function () 
{
    function getTodayString()
    {
        var now = new Date();
        var title = now.getFullYear() + "-" + formatInt(now.getMonth() + 1) + "-" + formatInt(now.getDate());
        return title;
    }
    
    function saveBoardToday()
    {
        var pluginPath = objApp.GetPluginPathByScriptFileName("tb.js");
        var tempFile= pluginPath + getTodayString()+ ".json";
       
        //myalert(getTodayString());
        var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
        //GetValueFromIni();
        objCommon.SetValueToIni(pluginPath + "history.json","section",getTodayString(),JSON.stringify(board));
        //objCommon.SetValueToIni(pluginPath + "history.json","section","key","value");
        
        //GetIniSections
    }
    
    function myalert(info)
    {
        objWindow.ShowMessage(info, "Info",0x40);
    }
    
    function loadBoard(fn,targetDiv)
    { 
        var pluginPath = objApp.GetPluginPathByScriptFileName("tb.js");
        var dataroot = pluginPath + fn;
        
        //myalert(dataroot);
        $.getJSON(dataroot, function(data)
        { 
            //myalert(targetDiv.id + JSON.stringify(data));
            targetDiv.lobiList(data);
            return data;
        });
    }

    Lobibox.notify.DEFAULTS = $.extend({}, Lobibox.notify.DEFAULTS, {
        size: 'mini',
        // delay: false,
        position: 'left top'
    });
    
    //http://lobianijs.com/site/lobilist
    function builtList(listTitle,listStyle,listData)
    {
        oneList = {};
        oneList.id = listTitle;//so that we can use $('#id') to refer it
        oneList.title = listTitle;
        oneList.defaultStyle = listStyle;
        oneList.items = [];
        
        for(var i = 0 ; i < listData.Count;i++)
        {
            var element = listData.Item(i);
            var abstract = element.AbstractText;
            if(abstract.length > 50)
                abstract = abstract.substring(0,50);

            var item =
            {
                "id" : element.GUID,
                "title" : element.Title,
                "description" : element.GUID + "<p>" + abstract,
                "dueDate": '',
                "done": '',
                "listId": listTitle
            };
        
            oneList.items.push(item);
        }

        return oneList;  
    }
    
    var   gettype = Object.prototype.toString;//gettype.call('aaaa')    
        
    function getInfo(arguments)
    {
        var info = "";
        //arguments         [me, oldList, currentIndex, oldIndex, item, $todo]
        
        //for(item in arguments)
        //    info += item + "(++)";
        
        info += gettype.call(arguments[0]) + "(++)";
        info += gettype.call(arguments[1]) + "(++)";
        info += gettype.call(arguments[2]) + "(++)";
        info += gettype.call(arguments[3]) + "(++)";
        info += gettype.call(arguments[4]) + "(++)";
        info += gettype.call(arguments[5]) + "(++)";

        return info;
    }
    
    function checkDocumentInList(id,list)
    {
        for(var i = 0 ; i < list.Count;i++)
        {
            if(list.Item(i).GUID == id)
                return list.Item(i);
        }
        
        return null;
    }

    function getDocumentByGUID(id)
    {
        var doc =checkDocumentInList(id,getDocumentsFromList(TODO_FOLDER_NAME));
        if(doc)
        {
            return doc;
        }
                
        var doc =checkDocumentInList(id,getDocumentsFromList(DOING_FOLDER_NAME));
        if(doc)
        {
            return doc;
        }
        var doc =checkDocumentInList(id,getDocumentsFromList(DONE_FOLDER_NAME));
        if(doc)
        {
            return doc;
        }
        
        return null;
    }
    
    function buildBoard()
    {
        board.onSingleLine = true;
        board.lists = [];
        
        board.afterItemDelete = function () 
        {
            console.log(arguments);//[me, item]
            
            var target = getTrashFolder();
            var document = getDocumentByGUID(arguments[1].id);

            //alert(target);alert(document);
            if(document && target && useWizFileSystem)
            {
                document.MoveTo(target);
            }
            
            Lobibox.notify('default', {
                        msg: 'afterItemDelete'
                    });
        };
        
        board.afterItemAdd = function () 
        {
            console.log(arguments);//[me, item]
            
            var target = getTargetList(arguments[1].listId);
            saveTask(target, arguments[1].title, arguments[1].description);
            
            Lobibox.notify('default', {
                            msg: 'afterItemAdd'
                        });
            location.reload();
            //http://www.jb51.net/article/14397.htm
        };
        
        //move to another list
        board.afterItemReorder = function () 
        {
            console.log(arguments);
            Lobibox.notify('default', {
                            msg: 'afterItemReorder'
                        });
                        
            //get origin list(directory) and target list(directory)
            
            //var origin = getOriginList(arguments[1]);
            //alert(arguments[4].listId);
            
            //item.listId = me.$options.title;
            
            var target = getTargetList(arguments[4].listId);
            var document = getDocumentByGUID(arguments[4].id);
            if(document && target && useWizFileSystem)
            {
                document.MoveTo(target);
            }
            
            //arguments: [me, oldList, currentIndex, oldIndex, item, $todo]
           // alert(arguments[0].$title);
            
            //alert(arguments[4].listId);//here is origin listId
            //alert(arguments[0].$title); //guid = arguments[4].id
            //alert(arguments[4].id);
        };
        
        //How to link update operation to document operation?
        board.beforeItemUpdate = function () 
        {
            //[me, item]
            //me.$title.attr('data-old-title')
            
            alert(arguments[0].$title.attr('data-old-title'));
        }
        
        var todoList = builtList(TODO_FOLDER_NAME,"lobilist-default",getDocumentsFromList(TODO_FOLDER_NAME));
        board.lists.push(todoList);
        
        var doingList = builtList(DOING_FOLDER_NAME,"lobilist-info",getDocumentsFromList(DOING_FOLDER_NAME));
        board.lists.push(doingList);
        
        var doneList = builtList(DONE_FOLDER_NAME,"lobilist-success",getDocumentsFromList(DONE_FOLDER_NAME));
        board.lists.push(doneList);
        
        //how about other list? maybe need enhance later
        return board;
    }
    
    function loadHistory()
    {
        $("#history").append("<select></select>");          
        $("<option></option>").val("").text("").appendTo($("select"));
        
        $("#history").change(function()
        {
            //alert("sel change");
             
            var data = $('#history option:selected').val();
            //alert($('#history option:selected').text());
            
            //cannot call this method two times, so we have to remove then add one div
            $("#actions-by-ajax").remove();
            $("<div id='actions-by-ajax'></div>").appendTo($("body"));
            $('#actions-by-ajax').lobiList(JSON.parse(data));
            
            /*
            //works but not good
            if($('#history option:selected').text()=="2016-11-18")
                $('#2016-11-18').lobiList(JSON.parse(data));
            
            if($('#history option:selected').text()=="2016-11-17")
                $('#2016-11-17').lobiList(JSON.parse(data));
             */
            /* 
            var parentdiv=$('<div></div>').lobiList(JSON.parse(data));  
            parentdiv.attr('id',$('#history option:selected').text());
            parentdiv.appendto('body');            
      
            //$("<div id='xxx'></div>").appendTo($("body"));
             
             //cannot call this method two times
             //$('#xxx').lobiList(JSON.parse(data));
             //alert(JSON.parse(data));
             */
        });
        
        var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
        var pluginPath = objApp.GetPluginPathByScriptFileName("tb.js");
        
        //NOT find ini function like, list all keys for one section
        
        for(day = 0;day <= 365;day++)
        {
            var d1 = new Date();
            d1.setDate(d1.getDate() - day);
            
            var key = d1.getFullYear() + "-" + formatInt(d1.getMonth() + 1) + "-" + formatInt(d1.getDate());
            //var key = "2016-11-18";
            var value = objCommon.GetValueFromIni(pluginPath + "history.json","section",key);
            if(value != "")
            {
                $("<option></option>").val(value).text(key).appendTo($("select"));
            }
        } 
        
    }
    
    //Main
    var storeInJson = !true;
    if(storeInJson)
        loadHistory();
    
    //loadBoard("tb.json",$('#actions-by-ajax'));
    $('#actions-by-ajax').lobiList(buildBoard());

    //init();
    
    $("#btn1").click(function()
    {
        //alert("??");
        ///$('#list1').html()
    });

    if(useJSFlow)
    {
        list_to = genNode("this is list 1","list1",'Todo',60,250);
        loadBoard("tb1.json",$('#list1'));
        
        alert($('#Todo').html());
        
        var off_x = list_to.widget.x + list_to.widget.w + 60;
    //    off_x = 300;
        list_doing = genNode("this is list 2","list2",'Doing',60+off_x,250);
        loadBoard("tb2.json",$('#list2'));
        
        var off_y = list_doing.widget.y + list_doing.widget.h + 30;
    //    off_y = 200;
        list_done = genNode("this is list 3","list3",'Done',60+2*off_x,250);
        loadBoard("tb3.json",$('#list3'));
            
        connectTable(list_to,list_doing);
        connectTable(list_doing,list_done);

        saveBoardToday();
    }
}); 
 