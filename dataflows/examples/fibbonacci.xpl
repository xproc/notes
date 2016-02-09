xproc version = "2.0";

namespace my="http://www.example.org/steps";
output $result as xs:integer+;

step my:fibonacci($n as xs:integer) output ^results as xs:integer*;

my:fibboannci(10) ≫ $result

