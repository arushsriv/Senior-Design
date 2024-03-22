document.getElementById("creditcardtab").addEventListener("click", openCity.bind("creditcard"));

document.getElementById("budgettab").addEventListener("click", openCity.bind("budget"));

function openCity(e) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(this).style.display = "block";

    // TODO not showing up color??
    e.currentTarget.className += " active";

    console.log("HIIII" + e.currentTarget.className)
}


