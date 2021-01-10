/* document.addEventListener("DOMContentLoaded", load, false);

function load() {
  var sort = new Sort("sdl-wrap");
  sort.init();
} */

//draggable list Sorting
var Sort = function(target_id) {
  var _mobile = mobileCheck();
  var wrap;
  var list;
  var draggable;
  var dragging;
  var drIdx;
  var tarIdx;
  var moveable = false;
  var listname = "sdl-list";
  var dr_listname = "sdl-draggable";
  var _scroll = document.body;

  var handle = {
    up: (_mobile) ? "touchend" : "mouseup",
    move: (_mobile) ? "touchmove" : "mousemove",
    down: (_mobile) ? "touchstart" : "mousedown"
  };

  this.setScroll = function(obj) {
    _scroll = obj;
  }

  this.setListname = function(str) {
    listname = str;
  }

  this.setdrListname = function(str) {
    dr_listname = str;
  }

  function set_e() {
    wrap = document.getElementById(target_id);
    list = wrap.getElementsByClassName(listname);
    draggable = wrap.getElementsByClassName(dr_listname);
    _mobile = mobileCheck();
    drIdx = null;

    wrap.setAttribute("sorting", "false");

    for (var i in draggable) {
      (function(i) {
        if (!isNaN(i)) {
          list[i].setAttribute("dragging", "false");
          list[i].setAttribute("drag_after", "false");
          
          // Listener on mousedown or touchstart for list items
          draggable[i].addEventListener(handle.down, function(e) {
            if (!moveable) return;
            window.addEventListener(handle.move, move);
            window.addEventListener(handle.up, up);
            var wrap_height = list.length * list[0].offsetHeight;
            var wrap_offset_from_top = wrap.getBoundingClientRect().top + window.scrollY;
            wrap.style.height = wrap_height + "px";
            e.preventDefault();
            if (_mobile && e.touches.length != 1) return;
            drIdx = Number(i);
            dragging = wrap.appendChild(list[drIdx].cloneNode(true));
            dragging.setAttribute("dragging", "true");
            list[i].style.display = "none";
            tarIdx = i;
            var y;
            if (_mobile) y = e.touches[0].pageY - (dragging.offsetHeight / 2);
            else y = e.pageY - (dragging.offsetHeight / 2);
            if (_scroll !== document.body) y += _scroll.scrollTop;
            y = y - wrap_offset_from_top;
            set_y(dragging, y);
            for (var j = drIdx; j < list.length; j++) {
              list[j].setAttribute("drag_after", "true");
            }
            setTimeout(function() {
              wrap.setAttribute("sorting", "true");
            }, 10);

          })
        }
      })(i);
    }
  }

  function move(e) {
    e.preventDefault();
    var y;
    var cy;
    var wrap_offset_from_top = wrap.getBoundingClientRect().top + window.scrollY;
    if (_mobile) {
      cy = e.touches[0].clientY;
      y = e.touches[0].pageY;
    } else {
      cy = e.clientY;
      y = e.pageY;
    }
    if (cy > window.innerHeight - dragging.offsetHeight) _scroll.scrollTop += 10;
    else if (cy < dragging.offsetHeight) _scroll.scrollTop -= 10;
    if (_scroll !== document.body) y += _scroll.scrollTop;
    y = y - wrap_offset_from_top;
    var adjust = -1;
    if (tarIdx < drIdx) adjust = 0;
    var ref_y = y - (dragging.offsetHeight / 2);
    set_y(dragging, ref_y);
    var rowIdx = Math.ceil(y / dragging.offsetHeight) + adjust;
    drIdx = (rowIdx < list.length) ? rowIdx : list.length - 1;
    drIdx = (drIdx < 0) ? 0 : drIdx;

    for (var j = 0; j < list.length; j++) {
      if (j < drIdx) list[j].setAttribute("drag_after", "false");
      else list[j].setAttribute("drag_after", "true");
    }
  }

  function up(e) {
    window.removeEventListener(handle.move, up);
    window.removeEventListener(handle.move, move);
    if (!moveable) return;
    else moveable = false;
    arr = [];
    dragging.setAttribute("fin", "true");
    setTimeout(function() {
      var adjust = 0;
      if (tarIdx < drIdx) adjust = -1;
      set_y(dragging, dragging.offsetHeight * (drIdx + adjust));
      setTimeout(function() {
        dragging.removeAttribute("fin");
        var f = false;
        for (var k = 0; k < list.length - 1; k++) {
          list[k].setAttribute("dragging", "false")
          list[k].setAttribute("drag_after", "false");
          if (k == drIdx) {
            list[list.length - 1].setAttribute("dragging", "false")
            list[list.length - 1].setAttribute("drag_after", "false");
            remove_y(list[list.length - 1]);
            arr.push(list[list.length - 1].cloneNode(true));
            f = true;
          }
          arr.push(list[k].cloneNode(true));
        }
        if (!f) {
          list[list.length - 1].setAttribute("dragging", "false")
          list[list.length - 1].setAttribute("drag_after", "false");
          remove_y(list[list.length - 1]);
          arr.push(list[list.length - 1].cloneNode(true));
          f = true;
        }
        wrap.innerHTML = "";
        for (k = 0; k < arr.length; k++) {
          if (arr[k].style.display != "none") wrap.appendChild(arr[k]);
        }
        init();
        wrap.style.height = "auto";
      }, 300)
    }, 10)
  }

  function init() {
    set_e();
    moveable = true;
  }
  this.init = init;

  function set_y(elem, y) {
    elem.style.transform = "translate3d(0, " + y + "px, 0)";
    elem.style.webkitTransform = "translate3d(0, " + y + "px, 0)";
  }

  function remove_y(elem) {
    elem.style.transform = "";
    elem.style.webkitTransform = "";
  }
  //---	for mobile drag | http://detectmobilebrowsers.com/	
  function mobileCheck() {
    var check = false;
    (function(a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }
}