MY_NOTE_DIR_NAME = "My Notes";
TASK_BOARD_DIR_NAME = "TaskBoard";
TODO_DIR_NAME = "Todo";
DOING_DIR_NAME = "Doing";
DONE_DIR_NAME = "Done";

var objApp = window.external;
var objDatabase = objApp.Database;
var objWindow = objApp.Window;
 
 //some global configuration
var useWizFileSystem = true;
        
function getMyNoteDir()
{
    for(var i = 0 ; i < objApp.Database.Folders.Count;i++)
    {
        var item = objApp.Database.Folders.Item(i);
        if(item.Name == MY_NOTE_DIR_NAME)
        {
            return item;
        }
    }
} 

function getTaskBoardDir()
{
    var my_note = getMyNoteDir();
    for(var i = 0 ;i < my_note.Folders.Count;i++)
    {
        var item = my_note.Folders.Item(i);
        
        if(item.Name == TASK_BOARD_DIR_NAME)
        {
            return item;
        }
    }
    
    return null;
}

function getList(dirName)
{
    var list = getTaskBoardDir();
    for(var i = 0 ;i < list.Folders.Count;i++)
    {
        var item = list.Folders.Item(i);
    
        if(item.Name == dirName)
        {
            return item;
        }
    }
}
    //TEST TOOL BUTTON    
    function OnHelperButtonClicked() 
    {
        var objDocument = objApp.Window.CurrentDocument;
        if (objDocument) 
        {
            var html = "<div>当前浏览的笔记是：" + objDocument.Title + "</div>";
            //document.write(html);
            WizAlert("您点击了助手按钮,当前笔记已移至TaskBoard/Todo目录");
            
            var todoDir = getList(TODO_DIR_NAME);
            objDocument.MoveTo(todoDir);
        }
        
    }
    
    function OnTaskBoardButtonClicked() 
    {
        var objApp = WizExplorerApp;
	    var objWindow = objApp.Window;
	    
	    var pluginPath = objApp.GetPluginPathByScriptFileName("tb.js");
	    //alert(pluginPath);
	    objWindow.ViewHtml(pluginPath + "tb.html", true);
	    
	    //objWindow.ViewHtml(pluginPath + "trello.html", true);
	    
	    //NOT work, don;t know how to use it, I just want to open one url inside wiz
	    //var ret =objWindow.ExecCommand("calc","");
	    //alert(ret);
    }
    
    
    function openURL(web)
    {
	    var context = "<html class=\"no-js\" lang=\"zh-CN\"> \
            <head> \
                <meta http-equiv=\"Content-Type\" content=\"text/html\" charset=\"UTF-8\" /> \
                <meta http-equiv=\"refresh\" content=\"0; url=web\"> \
                <title>任务看板</title>    \
            </head> \
            <body>要起飞了！</body></html>";
        
        context = context.replace(/web/g,web)

        var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
        var tempPath = objCommon.GetSpecialFolder("TemporaryFolder");
	    //alert(tempPath);
        objCommon.SaveTextToFile(tempPath + "temp.html", context, "utf-8-bom");
	    objWindow.ViewHtml(tempPath + "temp.html", true);
	}
    
    function OnTrelloButtonClicked()
    {
        var objApp = WizExplorerApp;
	    var objWindow = objApp.Window;
	    
	    //显示一个下拉窗口。
        //[id(16), helpstring("method ShowSelectorWindow")] HRESULT ShowSelectorWindow([in] BSTR bstrURL, 
        //[in] LONG left, [in] LONG top, [in] LONG width, [in] LONG height, [in] BSTR bstrExtOptions);
        //关闭下拉窗口
        //[id(17), helpstring("method CloseSelectorWindow")] HRESULT CloseSelectorWindow([in] IDispatch* pdispSelectorHtmlDocument);

//NOT work, alerted by wiz
//WizAlert(objApp.Window.ShowSelectorWindow);
//	    objApp.Window.ShowSelectorWindow("请选择："0,0,600,600,"1\n\2\3");
	    
	    openURL("https://trello.com/b/3WaEYp34/-");
	    //var pluginPath = objApp.GetPluginPathByScriptFileName("tb.js");
	    //objWindow.ViewHtml(pluginPath + "tb-test.html", true);
	    //alert("2");
    }

    function createTaskBoardFolder()
    {
        if(getTaskBoardDir() == null && useWizFileSystem)
        {
            var note = getMyNoteDir();
            var tb = note.CreateSubFolder("TaskBoard");
            tb.CreateSubFolder("Todo");
            tb.CreateSubFolder("Doing");
            tb.CreateSubFolder("Done");
            
            //change content of tb.html
            var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
            var pluginPath = objApp.GetPluginPathByScriptFileName("tb.js");
            objCommon.CopyFile(pluginPath + "tb_template.html", pluginPath + "tb.html");
            
            /*
            var tempFile= pluginPath + "tb.html";
            var tempText = objCommon.LoadTextFromFile(tempFile);
        	//<script type="text/javascript" src="Editor.jsmind/js/jsmind.js"></script>
        	
        	tempText = tempText.replace(/(<script type="text\/javascript" src=")/g, "$1" + encodeURI(pluginPath))
        					   .replace(/(<link type="text\/css" rel="stylesheet" href=")/g, "$1" + encodeURI(pluginPath))
        					   .replace(/(<img src=")/g, "$1" + encodeURI(pluginPath));
        	objCommon.SaveTextToFile(tempFile, tempText, "utf-8-bom");
        	*/
        }
    }

    function onTimer() 
    {
        objWindow.ShowMessage("休息一下眼睛吧", "我的第一个为知笔记插件", 0x40);
    }
    
    function init() 
    {
        createTaskBoardFolder();
        //var pluginPath = objApp.GetPluginPathByScriptFileName("demo.js");
        
        //var languangeFileName = pluginPath + "plugin.ini";
        var buttonText = "Add to Todo";//objApp.LoadStringFromFile(languangeFileName, "strHelper");
        objApp.Window.AddToolButton("main", "HelperButton", buttonText, "", "OnHelperButtonClicked");
        
        //show TaskBoard
        objApp.Window.AddToolButton("main", "HelperButton2", "TaskBoard", "", "OnTaskBoardButtonClicked");
        
        //show Trello
        objApp.Window.AddToolButton("main", "HelperButton3", "Trello", "", "OnTrelloButtonClicked");

        objApp.Window.AddTimer("onTimer", 1000 * 60 * 30);        //每隔30分钟提醒一次
    }
    
    init();