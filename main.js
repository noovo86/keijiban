var winheight = $(window).height();
function setcss(){
    $('#box').css('height',winheight);
    $('.outer').css('height',winheight/100*90);
    $('.outer').css('margin-top',winheight/100*5);
    $('.name').css('font-size',winheight/50);
    $('.body').css('font-size',winheight/50);
    $('.time').css('font-size',winheight/66);
    $('#name').css('font-size',winheight/50);
    $('#message').css('font-size',winheight/50);
    $('#send').css('font-size',winheight/50);
}

setcss();

window.onresize = function () {
    if(!navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/)){
        winheight = $(window).height();
        setcss();
    }
}

function namehoz(){
    let nameval;
    nameval =  document.getElementById("name").value;
    $.cookie('dasikei_name', nameval);
}

function strlink(str) {
    var regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;
    var regexp_makeLink = function(all, url, h, href) {
        return '<a href="h' + href + '" target="_blank">' + url + '</a>';
    }
    var textWithLink = str.replace(regexp_url, regexp_makeLink);
    return textWithLink;
}

let prename = $.cookie('dasikei_name');

if (prename != undefined) {
    document.getElementById("name").value = prename;
}else{
    $.cookie('dasikei_name', "");
}

// データベースの参照を準備
var firebaseRef = new Firebase(""); //FirebaseのURL
var messagesRef = firebaseRef.child('keijiban');

// 既存メッセージを表示
messagesRef.on('child_added', function(snapshot) {
    var msg = snapshot.val();

    var day = new Date(msg.time);
    var now = new Date();
    var termDay = Math.floor((now - day) / 86400000);

    if(termDay <= 30){
        var hyouji = "";
        var na = "匿名";
        if (msg.name == "") {
            na = "匿名"
        } else {
            na = msg.name
        }
        hyouji = "<div class='post'><p class='name'>" + na + "</p><p class='time'>" + msg.time + "</p><p class='body'>>" + strlink(msg.body) + "</p></div>"
        $("#posts").prepend(hyouji);
        setcss();
    }else{
        messagesRef.child(snapshot.key()).remove();
        console.log("deleted");
    }
});

function sendmes() {
    // 新規メッセージを投稿
    var DD = new Date();
    var Year = DD.getFullYear()
    var Month = DD.getMonth() + 1;
    var Day = DD.getDate();
    var Hours = DD.getHours();
    var Minutes = DD.getMinutes();
    if ((Minutes - Minutes % 10) / 10 < 1) {
        Minutes = "0" + String(Minutes);
    }
    if ($('#message').val() != "") {
        messagesRef.push({
            name: $('#name').val(),
            body: $('#message').val(),
            time: Year + "/" + Month + "/" + Day + " " + Hours + ":" + Minutes
        });
        document.getElementById("message").value = "";
    }
};