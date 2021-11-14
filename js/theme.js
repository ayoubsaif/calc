var el = function(element) {
    if (element.charAt(0) === "#") {
      return document.querySelector(element);
    }
    return document.querySelectorAll(element);
};

// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
    console.log(this.getAttribute('data-theme'));
    if ( this.getAttribute('data-theme')) {
        setTheme(this.getAttribute('data-theme'));
    }
}

// Immediately invoked function to set the theme on initial load
(function () {
    if ( localStorage.getItem('theme') ){
        setTheme(localStorage.getItem('theme'));
    }
    //document.getElementById('slider').checked = false;
    
    var nums = el(".theme")
    
    for (var i = 0, l = nums.length; i < l; i++) {
        nums[i].addEventListener("change", toggleTheme, false); 
    }
})();

