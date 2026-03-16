// 1. Оголошуємо змінні
const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById("profile-login");
const logoutBtn = document.getElementById("end-session-btn");
const bookingsBtn = document.getElementById("header-bookings");
const profileBtn = document.getElementById("header-profile");
const formDiv = document.querySelector('.form-div');

// 2. Перевірка авторизації (працює добре)
window.addEventListener('load', async () => {
    try {
        const response = await fetch('/api/check-auth');
        if (!response.ok) return; // якщо сервер спить
        const data = await response.json();

        if (data.authenticated) {
            if (loginBtn) loginBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline";
            if (bookingsBtn) bookingsBtn.style.display = "inline";
            if (profileBtn) {
                profileBtn.style.display = "inline";
                profileBtn.innerText = "Профіль (" + data.name + ")";
            }
            if (formDiv) formDiv.style.display = 'none';
        } else {
            if (loginBtn) loginBtn.style.display = "inline";
            if (logoutBtn) logoutBtn.style.display = "none";
            if (bookingsBtn) bookingsBtn.style.display = "none";
            if (profileBtn) profileBtn.style.display = "none";
        }
    } catch (error) {
        console.error("Помилка перевірки сесії:", error);
    }
});

// 3. Обробка ЛОГІНА
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Зупиняємо відправку форми
        e.stopImmediatePropagation(); // Додатковий захист від перезавантаження

        const email = document.getElementById('login-mail').value;
        const password = document.getElementById('login-pass').value;

        const params = new URLSearchParams();
        params.append('loginEmail', email);
        params.append('loginPassword', password);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const result = await response.text();

            if (result === "success_user" || result === "success_admin") {
                alert("Привіт! Ви успішно увійшли.");
                window.location.href = "/index.html"; // Надійніше за reload
            } else {
                alert("Невірний логін або пароль!");
                // Сторінка НЕ має перезавантажуватись тут!
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Помилка з'єднання з сервером");
        }
    });
}
// 4. Обробка РЕЄСТРАЦІЇ
const registerForm = document.getElementById('register-form'); // Перевір, щоб ID в HTML був такий самий

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // ЦЕ ЗУПИНИТЬ появу даних в адресному рядку
        e.stopImmediatePropagation();

        // Беремо дані з твоїх інпутів реєстрації
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-mail').value;
        const password = document.getElementById('register-pass').value;

        const params = new URLSearchParams();
        params.append('regName', name);
        params.append('regEmail', email);
        params.append('regPassword', password);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const result = await response.text();

            if (result === "success_reg") {
                alert("Реєстрація успішна! Тепер ви можете увійти.");
                window.location.reload(); // Перезавантажуємо, щоб скинути форми
            } else if (result === "error_email_taken") {
                alert("Помилка: цей Email вже зареєстрований!");
            } else {
                alert("Помилка реєстрації. Спробуйте ще раз.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Помилка з'єднання з сервером при реєстрації");
        }
    });
}
// Знаходимо кнопку профілю (ти її вже оголосив як profileBtn)
profileBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const response = await fetch('/api/user/get-profile');
    if (response.ok) {
        const user = await response.json();

        // ПРЕДЗАПОВНЕННЯ: вставляємо дані з бази в поля input
        // Перевір, щоб ID твоїх інпутів були саме такі в HTML
        document.getElementById('profile-name').value = user.username || "";
        document.getElementById('profile-email').value = user.email || "";
        document.getElementById('profile-tel').value = user.phone || "";

        // Виводимо знижку в текст (якщо є такий елемент)
        const discountLabel = document.getElementById('discount');
        if (discountLabel) {
            discountLabel.innerText = "Ваша знижка: " + (user.discount || 0) + "%";
        }
    }
});

const saveProfileBtn = document.getElementById('profile-save-btn');

if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        // 1. Беремо НОВІ дані, які ввів користувач у поля
        const newName = document.getElementById('profile-name').value;
        const newPhone = document.getElementById('profile-tel').value;

        // 2. Готуємо параметри для відправки
        const params = new URLSearchParams();
        params.append('newName', newName);
        params.append('newPhone', newPhone);

        try {
            const response = await fetch('/api/user/update-profile', {
                method: 'POST',
                body: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const result = await response.text();

            if (result === "success_update") {
                alert("Дані успішно оновлено!");
                // Оновлюємо сторінку, щоб ім'я в хедері теж змінилося
                window.location.reload();
            } else {
                alert("Помилка при оновленні даних.");
            }
        } catch (error) {
            console.error("Помилка запиту:", error);
            alert("Не вдалося з'єднатися з сервером.");
        }
    });
}






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


pLogin.onclick = (e) => {
    e.stopPropagation(); 
    formDiv.style.display = "block";
};

document.addEventListener('click', (e) => {
    if (formDiv.style.display === "block" && !formDiv.contains(e.target)) {
        formDiv.style.display = 'none';
    }
});



const profileDiv = document.getElementsByClassName("prifile-div")[0];
const bookingsDiv = document.getElementsByClassName("bookings-div")[0];

bookingsBtn.onclick = (e)=>{
    e.stopPropagation();
    bookingsDiv.style.display = "block";
}
document.addEventListener('click', (e) => {
    if (bookingsDiv.style.display === "block" && !bookingsDiv.contains(e.target)) {
        bookingsDiv.style.display = 'none';
    }
});

profileBtn.onclick = (e)=>{
    e.stopPropagation();
    profileDiv.style.display = "block";
}
document.addEventListener('click', (e) => {
    if (profileDiv.style.display === "block" && !profileDiv.contains(e.target)) {
        profileDiv.style.display = 'none';
    }
});




const bookBtns = document.querySelectorAll('.book-btn');
const bookForm = document.querySelector('.booking-form-div');

bookBtns.forEach((btn) => {
  btn.onclick = (e) => {
    e.stopPropagation();
    bookForm.style.display = 'block';
  };
});
const bookingForm = document.getElementsByClassName("booking-form-div")[0];
document.addEventListener('click', (e) => {
    if (bookingForm.style.display === "block" && !bookingForm.contains(e.target)) {
        bookingForm.style.display = 'none';
    }
});


loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-mail').value;
    const password = document.getElementById('login-pass').value;

    const params = new URLSearchParams();

    params.append('loginEmail', email);
    params.append('loginPassword', password);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: params,
            headers: {

                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });


        if (response.ok) {
            if (response.url.includes("error")) {
                alert("Невірний логін або пароль");
            } else {
                alert("Вхід успішний!");
                window.location.href = response.url;
            }
        } else {
            alert("Помилка сервера: " + response.status);
        }
    } catch (error) {
        console.error("Помилка запиту:", error);
    }
});

