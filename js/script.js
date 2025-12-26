const audio = document.getElementById("audio");
const btnAudio = document.getElementById("btnAudio");
const btnEntrar = document.getElementById("btnEntrar");
const contenido = document.getElementById("contenido");
const login = document.getElementById("login");
const cards = document.querySelectorAll(".card");

let index = 0;

/* LOGIN */
btnEntrar.onclick = () => {
    if (document.getElementById("codigo").value === "amor") {
        login.style.display = "none";
        contenido.style.display = "block";
        iniciarAudio();
        actualizar(); 
    } else {
        document.getElementById("error").textContent = "❌ Contraseña incorrecta";
    }
};

/* AUDIO */
function iniciarAudio() {
    audio.currentTime = 0;
    audio.volume = 0;
    audio.play();
    btnAudio.textContent = "🔊";

    let v = 0;
    const fade = setInterval(() => {
        if (v < 0.6) {
            v += 0.02;
            audio.volume = v;
        } else clearInterval(fade);
    }, 100);
}

btnAudio.onclick = () => {
    if (audio.paused) {
        audio.play();
        btnAudio.textContent = "🔊";
    } else {
        audio.pause();
        btnAudio.textContent = "⏸️";
    }
};

/* CARRUSEL */

function actualizar() {
    cards.forEach(c => c.classList.remove("activa"));
    cards[index].classList.add("activa");

    const flow = cards[index].dataset.flow;
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    // primera card: no retroceder
    btnPrev.style.visibility = index === 0 ? "hidden" : "visible";

    // pregunta y finales: bloquear navegación
    if (flow === "pregunta" || flow.startsWith("final")) {
        btnPrev.style.display = "none";
        btnNext.style.display = "none";
    } else {
        btnPrev.style.display = "block";
        btnNext.style.display = "block";
    }
}


/* FUNCION RESPONDER */
function responder(esSi) {
    const actual = cards[index];
    actual.classList.add("saliendo-izq");

    setTimeout(() => {
        actual.classList.remove("activa", "saliendo-izq");

        const destino = document.querySelector(
            esSi ? '[data-flow="final-si"]' : '[data-flow="final-no"]'
        );

        index = Array.from(cards).indexOf(destino);
        cards[index].classList.add("activa");

        if (esSi) lanzarConfeti();
    }, 350);
}

function siguiente() {
    const flow = cards[index].dataset.flow;
    if (flow !== "historia") return;

    cards[index].classList.add("saliendo-izq");

    setTimeout(() => {
        cards[index].classList.remove("activa", "saliendo-izq");
        index = (index + 1) % cards.length;
        actualizar();
        efectoRomantico();
    }, 350);
}

function anterior() {
    const flow = cards[index].dataset.flow;
    if (flow !== "historia") return;

    cards[index].classList.add("saliendo-der");

    setTimeout(() => {
        cards[index].classList.remove("activa", "saliendo-der");
        index = (index - 1 + cards.length) % cards.length;
        actualizar();
        efectoRomantico();
    }, 350);
}

/*********
CONFETI
*********/
function lanzarConfeti() {
    const area = document.getElementById("confeti");
    area.style.display = "block";

    for (let i = 0; i < 80; i++) {
        let p = document.createElement("div");
        p.classList.add("particle");

        p.style.left = Math.random() * 100 + "%";
        p.style.top = Math.random() * -100 + "px"; // ← clave
        p.style.setProperty("--hue", Math.random() * 360);
        p.style.animationDuration = (Math.random() * 1.5 + 1.5) + "s";

        area.appendChild(p);
        setTimeout(() => p.remove(), 3000);
    }

    setTimeout(() => area.style.display = "none", 3200);
}

/*********
Efecto Romantico
*********/
function efectoRomantico() {
    const emojis = ["💖","✨","💕","🌙","💫"];
    const e = document.createElement("div");
    e.className = "corazon";
    e.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    e.style.left = Math.random() * 80 + 10 + "%";
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 3000);
}



/* FINAL */
function finalizar(ok) {
    document.getElementById("resultado").textContent = ok ? "😊" : "😢";
}

/* REINICIAR */
function reiniciar() {
    index = 0;
    actualizar();
    iniciarAudio();
}

/* SALIR */
function salir() {
    audio.pause();
    audio.currentTime = 0;
    contenido.style.display = "none";
    login.style.display = "block";
}

function salirConClave() {
    const clave = prompt("Clave para salir:");

    if (clave !== "salir") {
        alert("Clave incorrecta");
        return;
    }

    function mostrarSalir() {
        document.getElementById("contenido").style.display = "none";
        document.getElementById("salir").style.display = "block";
    }

    function validarSalida() {
        if (document.getElementById("codigoSalida").value === "tu_clave") {
            resetearTodo();
        } else {
            document.getElementById("errorSalida").innerText = "❌ Clave incorrecta";
        }
    }

    // reset total
    index = 0;
    actualizar();

    audio.pause();
    audio.currentTime = 0;

    document.getElementById("contenido").style.display = "none";
    document.getElementById("login").style.display = "block";
}


function resetearTodo() {
    index = 0;

    document.getElementById("salir").style.display = "none";
    document.getElementById("contenido").style.display = "none";
    document.getElementById("login").style.display = "block";

    document.getElementById("codigo").value = "";
    document.getElementById("codigoSalida").value = "";
    document.getElementById("error").innerText = "";
    document.getElementById("errorSalida").innerText = "";

    audio.currentTime = 0;
    audio.pause();

    actualizar();
}


actualizar();
