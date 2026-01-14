const buszMegallo = {
  megallok: [
    { nev: "Szeged, Mars tér (Szent Rókus tér)", pluszPerc: 0 },
    { nev: "Mars tér (aut. áll.)", pluszPerc: 1 },
    { nev: "Bartók tér", pluszPerc: 2 },
    { nev: "Széchenyi tér", pluszPerc: 4 },
    { nev: "Szeged, Torontál tér", pluszPerc: 7 },
    { nev: "Újszeged, Gabonakutató", pluszPerc: 8 },
    { nev: "Alsó kikötő sor", pluszPerc: 10 },
    { nev: "Hatházak", pluszPerc: 11 },
    { nev: "Szeged, Akácfa utca", pluszPerc: 12 },
    { nev: "Füvészkert", pluszPerc: 13 }
  ],
  indulasiIdok: [
    "6:45","7:15","7:45","8:45","9:45","10:45","11:45",
    "12:45","13:15","13:45","14:15","14:45","15:15",
    "15:45","16:15","16:45","17:15","17:45","18:15",
    "18:45","19:15","19:45","20:45","21:45","22:45"
  ]
};

function idoHozzaadas(alapIdo, pluszPerc) {
  const [ora, perc] = alapIdo.split(":").map(Number);
  const d = new Date();
  d.setHours(ora, perc + pluszPerc, 0);
  return d.toTimeString().slice(0, 5);
}

function tablazat() {
  const tbody = document.getElementById("tablaTest");
  tbody.innerHTML = "";

  buszMegallo.megallok.forEach((m, index) => {
    let sor = "<tr><td>" + m.nev + "</td>";

    buszMegallo.indulasiIdok.forEach(ido => {
      sor += "<td>" + idoHozzaadas(ido, m.pluszPerc) + "</td>";
    });

    sor += `
      <td>
        <button class="modosit" data-index="${index}">✏️</button>
        <button class="torol" data-index="${index}">🗑️</button>
      </td>
    </tr>`;

    tbody.innerHTML += sor;
  });

  
  document.querySelectorAll(".modosit").forEach(btn => {
    btn.onclick = () => {
      const i = Number(btn.dataset.index);
      const uj = prompt("Új +perc:", buszMegallo.megallok[i].pluszPerc);
      if (uj === null || isNaN(uj)) return;
      buszMegallo.megallok[i].pluszPerc = Number(uj);

      buszMegallo.megallok.sort((a,b) => a.pluszPerc - b.pluszPerc);

      tablazat();
    };
  });

  document.querySelectorAll(".torol").forEach(btn => {
    btn.onclick = () => {
      const i = Number(btn.dataset.index);
      if (confirm("Biztosan törlöd?")) {
        buszMegallo.megallok.splice(i, 1);
        tablazat();
      }
    };
  });
}


document.getElementById("hozzaad").onclick = () => {
  const nev = ujNev.value.trim();
  const perc = Number(ujPerc.value);

  if (!nev) return alert("Add meg a nevet!");

  for (let m of buszMegallo.megallok) {
    if (m.nev.toLowerCase() === nev.toLowerCase()) {
      return alert("Ilyen megálló már van!");
    }
  }

  const ujMegallo = {
    nev,
    pluszPerc: isNaN(perc) ? 0 : perc
  };

  let sorrend = false;

  for (let i = 0; i < buszMegallo.megallok.length; i++) {
    if (ujMegallo.pluszPerc < buszMegallo.megallok[i].pluszPerc) {
      buszMegallo.megallok.splice(i, 0, ujMegallo);
      sorrend = true;
      break;
    }
  }

  if (!sorrend) {
    buszMegallo.megallok.push(ujMegallo);
  }

  ujNev.value = "";
  ujPerc.value = "";

  tablazat();
};

tablazat();