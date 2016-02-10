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

document.addEventListener("DOMContentLoaded",function() {
   document.getElementById("parse").onclick = function() {
      console.log("Parsing:");
      var text = document.getElementById("xproc").value;
      console.log(text);
      var parser = new grammar(text,new EventHandlerBase());
      try {
         parser.parse_XProc();
      } catch (e) {
         if (e.getExpected) {
            console.log(parser.getErrorMessage(e));
         } else {
            throw e;
         }
      }
   }
},false);
