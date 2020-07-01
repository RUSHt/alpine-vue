import parsehtml from '@/utils/parsehtml.js';

export default function (html) {

    var model = parsehtml(html);

    return transformAtoV(model,document.createElement('div'),{})

}

const transitionMap = [
    [
     "x-transition:enter",
     "enter-active-class"
    ],
    [
     "x-transition:enter-start",
     "enter-class"
    ],
    [
     "x-transition:enter-end",
     "enter-to-class"
    ],
    [
     "x-transition:leave",
     "leave-active-class"
    ],
    [
     "x-transition:leave-start",
     "leave-class"
    ],
    [
     "x-transition:leave-end",
     "leave-to-class"
    ]
].reduce((p,l) => { p[l[0]] = l[1]; return p; },{})

const attMap = [
    [
        'x-show',
        'v-show'
    ]
].reduce((p,l) => { p[l[0]] = l[1]; return p; },{})

function transformAtoV(model,out,data) {
    
    var transition;
    var modelLength = model.length;

    for ( var i = 0; i < modelLength; i++ ) {

        var tag = model[i][0];
        var atts = model[i][1];
        var children = model[i][2];
        
        if ( tag != '#text' ) {
            if ( tag == 'SCRIPT' ) {
                var alpineSrc = atts.find(a => a[0] == 'src');
                if ( alpineSrc[1] == "https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.0.1/dist/alpine.js" ) { continue; }
            }
            
            if ( tag == 'svg' || out._svg ) {
                var d = document.createElementNS('http://www.ws.org/2000/svg',tag)
                d._svg = true;
            } else {
                var d = document.createElement(tag);
            }
            
            

            var attsLength = atts.length;
            for ( var j = 0; j < attsLength; j++ ) {
                var att = atts[j][0];
                if ( att == 'x-data' ) {
                    var xData = JSON.parse(atts[j][1].replace(/{ /g,'{ "').replace(/\: /g,'": ').replace(/'/g,'"'));
                    Object.keys(xData).forEach(key => data[key] = xData[key]);
                } else if ( transitionMap[att] ) {
                    if ( !transition ) {
                        transition = document.createElement('transition');
                        transition.appendChild(d);
                    }
                    transition.setAttribute(transitionMap[att],atts[j][1]);
                } else {
                    d.setAttribute(attMap[att] || att,atts[j][1]);
                }
                 
            }

            if ( transition ) {
                out.appendChild(transition);
            } else {
                out.appendChild(d);
            }

            transformAtoV(children,d,data);

        } else {
            
            if ( atts ) {    
            var d = document.createTextNode(atts);
                out.appendChild(d);
            }
            
        }    
    }
    return { dom: out, data: data };

}