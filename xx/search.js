function search(){
	$("#main").hide();
	$.ajax({
        type: "get",
        dataType: "jsonp",
        url: "http://pi.exm233.com:8081/count/count.php",
        async: true,
    })
	SearchTerm();
}
//查询学年学期信息
function SearchTerm() {
	var arr_term = new Array();
    $.ajax({
        type: "get",
        dataType: "jsonp",
        jsonp: "jsoncallback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        url: "http://125.223.252.16/WCF/StudentService/Student.svc/SearchTerm?encrypt=" + getCookie("AUTH"),
        async: true,
        success: function (dataterm) {
            var dataObjdataterm = eval("(" + dataterm + ")"); //转换为json对象
            if (dataObjdataterm.sys_tag != null) {
                if (dataObjdataterm.sys_tag == -1) { //无权限
                    alert("无权限");
                } else {
                    alert(dataObjdataterm.sys_message); //失败
                }
            }
            else {
                if (dataObjdataterm.length > 0) {
                    for (var i = 0; i < dataObjdataterm.length; i++) {
                    	arr_term.push(dataObjdataterm[i].TermNo);
                    }
                    SearchScoreInfoCollection(arr_term)
                }
            }
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("数据处理失败，请稍后重试！");
        }
    });
}

//查询成绩信息
function SearchScoreInfoCollection(arr_term) {
	var arr_score = new Array();
	var count = 0;
	for (var i = 0; i < arr_term.length; i++) {
		TermNo = arr_term[i];
	    $.ajax({
	        type: "get",
	        dataType: "jsonp",
	        jsonp: "jsoncallback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
	        url: "http://125.223.252.16/WCF/StudentService/Student.svc/SearchScoreInfoCollection?encrypt=" + getCookie("AUTH")
	        + "&&TermNo=" + TermNo,
	        async: true,
	        success: function (data) {
	            var dataObj = eval("(" + data + ")"); //转换为json对象
	            if (dataObj.sys_tag != null) {
	                if (dataObj.sys_tag == -1) {//无权限
	                    alert(无权限);
	                }
	                else {
	                    alert(dataObj.sys_message); //失败
	                }
	            }
	            else {
	                if (dataObj.length > 0) {
	                	arr_score.push.apply(arr_score,dataObj);
	                }
	            }
	            count++;
	            get_xx(count,arr_term,arr_score);
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	            alert("数据处理失败，请稍后重试！");
	        }
	    });
	}
    
}

function get_xx(count,arr_term,arr_score){
	if(count == arr_term.length){
		var arr_xx = new Array();
		var xx_score = 0;
		for(var i = 0; i < arr_score.length; i++){
			if (arr_score[i].CourseKind == "选修" && arr_score[i].LessonType == "公共选修课") {
				arr_xx.push(arr_score[i]);
				if(arr_score[i].AuditState == 3){
		        	xx_score += arr_score[i].CreditHour;
		        }
			}
		}
		show(xx_score,arr_xx);
	}
}

function getAuditState(id){
	if (id == 1) {
        return '<td class="text-center">未审核</td>';
    }else if (id == 2) {
        return '<td class="text-center">未通过</td>';
    }else if (id == 3) {
        return '<td class="text-center">通过</td>';
    }else{
        return '<td class="text-center">错误</td>';
    }
}

function show(xx_score,arr_xx) {
	$("#name").append(getCookie("NAME"));
	$("#score").append(xx_score);
	for(var i = 0; i < arr_xx.length; i++){
		var str = 
		'<tr>' +
		'<td class="text-center">' + arr_xx[i].CourseInfoName + '</td>' +
		getAuditState(arr_xx[i].AuditState) +
		'<td class="text-center">' + arr_xx[i].CreditHour + '</td>' +
		'<td class="text-center">' + arr_xx[i].TermExpress + '</td>' +
		'</tr>';
		$("#tbody").append(str);
	}
	$("#loading").hide();
	$("#main").show();
}
