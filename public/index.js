function submitFunction(){
   window.alert("Form Added Successfully");
}

function updateFunction(){
    window.alert("Form Updated Successfully");
}

var a = 0;
var A = setInterval(Anim, 10);
function Anim(){
    a = a+1;
    if(a==5){
        clearInterval(A);
    }else{
        var x = document.getElementById("modalbox");
        x.style.marginTop = a + '%';
        x.style.opacity = 1;
    }
}

function resetStudent(){
    window.alert('Reset Table');
}