contract SetCoordinates{
    /* Constructor */
    string s1;
    string s2;
    string s3;
    string s4;
    string s5;
    function set1(string sec) {
        s1 = sec;
    }
    function set2(string sec) {
        s2 = sec;
    }
    function set3(string sec) {
        s3 = sec;
    }
    function set4(string sec) {
        s4 = sec;
    }
    function set5(string sec) {
        s5 = sec;
    }
    function gets1() constant returns (string) {
        return s1;
    }
    function gets2() constant returns (string) {
        return s2;
    }
    function gets3() constant returns (string) {
        return s3;
    }
    function gets4() constant returns (string) {
        return s4;
    }
    function gets5() constant returns (string) {
        return s5;
    }
}
