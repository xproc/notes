class EventHandlerBase {
   reset() {
   }
   startNonterminal(name,start) {
      //console.log("start "+name+" "+start);
   }
   endNonterminal(name,start) {
      //console.log("end "+name+" "+start);
   }
   terminal(name,start,end) {
      //console.log("terminal "+name+" "+start+" "+end);
   }
   whitespace(start,end) {
      //console.log("ws '"+start+"' "+end);
   }
}

function setStatus(text) {
   var status = document.getElementById("status");
   status.innerHTML = "";
   status.appendChild(document.createTextNode(text));
}

document.addEventListener("DOMContentLoaded",function() {
   document.getElementById("parse").onclick = function() {
      console.log("Parsing:");
      var text = document.getElementById("xproc").value;
      console.log(text);
      var parser = new grammar(text,new EventHandlerBase());
      try {
         parser.parse_XProc();
         setStatus("Valid!");
      } catch (e) {
         if (e.getExpected) {
            setStatus(parser.getErrorMessage(e));
         } else {
            throw e;
         }
      }
   }
},false);
