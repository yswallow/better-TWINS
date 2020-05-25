
// define methods
function getPostURL(onclick) {
    var elem = onclick.split("'")
    url = "https://twins.tsukuba.ac.jp/campusweb/campussquare.do?_flowId=KJW0001100-flow&_campus_new_portal=true&_action_id=displayPortletRequest"+`&keijitype=${elem[1]}&genrecd=${elem[3]}&seqNo=${elem[5]}`;
    return url;
}

function updateInformation(node, url) {
    fetch(url).then( (res)=>{
        return res.text()
    }).then( (txt)=>{ 
        parser = new DOMParser();
        return parser.parseFromString(txt, "text/html");
    }).then( (page)=>{
        xpath_result = page.evaluate("//td[@class='keiji-title']/span", page, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        title = xpath_result.snapshotItem(0).innerText;
        node.innerText = title;
        
        body = page.getElementsByClassName("keiji-naiyo")[0];
        node.parentElement.appendChild(body);
    });
}

function appendEventListener() {
    var result = document.evaluate("//ul[@class='keiji-list']/li/a[@onclick]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for(i=0; i<result.snapshotLength; i++) {
        node=result.snapshotItem(i);
        if(node.getAttribute("class")!="right") {
            node.setAttribute("onmouseover", "updateInformation(this, getPostURL(this.getAttribute('onclick'))); this.removeAttribute('onmouseover');");
        }
    }
}

exportFunction(appendEventListener, window, {defineAs: 'appendEventListener'});
exportFunction(updateInformation, window, {defineAs: 'updateInformation'});
exportFunction(getPostURL, window, {defineAs: 'getPostURL'});

// put stylesheet
var st = document.createElement("style");
st.innerHTML = "div#keiji-portlet>ul>li>ul>li>div.keiji-naiyo { background: floralwhite; }";
document.body.appendChild(st);
// append onmouseover in document
var menu = document.getElementById("tabmenu-ul");
var sugar = document.createElement("li");
var button = document.createElement("button");
button.innerText = "BetterTWINS";
button.onclick = ()=>{ 
    appendEventListener();
    this.removeEventListener('click');
}
sugar.appendChild(button);
menu.appendChild(sugar);


