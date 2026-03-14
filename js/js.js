/*----------------------------------page 5--------------*/
const moreTrBtn = document.getElementById("more-tr-btn");
const gallery = document.getElementsByClassName("grid-photos")[0];

let k = 1;
const formats = ["png","jpg","jpeg","webp"];

moreTrBtn.addEventListener("click" , ()=>{

    for(let i = k; i < k + 4; i++) {

        let img = document.createElement("img");
        let formatIndex = 0;

        function tryNextFormat(){

            if(formatIndex >= formats.length){
                img.remove();
                return;
            }

            img.src = `photos/gallery/fishph${i}.${formats[formatIndex]}`;
            formatIndex++;
        }

        img.onerror = tryNextFormat;

        tryNextFormat();
        gallery.appendChild(img);
    }

    k += 4;
});

/*----------------------------------page changer--------------*/
const links = document.querySelectorAll(".mid-header a");
const pages = document.querySelectorAll("[class^='page']");

links.forEach((link, index) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        pages.forEach(page => page.style.display = "none");
        links.forEach(l => l.style.color = "black");

        const page = document.querySelector(".page" + (index + 1));
        if(page){
            page.style.display = "block";
        }

        link.style.color = "var(--dark-green)";
    });
});
/*----------------------------------login\register form --------------*/
const loginForm = document.getElementById("login-form");
const regForm = document.getElementById("register-form");
const loginLink = document.getElementById("login-link");
const regLink = document.getElementById("register-link");
loginLink.addEventListener("click",()=>{

    regForm.style.display = "none";
    loginForm.style.display = "flex";
    
})
regLink.addEventListener("click",()=>{

    loginForm.style.display = "none";
    regForm.style.display = "flex";
})
/*----------------------------------login\register form password hide\show --------------*/
const loginEye = document.getElementById("login-eye");
const loginPass = document.getElementById("login-pass");

loginEye.addEventListener("click", () => {
    if(loginPass.type === "password") {
        loginPass.type = "text";
        loginEye.classList.remove("closed");
    } else {
        loginPass.type = "password";
        loginEye.classList.add("closed");
    }
});

const regEye = document.getElementById("reg-eye");
const regPass = document.getElementById("register-pass");
regEye.addEventListener("click", () => {
    if(regPass.type === "password") {
        regPass.type = "text";
        regEye.classList.remove("closed");
    } else {
        regPass.type = "password";
        regEye.classList.add("closed");
    }
});

/*----------------------------------profile menu --------------*/
const pLogin = document.getElementById("profile-login");
const formDiv = document.getElementsByClassName("form-div")[0];

pLogin.onclick = (e) => {
    e.stopPropagation(); 
    formDiv.style.display = "block";
};

document.addEventListener('click', (e) => {
    if (formDiv.style.display === "block" && !formDiv.contains(e.target)) {
        formDiv.style.display = 'none';
    }
});
