// Translate markdown to html.
function getHTML(data) {
    var html = marked(data);
    document.getElementById("md2html").innerHTML = html;
}
// Get data from github api.
function parseJson(datas) {
    for (var i=0; i<datas.length; i++) {
        if (datas[i]["name"] == "VideoInTheaterMode") {
            $.get("https://raw.githubusercontent.com/a73013110/VideoInTheaterMode/" + datas[i]["default_branch"] + "/README.md", function(data){ getHTML(data); });
            break
        }
    }
}            
$.getJSON('https://api.github.com/users/a73013110/repos', {}, function(data){ parseJson(data) })