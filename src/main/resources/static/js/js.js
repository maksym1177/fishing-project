const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById("profile-login");
const logoutBtn = document.getElementById("end-session-btn");
const bookingsBtn = document.getElementById("header-bookings");
const profileBtn = document.getElementById("header-profile");
const bookingBtn = document.getElementById("booking-form-btn");
const formDiv = document.querySelector('.form-div');
let isLogined = false;
let isAdmin = false;
//----------------------------AUTH CHECK-----------------------
window.addEventListener('load', async () => {
    try {
        const response = await fetch('/api/check-auth');
        if (!response.ok) return;
        const data = await response.json();
        isAdmin = data.isAdmin;
        if (isAdmin){
        document.querySelectorAll(".non-admin").forEach((na) => {
            na.style.display = "none";
        });
        document.getElementsByClassName("admin-bookings")[0].style.display = "block";

        loadAdminBookings();

        async function loadAdminBookings() {
            try {
                const response = await fetch('/api/admin/bookings/active');
                if (!response.ok) return;

                const bookings = await response.json();
                const container = document.querySelector('.admin-bookings');

                const title = container.querySelector('h1');
                container.innerHTML = '';
                if (title) container.appendChild(title);

                bookings.forEach(booking => {
                    const loc = booking.location;
                    let typeName = "Послуга";

                    if (loc && loc.type) {
                        switch(loc.type) {
                            case "al8": typeName = "Альтанка на 8чол"; break;
                            case "al12": typeName = "Альтанка на 12чол"; break;
                            case "fish_spot": typeName = "Місце для рибалки"; break;
                            default: typeName = "Невідома послуга";
                        }
                    }
                    const html = `
                        <div id = "admin-delete-${booking.id}" class="admin-booking-div">
                            <div>
                                <h2>Тип Бронювання</h2>
                                <p class="admin-booking-type">${typeName}</p>
                            </div>
                            <div>
                                <h2>Дата бронювання</h2>
                                <p class="admin-booking-date">${new Date(booking.date).toLocaleDateString('uk-UA')}</p>
                            </div>
                            <div>
                                <h2>Email</h2>
                                <p class="admin-booking-email">${booking.guestEmail || 'не вказано'}</p>
                            </div>
                            <div>
                                <h2>Номер телефону</h2>
                                <p class="admin-booking-phone">${booking.guestPhone || 'не вказано'}</p>
                            </div>

                            <button class="admin-cansel-booking" onclick="adminCancelBooking(${booking.id})">Відмінити</button>
                        </div>`;
                    container.insertAdjacentHTML('beforeend', html);
                });

            } catch (err) {
                console.error("Помилка:", err);
            }
        }
        }
        if (data.authenticated) {
            if (loginBtn) loginBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline";
            if (bookingsBtn) bookingsBtn.style.display = "inline";
            isLogined = true;
            if (profileBtn) {
                profileBtn.style.display = "inline";
                profileBtn.innerText = "Профіль (" + data.name + ")";
            }
            if (formDiv) formDiv.style.display = 'none';
        } else {
            isLogined = false;
            if (loginBtn) loginBtn.style.display = "inline";
            if (logoutBtn) logoutBtn.style.display = "none";
            if (bookingsBtn) bookingsBtn.style.display = "none";
            if (profileBtn) profileBtn.style.display = "none";
        }
    } catch (error) {
        console.error("Помилка перевірки сесії:", error);
    }
});



async function adminCancelBooking(id) {
    console.log("ID для видалення:", id);
    console.log("Повний URL:", `/api/bookings/cancel/${id}`);
    if (!id || !confirm("Ви впевнені, що хочете скасувати це бронювання?")) return;
    try {
        const response = await fetch(`/api/bookings/cancel/${id}`, {
            method: 'DELETE'
        });
        const result = await response.text();
        if (result === "success_deleted" || response.ok) {
            alert("Бронювання скасовано.");
            document.getElementById(`admin-delete-${id}`).remove();
        } else {
            alert("Помилка при видаленні: " + result);
        }
    } catch (error) {
        console.error("Помилка мережі:", error);
    }
}




//-----------------------------LOGINIZATION-------------------
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

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
                window.location.href = "/index.html";
            } else {
                alert("Невірний логін або пароль!");

            }
        } catch (error) {
            console.error("Error:", error);
            alert("Помилка з'єднання з сервером");
        }
    });
}
// ----------------------REGISTRATION-------------------------------------
const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();


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
                window.location.reload();
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

//------------------------------BOOKING------------------------------------
document.getElementById('booking-form-btn').addEventListener('click', async function (e) {
    e.preventDefault();


    const selectedType = document.querySelector('input[name="rad"]:checked');
    const dateInput = document.getElementById('booking-date');

    if (!selectedType) {
        alert("Будь ласка, оберіть тип послуги!");
        return;
    }
    if (!dateInput.value) {
        alert("Будь ласка, оберіть дату!");
        return;
    }


    const params = new URLSearchParams();
    params.append('type', selectedType.value);
    params.append('date', dateInput.value);

    params.append('guestName', document.getElementById('booking-name').value);
    params.append('guestEmail', document.getElementById('booking-email').value);
    params.append('guestPhone', document.getElementById('booking-tel').value);


    try {
        const response = await fetch('/api/create-booking', {
            method: 'POST',
            body: params
        });

        const result = await response.text();

        if (result === "success_booking") {
            alert("Успішно заброньовано! Чекаємо на вас.");
            location.reload();
        } else if (result === "error_no_vacancy") {
            alert("На жаль, на цю дату всі альтанки цього типу вже зайняті.");
        } else if (result === "error_auth") {
            alert("Будь ласка, спочатку увійдіть в акаунт.");
        } else {
            alert("Помилка: " + result);
        }
    } catch (error) {
        console.error("Помилка мережі:", error);
        alert("Не вдалося з'єднатися з сервером.");
    }
});


//---------------------------Bookings Load-------------------------------

async function loadMyBookings() {
    const container = document.querySelector('.bookings-div');
    if (!container) return;

    try {
        const response = await fetch('/api/user/my-bookings');

        if (!response.ok) {
            if (isLogined) container.innerHTML = '<h1>Помилка завантаження</h1>';
            return;
        }

        const bookings = await response.json();
        container.innerHTML = '<h1>Історія бронювань</h1>';

        if (!bookings || bookings.length === 0) {
            container.innerHTML += '<p style="padding:20px;">У вас ще немає бронювань.</p>';
            return;
        }

        bookings.forEach(booking => {
            const loc = booking.location;
            let typeName = "Послуга";

            if (loc && loc.type) {
                // ВАЖЛИВО: Назви в case мають точно збігатися з текстом у базі
                switch(loc.type.trim()) {
                    case "al8": typeName = "Альтанка на 8чол"; break;
                    case "al12": typeName = "Альтанка на 12чол"; break;
                    case "fish_spot": typeName = "Місце для рибалки"; break;
                    default: typeName = "Локація: " + loc.type;
                }
            }

            const bookingHtml = `
                <div class="booking-div">
                    <div>
                        <h2>Тип Бронювання</h2>
                        <p class="booking-type">${typeName}</p>
                    </div>
                    <div>
                        <h2>Дата бронювання</h2>
                        <p class="booking-date">${booking.date}</p>
                    </div>
                    <button class="cansel-booking" onclick="cancelBooking(${booking.id})">Відмінити</button>
                </div>
            `;
            container.innerHTML += bookingHtml;
        });

    } catch (error) {
        console.error("Помилка завантаження бронювань:", error);
    }
}
document.addEventListener('DOMContentLoaded', loadMyBookings);



//-------------------------------------Booking Canselation--------------------------------------
async function cancelBooking(id) {
    if (!confirm("Ви впевнені, що хочете скасувати це бронювання?")) return;

    try {
        const response = await fetch(`/api/bookings/cancel/${id}`, {
            method: 'DELETE'
        });

        const result = await response.text();

        if (result === "success_deleted") {
            alert("Бронювання скасовано.");
            loadMyBookings();
        } else {
            alert("Помилка при видаленні.");
        }
    } catch (error) {
        console.error(error);
    }
}



profileBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const response = await fetch('/api/user/get-profile');
    if (response.ok) {
        const user = await response.json();

        document.getElementById('profile-name').value = user.username || "";
        document.getElementById('profile-email').value = user.email || "";
        document.getElementById('profile-tel').value = user.phone || "";

        const discountLabel = document.getElementById('discount');
        if (discountLabel) {
            discountLabel.innerText = "Ваша знижка: " + (user.discount || 0) + "%";
        }
    }
});

const saveProfileBtn = document.getElementById('profile-save-btn');
if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {

        const newName = document.getElementById('profile-name').value;
        const newPhone = document.getElementById('profile-tel').value;

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
const bookBtns = document.querySelectorAll('.book-btn');
bookBtns.forEach((btn)=>{
btn.addEventListener('click', async (e) => {
        e.preventDefault();

        const response = await fetch('/api/user/get-profile');
        if (response.ok) {
            const user = await response.json();

            document.getElementById('booking-name').value = user.username || "";
            document.getElementById('booking-email').value = user.email || "";
            document.getElementById('booking-tel').value = user.phone || "";
        }
    })
});

/*----------------------------------profile menu --------------*/

const pLogin = document.getElementById('profile-login');
const profileDiv = document.getElementsByClassName('prifile-div')[0];
const bookingsDiv = document.getElementsByClassName('bookings-div')[0];
const bookForm = document.querySelector('.booking-form-div');


const toggleDisplay = (element, show = true) => {
    if (element) element.style.display = show ? 'block' : 'none';
};


const setupTrigger = (btn, target) => {
    if (btn && target) {
        btn.onclick = (e) => {
            e.stopPropagation();
            toggleDisplay(target, true);
        };
    }
};

setupTrigger(pLogin, formDiv);
setupTrigger(bookingsBtn, bookingsDiv);
setupTrigger(profileBtn, profileDiv);
bookBtns.forEach(btn => setupTrigger(btn, bookForm));
//test
document.addEventListener('click', (e) => {
    const modals = [formDiv, profileDiv, bookingsDiv, bookForm];
    
    modals.forEach(modal => {
        if (modal && modal.style.display === 'block' && !modal.contains(e.target)) {
            toggleDisplay(modal, false);
        }
    });
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

