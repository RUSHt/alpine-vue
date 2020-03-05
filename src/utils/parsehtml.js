export default function(html) {
    var div = document.createElement('div');
        div.innerHTML = html;
        return parse(div,[]);
}

function parse(ele,output) {
    var c;
    var isTag  = ele instanceof HTMLElement;
    if ( isTag ) {
        output.push(c = [ele.tagName,[],[]])
        var atts = ele.getAttributeNames();
        for ( var i = 0; i < atts.length; i ++ ) {
            var name = atts[i];
            if ( name.startsWith('@') ) name = 'v-on:'+name.substring(1,name.length);
            if ( name.startsWith(':') ) name = 'v-bind:'+name.substring(1,name.length);
            c[1].push([name,ele.getAttribute(atts[i])]);
        }
        var childNodes = ele.childNodes;
        for ( var j = 0; j < childNodes.length; j++ ) {
            parse(childNodes[j],c[2])
        }
    } else { 
        ele.wholeText && output.push(['#text',ele.wholeText,[]]) 
    }
    return output; 
}