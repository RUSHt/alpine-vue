<template>
    <div class="tailwinder-main">
        <header>
            <p @click="codeout = ''">Alpine</p>
            <p @click="newCodeIn">Vue</p>
        </header>
        <div class="container">
            <textarea class="in" spellcheck="false" v-model="codein"></textarea>
            <code v-if="codeout" class="out">{{ codeout }}</code>
        </div>
    </div>
</template>

<script>

import ConvertAlpineToVue from '@/utils/ConvertAlpineToVue.js'

import prettifyHtml from 'prettify-html';

export default {
    name: 'Tailwinder',
    components: {

    },
    data () {
        return {
            codein: '<p>Paste Alpine.js Here...</p>',
            codeout: '',
            code: '<p>Hello</p>',
            MEoptions: {

            }
        }
    },
    mounted () {

    },
    methods: {
        newCodeIn () {
            
            var content = ConvertAlpineToVue(this.codein);

            var HTMLContent = prettifyHtml(content.dom.children[0].innerHTML).split('\n').map(l => '  '+l).join('\n');

            this.codeout = '<template>\n'+HTMLContent+'\n</template>'

            if ( Object.keys(content.data).length > 0 ) {
                var json = JSON.stringify(content.data,null,6);
                    json = json.substring(0,json.length - 1)+'    }';
                this.codeout += '\n\n<script>\n\nexport default = {\n\n  data () {\n    return '+json+'\n  }\n}\n\n<\/script>';
            }

        },
        onChange ( event ) {
            console.log('onChange',event);
        }
    }
}

</script>

<style lang="scss">

.editor {
    width: 600px;
    height: 800px;
}    
* {
    margin: 0px;
    padding: 0px;
}    
.tailwinder-main {
    padding: 1rem;
    -webkit-font-smoothing: auto;
    display: inline-block;
    font-family: Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
    box-sizing: border-box;
    border: 2px solid #d2d6dc;
    color: black;
    line-height: 1.5;
    width: calc(100% - 20px);
    margin: 10px;
    height: calc(100% - 20px);
    header {
        > p { float: left; width: 90px; margin: 0px 5px; color: blue; text-decoration: underline; }
        div { 
            p {
                background-color: blue;
                color: white;
                padding: 10px;
                left: calc(50% - 134px);
                position: absolute;
                top: 15px;
                &:active { transform: translate(2px,2px) }
            }
        }
    }
    .container {
        position: relative;
    }
    textarea,code {
        width: calc(100% - 20px);
        float: left;
        border: 1px solid #d2d6dc;
        margin: 10px;
        margin-left: 0px;
        padding: 10px;
        height: calc(100vh - 120px);
        font-size: 0.7rem;
        white-space: pre;
        overflow-wrap: normal;
        overflow-x: scroll; 
        color: black;
        background-color: whitesmoke;
        font-family: Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
        &:focus { outline: 0; }
        &.out { position: absolute; left: 0px; top: 20px; height: calc(100vh - 116px); }
    }
}

</style>