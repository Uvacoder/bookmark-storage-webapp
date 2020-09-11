import {NotificationDialog, Dialog_OkCancel, Dialog_GenericNotification, DialogFormBuilder} from "/static/dialogs.js";

/** @brief Performs Http POST request to some endpoint. 
 *  @param {string} url         - Http request (REST API) endpoint 
 *  @param {string} crfs_token  - Django CRFSS token from global variable (generated_token)
 *  @param {object} data        - HTTP request body, aka payload  
 */
async function ajax_post(url, crfs_token, data)
{

    var payload = JSON.stringify(data);

    const resp = await fetch(url, {
          method:  'POST'
        , headers: {    'Content-Type':     'application/json'
                      , 'X-Requested-With': 'XMLHttpRequest'
                      , 'X-CSRFToken':      crfs_token 
                   }
        , body: payload
    });
    return resp.json();
}

async function ajax_get(url, crfs_token, data)
{

    var payload = JSON.stringify(data);

    const resp = await fetch(url, {
          method:  'GET'
        , headers: {    'Content-Type':     'application/json'
                      , 'X-Requested-With': 'XMLHttpRequest'
                      , 'X-CSRFToken':      crfs_token 
                   }});
    return resp.json();
}

/** Reload current page. (same as hit F5 in the web browser) */
function dom_page_refresh()
{
    location.reload();
}


/** Wrapper function to document.querySelectorAll, but returns array instead of NodeList. 
 * 
 */
function dom_querySelectorAll(css_selector)
{
    return Array.prototype.slice.call(document.querySelectorAll(css_selector));
}

function dom_onClicked(css_selector, callback)
{
    var elem = document.querySelector(css_selector);

    if(!elem) { 
        console.warn(` dom_onClicked() => CSS selector ${css_selector} not found.`); 
    }
    if(elem){        
        elem.addEventListener("click", callback);
    }
}

/* Insert HTML code fragment to some DOM element. 
 *  
 *  Usage example: 
 * 
 *     var anchor = document.querySelector("#element-dom-id");
 *     var div = dom_insert_html(anchor, `<div> <h1>Title</h1> <button>My button</button></div>`);   
 ******************************************************************/
function dom_insert_html(anchor_element, html)
{
    var el = document.createElement("template");
    el.innerHTML = html;
    var elem = el.content.firstChild;
    anchor_element.appendChild(elem);
    return elem;
}


function DOM_select(selector)
{
    return document.querySelector(selector);
}

// Toggle DOM element 
function DOM_toggle(m)
{
    if(m == null){ alert(" Error: element not found");  }
    var d = m.style.display;
    var v = window.getComputedStyle(m);

    // if(m.style.visibility == "" || m.style.visibility == "visible")
    if(v.visibility == "visible")
    {
        console.log(" [TRACE] => Hide element");
        m.style.visibility = "hidden";
        m.style.display = "none";
    } else {
        console.log(" [TRACE] => Show element");
        m.style.visibility = "visible";
        m.style.display = "block";
    }        
} /* -- End of - DOM_toggle() --- */


// Set visibility of DOM element 
function DOM_set_visibility(m, flag)
{
    if(m == null){ alert(" Error: element not found");  }
    var d = m.style.display;
    var v = window.getComputedStyle(m);
    // if(m.style.visibility == "" || m.style.visibility == "visible")
    if(flag == true)
    {
        console.log(" [TRACE] => Hide element");
        m.style.visibility = "hidden";
        m.style.display = "none";
    } else {
        console.log(" [TRACE] => Show element");
        m.style.visibility = "visible";
        m.style.display = "block";
    }        
} /* -- End of - DOM_toggle() --- */


// Boolean flag ('true' or 'false') stored in html5
// local storage API. It is useful for storing non critical 
// user preference data on client-side. 
function LocalStorageFlag(name, value)
{
    this.name = name;
    this._dummy = (function() {
        var q = localStorage.getItem(name);
        if(q == null || q == "undefined" ){
            localStorage.setItem(name, value);
        }
    }());

    this.get     = () => {
        var result = localStorage.getItem(this.name);
        if(result == "undefined") { 
            this.set(false);
            return false;            
        }
        return JSON.parse(result) || false;
    };
    this.set     = (value) => localStorage.setItem(this.name, value);
    this.toggle  = ()      => { this.set(!this.get()); return this.get(); }
};



function LocalStorageString(name, value)
{
    this.name = name;
    this._dummy = (function() {
        var q = localStorage.getItem(name);
        if(q == null || q == "undefined" ){
            localStorage.setItem(name, value);
        }
    }());

    this.get = ( default_value ) => {
        var result = localStorage.getItem(this.name);
        if(result == "undefined") { 
            this.set(default_value);
            return default_value;            
        }
        return result;
    };
    this.set = (value) => localStorage.setItem(this.name, value);    
};



// ---- Executed after document (DOM objects) is loaded ---------- //

let flagItemDetailsVisible = new LocalStorageFlag("itemsTableVisible", true);


function set_theme(mode)
{
    var root = document.documentElement;

    if(mode == "dark_mode")
    {           
        root.style.setProperty("--main-background-color", "#3c3c3c");
        root.style.setProperty("--foreground-color",      "white");
        root.style.setProperty("--item-background-color", "#2f2f2f");
        root.style.setProperty("--hyperlink-color",       "lightskyblue");
        
        root.style.setProperty("--right-row-label-color", "black");
        root.style.setProperty("--left-row-label-color", "#1b1b1b");

        root.style.setProperty("--btn-primary-bgcolor", "#007bff");
    }

    if(mode == "light_mode")
    {
        root.style.setProperty("--main-background-color", "lightgray");
        root.style.setProperty("--foreground-color",      "black");
        root.style.setProperty("--item-background-color", "ligthblue");
        root.style.setProperty("--hyperlink-color",       "darkblue");
        
        root.style.setProperty("--right-row-label-color", "#bdb3b3");
        root.style.setProperty("--left-row-label-color", "#82c5bc");

        root.style.setProperty("--btn-primary-bgcolor", "black");
    }
}


let site_theme = new LocalStorageString("site_theme");

function selection_changed(mode)
{
    var mode = this.value;
    set_theme(mode);
    site_theme.set(mode);
}


const ACTION_RESTORE     = "RESTORE";
const ACTION_DELETE      = "DELETE";
const ACTION_ADD_STARRED = "ADD_STARRED";
const ACTION_REM_STARRED = "REM_STARRED";

function get_selected_items_for_bulk_operation()
{
    // Get ID of selected bookmarks 
    return dom_querySelectorAll(".bulk-checkbox")
                            .filter(x => x.checked)
                            .map(x => parseInt(x.id));
}

async function ajax_perform_bulk_operation(action)
{
    var crfs_token = window["generated_token"];
    console.log(" [TRACE] Current token = ", crfs_token);

    var selected_items = get_selected_items_for_bulk_operation();
    
    console.log(" selected items = ", selected_items);

    var payload = {                  
        action:   action 
      , items:    selected_items
    };

    var resp = await ajax_post("/api/bulk", crfs_token, payload);
    console.log("Response = ",  resp);

    //return resp;
    // Reload current page 
    location.reload();
}


//----------------------------------------------//
//    D I A L O G S                             // 
//----------------------------------------------//

let dialog_notify = new NotificationDialog();

// Callback executed after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    console.trace(" [TRACE] Starting DOM initialization. OK. ");

    dialog_notify.attach_body();
    dialog_notify.id = "dialog-notify";
    // dialog_notify.notify("Page created Ok", 900);

    var flag = flagItemDetailsVisible.get();
    var obs = document.querySelectorAll(".item-details");
    obs.forEach(x => DOM_set_visibility(x, flag));    
    
    // set_keyboard_indicator(flagKeyboardShortcut.get());

/*     var q = document.querySelector("#div-keyboard-status");
    if(isMobileDevice()){ DOM_toggle(q); }
 */
    var elem_item_detail = document.querySelector("#item-details");
     

    var theme_selection_box = document.querySelector("#theme-selector-box");
    theme_selection_box.onchange = selection_changed;

    var theme = site_theme.get("dark_mode");
    set_theme(theme);

    if(theme == "dark_mode") theme_selection_box.selectedIndex = 0;
    if(theme == "light_mode") theme_selection_box.selectedIndex = 1;

    var body = document.body;

    var dialog = dom_insert_html(body, `
        <dialog class="dialog-bulk-action"> 
            <div>
                <button id="btn-bulk-add-starred"> Add items to starred items</button> 
                </br> 
                <button id="btn-bulk-rem-starred"> Remove items from starred items</button> 
                </br> 
                <button id="btn-bulk-delete">  Delete items</button>          
                </br> 
                <button id="btn-bulk-restore"> Restore items</button>         
                </br>             
                <button id="btn-bulk-add-to-collection">Add items to collection</button>         
                <select id="selector-collection-add">
                    <option value="-1">New collection</option>
                </select>
            </div>
            <button id="btn-dialog-close">Close</button> 
        </dialog>
    `.trim());

    var btn = dialog.querySelector("#btn-dialog-close");
    btn.addEventListener("click", () => dialog.close() );

    dom_onClicked("#btn-bulk-actions",     () => dialog.showModal() );
    dom_onClicked("#btn-bulk-add-starred", () => ajax_perform_bulk_operation(ACTION_ADD_STARRED) );
    dom_onClicked("#btn-bulk-rem-starred", () => ajax_perform_bulk_operation(ACTION_REM_STARRED) );
    dom_onClicked("#btn-bulk-delete",      () => ajax_perform_bulk_operation(ACTION_DELETE) );
    dom_onClicked("#btn-bulk-restore",     () => ajax_perform_bulk_operation(ACTION_RESTORE) );

    var selectbox  = dialog.querySelector("#selector-collection-add");
    var crfs_token = window["generated_token"];
    
    // Fill selection box with all user collections 
    ajax_get("/api/collections", crfs_token).then( colls => {
        for(let n  in colls){
            var opt   = document.createElement("option");
            // console.log(" row = ", colls[n]);
            opt.text  = colls[n]["title"];
            opt.value = colls[n]["id"];
            selectbox.add(opt, -1);    
        }
        
        console.log(" [TRACE] collections = ", colls);
    });

    const ACTION_COLLECTION_ADD = "ADD";
    const ACTION_COLLECTION_NEW = "NEW";
    
    dom_onClicked("#btn-bulk-add-to-collection", () => {
        var items = get_selected_items_for_bulk_operation();
        var selectionbox = document.querySelector("#selector-collection-add");
        var collectionID = selectionbox[selectionbox.selectedIndex]["value"];

        console.log(" items = ", items);
        console.log(" collection = ", collectionID);

        var payload = {
             items:        items
            ,collectionID: collectionID
            ,action:       ACTION_COLLECTION_ADD
        };

        var crfs_token = window["generated_token"];
        ajax_post("/api/collections", crfs_token, payload).then( res => {
            console.log(" Response = ", res);
        });
    });

    let dialog_CreateCollection = new DialogFormBuilder();
    dialog_CreateCollection.attach_body();
    dialog_CreateCollection.setTitle("Create new collection");
    dialog_CreateCollection.setText("Enter the following informations:");

    var input_title       = dialog_CreateCollection.add_row_input("Title:");
    var input_description = dialog_CreateCollection.add_row_input("Description:");

    dialog_CreateCollection.onSubmit( (is_ok) => {        
        if(!is_ok) return;
 
        var p = ajax_post("/api/collections/new", window["generated_token"], {
              title: input_title.value 
            , description: input_description.value
        });

        p.then( res => {
            if(res["result"] == "OK"){
                dialog_notify.notify("Bookmark added successfuly");
                location.reload();
            } else {
                dialog_notify.notify("Error: bookmark already exists");
            }
    
        })
    });

    dom_onClicked("#btn-create-new-collection", () => { 
        // alert(" Clicked at create new collection Ok. ");
        dialog_CreateCollection.show();
    });

    let dialog_collection_delete = new Dialog_OkCancel();
    dialog_collection_delete.setTitle("Delete collection");
    dialog_collection_delete.attach_body();
    
    window["collection_delete"] = (collection_id, collection_title) => {
        dialog_collection_delete.setText(`Are you sure you want to delete the collection: '${collection_title}' `)
        dialog_collection_delete.show();
        dialog_collection_delete.onSubmit( flag => {
            if(!flag) return;

            var p = ajax_post("/api/collections/del", window["generated_token"], { "collection_id": collection_id });

            p.then( res => {
                if(res["result"] == "OK"){
                    dialog_notify.notify("Bookmark added successfuly");
                    location.reload();
                } else {
                    dialog_notify.notify("Error: bookmark already exists");
                }
            });

        });
    };

});


function toggle_sidebar()
{
    var s = DOM_select(".sidebar");
    DOM_toggle(s);
}

// Allows accessing this variable from html templates 
window["toggle_sidebar"] = toggle_sidebar;

function toggle_items_table_info()
{
    flagItemDetailsVisible.toggle();
    var flag = flagItemDetailsVisible.get();
    var obs = document.querySelectorAll(".item-details");
    obs.forEach(x => DOM_set_visibility(x, flag));    
}

window["toggle_items_table_info"] = toggle_items_table_info;

function toggle_action_menu(actionID)
{
    var elem = document.querySelector(actionID);
    DOM_toggle(elem);
}
window["toggle_action_menu"] = toggle_action_menu;

function open_url_newtab(url)
{
    var win = window.open(url, '_blank');
    win.focus();
}

function api_item_add(crfs_token)
{
    var url = prompt("Enter the URL to add:", "");
    if(url == null) return;

    var query_params = new URLSearchParams(window.location.search);
    if(query_params.get("filter") == "collection")
    {
        console.trace(" [TRACE] Add item to collection")

        var collection_id = query_params.get("A0");
        var data = { url: url, collection_id: collection_id };

        var token = window["generated_token"];
        ajax_post("/api/collections/add_item", token, data).then( res => {
            if(res["result"] == "OK"){
                dialog_notify.notify("Bookmark added successfuly", 2000);
                location.reload();
            } else {
                dialog_notify.notify("Error: bookmark already exists", 2000);
            }
    
        }).catch(err => { 
            dialog_notify.notify(" Error: " + err)
        });

        return;
    }


    var payload = {url: url};
    ajax_post("/api/item", crfs_token, payload).then( res => {
        if(res["result"] == "OK"){
            dialog_notify.notify("Bookmark added successfuly", 2000);
            location.reload();
        } else {
            dialog_notify.notify("Error: bookmark already exists", 2000);
        }

    });
}

window["api_item_add"] = api_item_add;


class YoutubeThumb extends HTMLElement {
    constructor() {
        super()
        this.attachShadow( { mode: 'open' } )            
    }

    connectedCallback() {
        var video = this.getAttribute("video");
        console.log("VIDEO = ", video);
        this.shadowRoot.innerHTML = `
            <style>
                .youtube-embed {
                    visibiity: visible;
                    /* background-color: gray; */
                    width:  500px;
                    height: auto;
                    display: block;
                }

                span {
                    color: black;
                    font-size: 14pt;
                    font-weight: 500%;
                }

                img {
                    width:  60%;
                    height: auto;
                }

            </style>

            <div class="youtube-embed">                 
                 <a href="https://www.youtube.com/watch?v=${video}" target="_blank"> 
                   <img src="https://img.youtube.com/vi/${video}/sddefault.jpg" />                             
                 </a>
            </div>
            `;                                               
    }
}
customElements.define('youtube-thumb', YoutubeThumb);