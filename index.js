var araclar = JSON.parse(localStorage.getItem("araclar")) || [];
var table;

$("#yeniArac").confirm({
  title: "Yeni Araç",
  content:
    "" +
    '<form action="" class="formName">' +
    '<div class="form-group">' +
    "<label>Lütfen plakayı buraya giriniz</label>" +
    '<input type="text" id="plaka" placeholder="Plaka" class="name form-control" required />' +
    "</div>" +
    "<label>Lütfen araç markasını buraya giriniz</label>" +
    '<input type="text" id="marka" placeholder="Marka" class="name form-control" required />' +
    "</div>" +
    "</form>",
  buttons: {
    formSubmit: {
      text: "Araç Ekle",
      btnClass: "btn-success",
      action: function () {
        const data = {
          id: araclar.length + 1,
          plaka: this.$content.find("#plaka").val(),
          marka: this.$content.find("#marka").val(),
          giris: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          girisTarihi: new Date().getTime(),
          cikis: "",
          ucret: 0.0 + "₺",
        };

        if (checkPlakaExists(araclar, data.plaka)) {
          alert(data.plaka + " plakalı araç zaten otoparkımızdadır.");
        } else {
          araclar.push(data);
          localStorage.setItem("araclar", JSON.stringify(araclar));
          refreshTableData(table, araclar);
        }

        if (!plaka) {
          $.alert("provide a valid name");
          return false;
        }
      },
    },
    kapat: function () {},
  },
  onContentReady: function () {
    var jc = this;
    this.$content.find("form").on("submit", function (e) {
      e.preventDefault();
      jc.$$formSubmit.trigger("click");
    });
  },
});

checkPlakaExists = function (araclar, plaka) {
  let plakaExists = false;

  araclar.forEach((arac) => {
    if (arac.plaka === plaka) {
      plakaExists = true;
    }
  });

  return plakaExists;
};

refreshTableData = function (dt, data) {
  if (!data) {
    data = dt.data();
  }

  dt.clear();
  dt.rows.add(data).draw();
};

cikisYap = function (id) {
  console.log(id);
  araclar = araclar.filter((arac) => arac.id != id);
  let giris = dayjs(araclar.girisTarihi);
  console.log("giris: " + giris);
  let out = dayjs();
  console.log("out" + out);
  const timeDifference = out.diff(giris, "minute");
  console.log(timeDifference + " dakika");
  araclar.ucret = timeDifference * 0.5;
  tutar = araclar.ucret;
  alert("Tutar: " + tutar + "₺");
  console.log("ucret=" + araclar.ucret);
  console.log(araclar);
  // localStorage.setItem("araclar", JSON.stringify(araclar)); // ücret hesaplanacak
  refreshTableData(table, araclar);
  return araclar;
};

sil = function (id) {
  setTimeout(butonuGizle, 2000);
  //30 dakika = 1800000
  function butonuGizle() {
    table.buttons("#sil").nodes().addClass("hidden");
    console.log(id);
    araclar = araclar.filter((arac) => arac.id != id);
    console.log(araclar);
    localStorage.setItem("araclar", JSON.stringify(araclar));
    refreshTableData(table, araclar);
  }
  return araclar;
};

// window.setInterval(veriGuncelle,500); // veriyi güncel tutmak için sürekli güncelleme
function veriGuncelle() {
  localStorage.setItem("araclar", JSON.stringify(araclar));
  refreshTableData(table, araclar);
}

$("#duzenle").confirm({
  title: "Düzenle",
  content:
    "" +
    '<form action="" class="aracFormu">' +
    '<div class="form-group">' +
    "<label>Plaka</label>" +
    `<input type="text" id="plaka" class="name form-control" required />` +
    "</div>" +
    "<label>Lütfen araç markasını buraya giriniz</label>" +
    `<input type="text" id="marka" class="name form-control" required />` +
    "</div>" +
    "</form>",
  buttons: {
    formSubmit: {
      text: "Düzenle",
      btnClass: "btn-success",
      action: function (id, arac) {
        araclar.forEach((_arac) => {
          if(_arac.id === id) {
            _arac = arac;
            arac.plaka = this.$content.find("#plaka").val();
            arac.marka = this.$content.find("#marka").val();
            localStorage.setItem("araclar", JSON.stringify(araclar));
            refreshTableData(table,araclar);

          }
        })

      },
    },
    kapat: function () {},
  },
  onContentReady: function () {
    var jc = this;
    this.$content.find("form").on("submit", function (e) {
      e.preventDefault();
      jc.$$formSubmit.trigger("click");
    });
  },
});

table = $("#table").DataTable({
  data: araclar.reverse(),
  dom: "Bfrtip",
  order: [[2, "desc"]],
  columns: [
    { title: "Plaka", data: "plaka" },
    { title: "Marka", data: "marka" },
    { title: "Giriş", data: "giris" },
    { title: "Çıkış", data: "cikis" },
    { title: "Tutar", data: "ucret" },
    {
      data: null,
      render: function (data, type, full) {
        console.log(full, "full");
        console.log(data, "data");
        return (
          `<button class="btn btn-warning" id="cikisYap" onclick="cikisYap(${data.id})"` +
          full[0] +
          ">" +
          "Çıkış" +
          "</button>"
        );
      },
    },
    {
      data: null,
      render: function (data, type, full) {
        return (
          `<button class="btn btn-info" id="duzenle" onclick="${data.id}, ${data.arac}" ` +
          full[0] +
          ">" +
          "Düzenle" +
          "</button>"
        );
      },
    },
    {
      data: null,
      render: function (data, type, full) {
        return (
          `<button class="btn btn-danger" id="sil" onclick="sil(${data.id})"` +
          full[0] +
          ">" +
          "Sil" +
          "</button>"
        );
      },
    },
  ],

  buttons: ["pdf", "print"],
  render: function (data, type, full, meta) {
     Utils.formatString(buttonTemplate, data)
   }
});

anlıkTarih = function () {
  var tarih = new Date().toLocaleString("tr-TR");
  setInterval(anlıkTarih, 1000);
  return tarih;
};
