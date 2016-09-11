var RegisteredObjectNames = new Array();

function createCookie(name,value,days) {
	if(RegisteredObjectNames.indexOf(name)<0 && days!=-1) {
		RegisteredObjectNames.push(name);
	}
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*86400000));
		var expires = ";expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+encodeURIComponent(value)+expires+";path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) {
			if(RegisteredObjectNames.indexOf(name)<0) {
				RegisteredObjectNames.push(name);
			}
			return decodeURIComponent(c.substring(nameEQ.length,c.length));
		}
	}
	return null;
}

function eraseCookie(name) {
	try{RegisteredObjectNames.splice(RegisteredObjectNames.indexOf(name),1);}catch(e){}
	createCookie(name,"",-1);
}

function SetObjectValue(Obj,d) {
	if(Obj.type=="select-one") {
		for(var i=0;i<Obj.length;i++) {
			if(Obj.options[i].value==d) {
				d=Obj.options[i].index;
				Obj.selectedIndex=d;
				break;
			}
		}
	}
	else if(Obj.type=="checkbox") {
		if(d){d="checked";}else{d="";}
		Obj.checked=(d);
	} else {
		Obj.value=d;
	}
}

function SetObjectValueID(id,d) {
	SetObjectValue($(id),d);
}

function deleteAllCookies() {
	while(RegisteredObjectNames.length>0) {
		eraseCookie(RegisteredObjectNames[0]);
	}
}

function GetInputObjCookie(Obj) {
	var d=readCookie(Obj.id);
	if(d==null) {
		d=Obj.value;
	}
	SetObjectValue(Obj,d);
	return d;
}

function GetCheckBoxObjCookie(Obj) {
	var d=readCookie(Obj.id);
	if(d==null) {
		d=""+Obj.checked;
	}
	d=(d=="true");
	SetObjectValue(Obj,d);
	return d;
}

function GetSelectObjCookie(Obj) {
	var d=readCookie(Obj.id);
	if(d==null) {
		d=Obj.value;
	}
	SetObjectValue(Obj,d);
	return d;
}

function GetObjCookie(Obj) {
	var t=Obj.type;
	if(t=="text" || t=="hidden"){return GetInputObjCookie(Obj);}
	if(t=="select-one"){return GetSelectObjCookie(Obj);}
	if(t=="checkbox"){return GetCheckBoxObjCookie(Obj);}
	return null;
}

function SetInputObjCookie(id, Obj) {
	var d=Obj.value;
	createCookie(id,d);
}

function SetCheckBoxObjCookie(id, Obj) {
	var d=""+(Obj.checked);
	createCookie(id,d);
}

function SetSelectObjCookie(id, Obj) {
	var d=Obj.value;
	createCookie(id,d);
}

function SetObjCookie(Obj, id) {
	var t=Obj.type;
	if(t=="text" || t=="hidden"){SetInputObjCookie((id!=null?id:Obj.id),Obj);}
	if(t=="select-one"){SetSelectObjCookie((id!=null?id:Obj.id),Obj);}
	if(t=="checkbox"){SetCheckBoxObjCookie((id!=null?id:Obj.id),Obj);}
}

function EraseInputObjCookie(Obj) {
	var d=readCookie(Obj.id);
	eraseCookie(Obj.id);
	if(d==null) {
		d=Obj.value;
	}
	Obj.value=d;
	return d;
}

function EraseCheckBoxObjCookie(Obj) {
	var d=readCookie(Obj.id);
	eraseCookie(Obj.id);
	if(d==null) {
		d=""+Obj.checked;
	}
	d=(d=="true");
	Obj.checked=d;
	return d;
}

function EraseSelectObjCookie(Obj) {
	var d=readCookie(Obj.id);
	eraseCookie(Obj.id);
	if(d==null) {
		d=Obj.value;
	}
	for(var i=0;i<Obj.length;i++) {
		if(Obj.options[i].value==d) {
			d=Obj.options[i].index;
			Obj.selectedIndex=d;
			return Obj.options[i].value;
		}
	}
	return d;
}

function EraseObjCookie(Obj) {
	var t=Obj.type;
	if(t=="text" || t=="hidden"){return EraseInputObjCookie(Obj);}
	if(t=="select-one"){return EraseSelectObjCookie(Obj);}
	if(t=="checkbox"){return EraseCheckBoxObjCookie(Obj);}
	return null;
}

function $(id){return document.getElementById(id);}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt) {
		var len = this.length;
		var from = Number(arguments[1]) || 0;
		from = (from < 0)
			? Math.ceil(from)
			: Math.floor(from);
		if (from < 0)
		from += len;

		for (; from < len; from++) {
			if (from in this && this[from] === elt)
			return from;
		}
		return -1;
	};
}

var output="";
var config="";
var NL;

var NumOfStreams = 1;
var ConfigStreams = 1;
var CurrentPage = 1;
var LastPage = 1;
var Password;
var AdminPassword;
var PortBase;
var MaxUser;

function SetDefaults() {
	LastPage = readCookie("LastPage");
	if(LastPage == null) LastPage = 1;
	CurrentPage = readCookie("CurrentPage");
	if(CurrentPage == null || (CurrentPage >= (2+ConfigStreams) && ((LastPage != 3 && CurrentPage != 4) || (LastPage == CurrentPage)))) CurrentPage = 1;
	else if(LastPage == 3 && CurrentPage == 4) {
		$('results').innerHTML = "Successfully saved settings to the config file (sc_serv.conf).<br><br>Click '<b>Run Server</b>' to run the server with the specified settings or '<b>Exit</b>' to close this instance of the server (run without a configuration file to use the new settings).<br><br><input class=\"submit\" type=\"button\" value=\"Run Server\" id=\"runserver\"/>&nbsp;&nbsp;<input class=\"submit\" type=\"button\" value=\"Exit\" id=\"exit\"/>";
		AETFC($("exit"),onExitButtonClicked);
		AETFC($("runserver"),onRunServerButtonClicked);
	}

	NumOfStreams=1;SetObjectValueID("num_streams",NumOfStreams);
	ConfigStreams=1;SetObjectValueID("streams",ConfigStreams);

	Password="";SetObjectValueID("password",Password);
	AdminPassword="";SetObjectValueID("adminpassword",AdminPassword);
	PortBase=8000;SetObjectValueID("portbase",PortBase);
	MaxUser=512;SetObjectValueID("maxuser",MaxUser);
}

var NumOfStreamsInput;
var ConfigStreamsCheckBox;
var MultiPointSpan;

var PasswordInput;
var AdminPasswordInput;
var PortBaseInput;
var MaxUserInput;

var EndPointPathInputArray=new Array(NumOfStreams);
var EndPointMaxUserInputArray = new Array(NumOfStreams);
var EndPointAuthHashInputArray=new Array(NumOfStreams);
var EndPointPasswordInputArray=new Array(NumOfStreams);
var EndPointAdminPasswordInputArray=new Array(NumOfStreams);

function numeric(Obj) {
	return Obj.value.replace(/[^\d]/,'');
}

function DoObjShowHide(Show, Obj) {
	if(Show) {
		Obj.style.visibility="";
		Obj.style.display="";
	} else {
		Obj.style.visibility="hidden";
		Obj.style.display="none";
	}
}

function onPortBaseInputChanged() {
	PortBaseInput.value=numeric(PortBaseInput);
	PortBase=PortBaseInput.value;
	if(PortBase<1){
		PortBase = (PortBaseInput.value = 8000);
	} else if(PortBase>65535){
		PortBase = (PortBaseInput.value = 65535);
	}
	SetObjCookie(PortBaseInput,"portbase");
}

function onMaxUserInputChanged() {
	MaxUserInput.value=numeric(MaxUserInput);
	MaxUser=MaxUserInput.value;
	if(MaxUser<1){
		MaxUser = (MaxUserInput.value = 1);
	} else if(MaxUser>1000){
		MaxUser = (MaxUserInput.value = 1000);
	}
	SetObjCookie(MaxUserInput,"maxuser");
}

function onPasswordInputsChanged() {
	Password=PasswordInput.value;
	AdminPassword=AdminPasswordInput.value;

	PasswordInput.style.borderColor = (!Password.length || Password==AdminPassword?"red":"");
	SetObjCookie(PasswordInput,"password");

	AdminPasswordInput.style.borderColor = (!AdminPassword.length || Password==AdminPassword?"red":"");
	SetObjCookie(AdminPasswordInput,"adminpassword");

	$("continue1b").disabled = (!Password.length || !AdminPassword.length || Password==AdminPassword);
}

function validateEndPointObjectChanges() {
	var disabled = 0;
	for(var i=0;i<NumOfStreams;i++) {
		var epp = EndPointPasswordInputArray[i].value;
		var epap = EndPointAdminPasswordInputArray[i].value;
		var epah = EndPointAuthHashInputArray[i].value;

		EndPointPasswordInputArray[i].style.borderColor = (epp.length && (epp==epap || epp==Password)?"red":"");
		EndPointAdminPasswordInputArray[i].style.borderColor = (epap.length && (epp==epap || epap==AdminPassword)?"red":"");
		var authError = false;
		if(epah.length>0){
			authError = (epah.search(/^[a-zA-Z0-9]{20}$/)==-1 ? true : false);
		}
		EndPointAuthHashInputArray[i].style.borderColor = (authError?"red":"");

		if(((epp.length || epap.length) && epp==epap) || epp==Password || epap==AdminPassword || authError) disabled += 1;
	}
	$("continue2b").disabled = (disabled > 0);
}

function onEndPointGenericObjectChanged(w) {
	var evt=w || window.event;
	var obj=evt.target || evt.srcElement;
	SetObjCookie(obj);
	validateEndPointObjectChanges();
}

function onEndPointMaxUserObjectChanged(w) {
	var evt=w || window.event;
	var obj=evt.target || evt.srcElement;
	obj.value=numeric(obj);
	if(obj.value>parseInt(MaxUser)){
		obj.value = MaxUser;
	}
	SetObjCookie(obj);
}

function onBackButtonClicked() {
	changePage(-1);
}

function onContinueButtonClicked() {
	changePage(1);
	if(CurrentPage == 2) {
		validateEndPointObjectChanges();
	} else if(CurrentPage == 3) {
		DoUpdate(1);
		$("preview").innerHTML = config;
	} else if(CurrentPage == 4) {
		DoUpdate();
		sendConfigDetails();
	}
}

function onRunServerButtonClicked() {
	sendRun();
}

function onExitButtonClicked() {
	changePage(0);
}

function onResetButtonClicked() {
	deleteAllCookies();
	window.location="setup";
}

function onConfigStreamsButtonClicked() {
	ConfigStreams=ConfigStreamsCheckBox.checked;
	SetObjCookie(ConfigStreamsCheckBox);

	var y=$("s2");
	DoObjShowHide(ConfigStreams, y);
	y.innerHTML="Stage 2 - Stream Settings<br><br>";
	y=$("s3");
	y.innerHTML="Stage "+(2+ConfigStreams)+" - Confirm Settings<br><br>";
	y=$("s4");
	y.innerHTML="Stage "+(3+ConfigStreams)+" - Save Settings<br><br>";
}

function onStreamsTotalChanged(load) {
	var w=(!load?(NumOfStreams):0);
	NumOfStreamsInput.value=numeric(NumOfStreamsInput);
	NumOfStreams=(NumOfStreamsInput.value);
	if(NumOfStreams<1){
		NumOfStreams = NumOfStreamsInput.value = 1;
	} else if(NumOfStreams>2147483647){
		NumOfStreams = NumOfStreamsInput.value = 2147483647;
	}
	SetObjCookie(NumOfStreamsInput);
	if(w!=NumOfStreams) {
		MultiPointSpanUpdate();
	}
}

function OutIntRaw(name, p, def) {
	if(p == def) return "";
	return encodeURIComponent(name+"="+p)+NL;
}

function OutStr(name, p, def) {
	if(p == def) return "";
	return name+p+NL;
}

function OutIndex(name, rindex, p) {
	return encodeURIComponent(name+((NumOfStreams >= 2) ? "_"+(rindex+1) : "")+"="+p)+NL;
}

function DoUpdate(mode) {
	if(mode == null) {
		output = "";
		NL = "&";
		output += encodeURIComponent("password="+Password)+NL;
		output += encodeURIComponent("adminpassword="+AdminPassword)+NL;
		output += OutIntRaw("portbase",PortBase,8000);
		output += OutIntRaw("maxuser",MaxUser,512);
		if(ConfigStreams && NumOfStreams > 0) {
			output += encodeURIComponent("requirestreamconfigs=1")+NL;
			for(var i=0;i<NumOfStreams;i++) {
				output += OutIndex("streamid",i,(i+1));

				var epp = EndPointPasswordInputArray[i].value;
				if(epp) output += OutIndex("streampassword",i,epp);

				var epap = EndPointAdminPasswordInputArray[i].value;
				if(epap) output += OutIndex("streamadminpassword",i,epap);

				var epmu=EndPointMaxUserInputArray[i].value;
				if(epmu!="") output+=OutIndex("streammaxuser",i,epmu);

				var epsp=EndPointPathInputArray[i].value
				if(epsp!="" && (!i ? (epsp!="/") : (epsp!="stream/"+(i+1)+"/"))) output += OutIndex("streampath",i,epsp);

				var epah=EndPointAuthHashInputArray[i].value
				if(epah!="") output += OutIndex("streamauthhash",i,epah);
			}
		}
	} else {
		config = "";
		NL = "</b><br>";
		config += "<fieldset style=\"text-align:center;width:inherit;\"><legend class=\"titlespan\"><b>Passwords</b></legend>";
		config += "Source Password: <b>"+Password+"</b><br>";
		config += "Admin Password: <b>"+AdminPassword+"</b><br></fieldset><br>";

		config += "<fieldset style=\"text-align:center;width:inherit;\"><legend class=\"titlespan\"><b>Listener Access</b></legend>";
		config += "Server Port: <b>"+PortBase+"</b><br>";
		config += "Maximum Listeners: <b>"+MaxUser+"</b></fieldset><br>";

		config += "<fieldset style=\"text-align:center;width:inherit;\"><legend class=\"titlespan\"><b>";
		if(ConfigStreams) {
			if(NumOfStreams == 1) {
				config += "1 Configured Stream";
			} else {
				config += NumOfStreams+" Configured Streams";
			}
			config += "</b></legend>Source connection(s) are only allowed to be made to the server as long as the required details received match with what has been specified for the stream.<br><br>Source connection(s) made on non-configured streams will be rejected.";
			config += "<br><br><table width=\"100%\">"
			for(var i=0;i<NumOfStreams;i++) {
				var stream="";
				config += "<tr><td><fieldset style=\"text-align:center;width:inherit;\"><legend class=\"titlespan\"><b>Stream #"+(i+1)+"</b></legend>";

				var epp = EndPointPasswordInputArray[i].value;
				if(epp) stream += "Source Password: <b>"+epp+"</b><br>";

				var epap = EndPointAdminPasswordInputArray[i].value;
				if(epap) stream += "Admin Password: <b>"+epap+"</b><br>";

				var epmu=EndPointMaxUserInputArray[i].value
				if(epmu) stream += OutStr("Maximum Listeners: <b>",epmu,512);

				var epsp=EndPointPathInputArray[i].value
				if(epsp!="" && (!i ? (epsp!="/") : (epsp!="stream/"+(i+1)+"/"))) stream += "Listener Stream Path: <b>"+epsp+"</b><br>";

				if(!stream) stream = "Server defaults will be used for this stream as no values were entered in stage 2. Click '<b>Back</b>' to amend this if required.";
				config += stream+"</fieldset></td></tr>";
			}
			config += "</table>";
		} else {
			config += "No Configured Streams</b></legend>Any source can connect to the server as long as the password set matches '<b>Source Password</b>' and there is no source already connected for the stream.";
		}
		config += "</fieldset><br>";
	}
}

var LastHelpObj=0;
function DoHelpUpdate(Obj) {
	if(LastHelpObj==Obj) return;
	if(HelperTextDBKeysArray.length<1)return;
	if(HelperTextDBValuesArray.length<1)return;
	LastHelpObj=Obj;
	if(Obj==null) {
		if(HelperTextDBKeysArray.length > 1) uht("Move your mouse over an option to get additional information about that option.");
		return;
	}
	if(Obj.id=="") {
		return;
	}
	for(var i=0;i<HelperTextDBKeysArray.length;i++) {
		var uu=HelperTextDBKeysArray[i].split("\t");
		var id=Obj.id;
		if(id==uu[0]) {
			uht(HelperTextDBValuesArray[i]);
			return;
		}
		if(uu.length>1) {
			if(id.indexOf(uu[0])==0) {
				if(id.indexOf(uu[1])==(id.length-uu[1].length)) {
					uht(HelperTextDBValuesArray[i]);
					return;
				}
			}
		}
	}
	if(HelperTextDBKeysArray.length > 1) uht("No information is available for this option.");
}

function onObjFocused(w) {
	var evt=w || window.event;
	var obj=evt.target || evt.srcElement;
	DoHelpUpdate(obj);
}

function onObjMousedOver(w) {
	var evt=w || window.event;
	var obj=evt.target || evt.srcElement;
	DoHelpUpdate(obj);
}

function AETFC(eo,ee) {
	if(eo==null)return;
	if(eo.type=="checkbox" || eo.type=="button" || eo.type=="radio") {
		eo.onclick=ee;
	} else {
		eo.onchange=ee;
	}
	eo.onkeyup=ee;
	eo.onfocus=onObjFocused;
	eo.onmouseover=onObjMousedOver;
}

function MultiPointSpanUpdate() {
	delete EndPointPathInputArray;
	delete EndPointMaxUserInputArray;
	delete EndPointAuthHashInputArray;
	delete EndPointPasswordInputArray;
	delete EndPointAdminPasswordInputArray;

	var str="<tr><td><table style=\"width:100%\">";
	MultiPointSpan.innerHTML=str;
	EndPointPathInputArray = new Array(NumOfStreams);
	EndPointMaxUserInputArray = new Array(NumOfStreams);
	EndPointAuthHashInputArray = new Array(NumOfStreams);
	EndPointPasswordInputArray = new Array(NumOfStreams);
	EndPointAdminPasswordInputArray = new Array(NumOfStreams);

	for(var i=0;i<NumOfStreams;i++) {
		var rindex=i+1;

		str+="<tr><td><fieldset style=\"width:inherit;\">";
		str+="<legend class=\"titlespan\">&nbsp;&nbsp;<b>Stream #"+rindex+"</b>&nbsp;&nbsp;</legend>";
		str+="<table><tr><td class=\"ConfigTableDescTD\">";

		var naid="EndPoint"+(rindex)+"PasswordInput";
		str+="Source Password</td><td><input size=\"20\" name=\""+naid+"\" id=\""+naid+"\"/><br/>";
		str+="</td></tr><tr><td class=\"ConfigTableDescTD\">";

		var naid="EndPoint"+(rindex)+"AdminInput";
		str+="Admin password</td><td><input size=\"20\" name=\""+naid+"\" id=\""+naid+"\"/><br/>";
		str+="</td></tr><tr><td class=\"ConfigTableDescTD\">";

		var naid="EndPoint"+(rindex)+"MaxUserInput";
		str+="Maximum listeners</td><td><input size=4 name=\""+naid+"\" id=\""+naid+"\"/><br/>";
		str+="</td></tr><tr><td class=\"ConfigTableDescTD\">";

		var naid="EndPoint"+(rindex)+"PathInput";
		str+="Listener Stream Path</td><td><input size=\"20\" name=\""+naid+"\" id=\""+naid+"\"/><br/>";
		str+="</td></tr><tr><td class=\"ConfigTableDescTD\">";

		var naid="EndPoint"+(rindex)+"AuthHashInput";
		str+="Stream Authhash</td><td><input maxlength=\"20\" size=\"20\" name=\""+naid+"\" id=\""+naid+"\"/><br/>";
		str+="</td></tr></table></fieldset></td></tr>";
	}

	str+="</td></tr></table>";
	MultiPointSpan.innerHTML=str;
	for(var i=0;i<NumOfStreams;i++) {
		var rindex=i+1;

		var naid;
		var vi;

		naid="EndPoint"+(rindex)+"PathInput";
		vi=$(naid);
		EndPointPathInputArray[i]=vi;
		vi.value="";
		GetObjCookie(vi);
		AETFC(vi,onEndPointGenericObjectChanged);

		naid="EndPoint"+(rindex)+"MaxUserInput";
		vi=$(naid);
		EndPointMaxUserInputArray[i]=vi;
		vi.value="";
		GetObjCookie(vi);
		AETFC(vi,onEndPointMaxUserObjectChanged);

		naid="EndPoint"+(rindex)+"AuthHashInput";
		vi=$(naid);
		EndPointAuthHashInputArray[i]=vi;
		GetObjCookie(vi);
		AETFC(vi,onEndPointGenericObjectChanged);

		naid="EndPoint"+(rindex)+"PasswordInput";
		vi=$(naid);
		EndPointPasswordInputArray[i]=vi;
		GetObjCookie(vi);
		AETFC(vi,onEndPointGenericObjectChanged);

		naid="EndPoint"+(rindex)+"AdminInput";
		vi=$(naid);
		EndPointAdminPasswordInputArray[i]=vi;
		GetObjCookie(vi);
		AETFC(vi,onEndPointGenericObjectChanged);
	}
	validateEndPointObjectChanges();
}

function HelpTextError(message) {
	var GenErrMess="Setup was unable to load the help database.";
	HelperTextDBKeysArray.push("");
	HelperTextDBValuesArray.push(GenErrMess+"<br/><br/>"+message+".");
	uht(HelperTextDBValuesArray);
}

function HelpTextOk(HelperXMLHTTP) {
	var rt="";
	try {
		rt=HelperXMLHTTP.responseText;
	}
	catch(e) {
		HelperTextDBKeysArray.push("");
		HelperTextDBValuesArray.push(GenErrMess+"<br/><br/>"+e);
		uht(HelperTextDBValuesArray);
		return;
	}

	if(rt=="") {
		HelpTextError("Empty database");
		return;
	}
	rt=rt.split("\n");

	for(var i=0;i<rt.length;i++) {
		var tts=rt[i];
		if(tts.indexOf(";")==0)continue;
		if(tts.indexOf("//")==0)continue;
		if(tts=="\r\n")continue;
		if(tts=="\n")continue;
		if(tts=="\r")continue;
		tts=tts.split(",");
		HelperTextDBKeysArray.push(tts.shift());
		HelperTextDBValuesArray.push(tts.join(","));
	}
}

function LoadHelpTextDB() {
	var HelperXMLHTTP;
	HelperTextDBKeysArray = new Array();
	HelperTextDBValuesArray = new Array();

	if(window.XDomainRequest) {
		HelperXMLHTTP=new XDomainRequest();
	}else if(window.XMLHttpRequest){
		HelperXMLHTTP=new XMLHttpRequest();
	}else{
		HelperXMLHTTP=new ActiveXObject("Microsoft.XMLHTTP");
	}

	if(HelperXMLHTTP==null || HelperXMLHTTP==undefined) {
		HelpTextError("AJAX API not supported in this browser");
		return;
	}

	HelperXMLHTTP.open("GET","setup.txt",true);
	if(window.XDomainRequest) {
		HelperXMLHTTP.onerror=function(){
			HelpTextError("Empty database");
		}
		HelperXMLHTTP.onload=function(){
			HelpTextOk(HelperXMLHTTP);
		};
	} else {
		HelperXMLHTTP.onreadystatechange=function(){
			if(HelperXMLHTTP.readyState == null || HelperXMLHTTP.readyState==4 && HelperXMLHTTP.status==200){
				HelpTextOk(HelperXMLHTTP);
			} else {
				if(HelperXMLHTTP.readyState == null || HelperXMLHTTP.readyState==4){
					HelpTextError("Empty database");
				}
			}
		};
	}
	HelperXMLHTTP.send(null);
}

function register(name, callback) {
	var input=$(name);
	AETFC(input,callback);
	return input;
}

function DoInit() {
	SetDefaults();

	HelperSpan=$("HelperSpan");
	MultiPointSpan=$("MultiPointSpan");

	Password = GetObjCookie(PasswordInput = register("password",onPasswordInputsChanged));
	AdminPassword = GetObjCookie(AdminPasswordInput = register("adminpassword",onPasswordInputsChanged));
	PortBase = GetObjCookie(PortBaseInput = register("portbase",onPortBaseInputChanged));
	MaxUser = GetObjCookie(MaxUserInput = register("maxuser",onMaxUserInputChanged));
	ConfigStreams = GetObjCookie(ConfigStreamsCheckBox = register("streams",onConfigStreamsButtonClicked));
	NumOfStreams = GetObjCookie(NumOfStreamsInput = register("num_streams",onStreamsTotalChanged));

	AETFC($("preview"),function(){});

	AETFC($("continue1b"),onContinueButtonClicked);
	AETFC($("exit1b"),onExitButtonClicked);
	AETFC($("prev2b"),onBackButtonClicked);
	AETFC($("continue2b"),onContinueButtonClicked);
	AETFC($("exit2b"),onExitButtonClicked);
	AETFC($("prev3b"),onBackButtonClicked);
	AETFC($("continue3b"),onContinueButtonClicked);
	AETFC($("exit3b"),onExitButtonClicked);
	AETFC($("reset"),onResetButtonClicked);

	changePage(2);
	onPasswordInputsChanged();
	onConfigStreamsButtonClicked();
	onStreamsTotalChanged(1);

	DoHelpUpdate(null);
}

function uht(t) {
	HelperSpan.innerHTML="<br/><div class='infh' align='center'>Help / Additional Information</div>"+t+"<br/><br/>";
}

function DoSpanHighlight(Highlight, Obj) {
	if(Highlight) {
		Obj.style.fontWeight = "bold";
		Obj.style.textDecoration = "underline";
	} else {
		Obj.style.textDecoration = Obj.style.fontWeight = "";
	}
}

function changePage(mode) {
	var y=$("page"+CurrentPage);
	DoObjShowHide(0, y);
	y=$("s"+CurrentPage);
	DoSpanHighlight(0, y);

	if (!mode) {
		var saved = (CurrentPage == 4); 
		if(confirm((saved ? "Are you sure you want to exit setup without starting the server?\nChoosing 'Ok' will close the server." : "Are you sure you want to exit setup before it is complete?\nChoosing 'Ok' will close the server."))){
			createCookie("LastPage",CurrentPage);
			CurrentPage = 1;
			createCookie("CurrentPage",CurrentPage);
			sendExit(saved);
			$('SetupSpan').style.display = "none";
			$('HelperSpan').style.display = "none";

			var y=$("page5");
			DoObjShowHide(1, y);
			return;
		}
	} else if (mode == 1) {
		createCookie("LastPage",CurrentPage);
		CurrentPage++;
		if(!ConfigStreams && CurrentPage == 2) CurrentPage++;
	} else if (mode == -1) {
			createCookie("LastPage",CurrentPage);
		CurrentPage--;
		if(!ConfigStreams && CurrentPage == 2) CurrentPage--;
	}

	if(mode != 3) {
		var y=$("page"+CurrentPage);
		DoObjShowHide(1, y);
		y=$("s"+CurrentPage);
		DoSpanHighlight(1, y);
		createCookie("CurrentPage",CurrentPage);
	}
}

window.onload=function() {
	LoadHelpTextDB();
	DoInit();
};

function sendConfigDetails() {
	if(window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	} else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("POST","config",true);
	xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
	xmlhttp.setRequestHeader("Content-length",output.length);
	xmlhttp.send(output);
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4){
			if(xmlhttp.status==200){
				$('results').innerHTML = "Successfully saved settings to the config file (sc_serv.conf).<br><br>Click '<b>Run Server</b>' to run the server with the specified settings or '<b>Exit</b>' to close this instance of the server (run without a configuration file to use the new settings).<br><br><input class=\"submit\" type=\"button\" value=\"Run Server\" id=\"runserver\"/>&nbsp;&nbsp;<input class=\"submit\" type=\"button\" value=\"Exit\" id=\"exit\"/>";
				AETFC($("exit"),onExitButtonClicked);
				AETFC($("runserver"),onRunServerButtonClicked);
			}
		}
	}
}

function sendExit(saved) {
	createCookie("LastPage",1);
	createCookie("CurrentPage",1);
	if(window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	} else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("POST","exit",true);
	xmlhttp.setRequestHeader("Content-length",4);
	xmlhttp.send("exit");
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4){
			if(xmlhttp.status==200 && saved){
				$('message').innerHTML = "The server has now been stopped and the settings were successfully saved into the configuration file (sc_serv.conf) before stopping the server.<br><br>You can re-run setup again if not happy with the settings or you can start the server normally (non-setup) with the server using the saved settings.";
			}
		}
	}
}

var timeout;
function counter() {
	clearInterval(timeout);
	if(window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	} else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET","http://127.0.0.1:"+PortBase+"/admin.cgi?sid=0&pass="+AdminPassword,true);
	xmlhttp.send(null);
	xmlhttp.ontimeout=xmlhttp.onabort=xmlhttp.onerror=function(){
		$('results').innerHTML = "There was an error changing the server from setup to broadcasting mode.<br>Attempted to open <a href=\"http://127.0.0.1:"+PortBase+"/admin.cgi?sid=0&pass="+AdminPassword+"\">http://127.0.0.1:"+PortBase+"/admin.cgi?sid=0</a> on the server.<br><br>Check the server is still running and if it is not then check the log file output.<br><br>You can close this window now as setup cannot recover from this issue.";
	}
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4){
			window.location="http://127.0.0.1:"+PortBase+"/admin.cgi?sid=0&pass="+AdminPassword;
		}
	}
}

function sendRun() {
	createCookie("CurrentPage",1);
	createCookie("LastPage",CurrentPage);
	if(window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	} else {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("POST","runserver",true);
	xmlhttp.setRequestHeader("Content-length",3);
	xmlhttp.send("run");
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4){
			if(xmlhttp.status==200){
				timeout = setInterval(counter,250);
			}
		}
	}
}