var araclar = JSON.parse(localStorage.getItem("araclar")) || [];
var arsivler = JSON.parse(localStorage.getItem("arsiv")) || [];
var table;
let time;

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
          id: araclar.length,
          plaka: this.$content.find("#plaka").val(),
          marka: this.$content.find("#marka").val(),
          giris: dayjs().format("DD.MM.YYYY HH:mm:ss"),
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
  
  const _id = araclar.findIndex(function(obj){
    return obj.id == id
  });
  console.log("Aracın Index Karşılığı: "+_id);
  araclar.splice(_id, 1);
  var _giris = parseInt(
    JSON.parse(localStorage.getItem("araclar"))[_id].girisTarihi
  );
  const out = dayjs();
  const timeDifference = out.diff(_giris, "minute");
  araclar.ucret = Math.floor(timeDifference / 30) * 0.5;
  tutar = araclar.ucret;
  alert("Tutar: " + tutar + "₺");
  arsivler.push(JSON.parse(localStorage.getItem("araclar"))[_id]);
  localStorage.setItem("arsiv", JSON.stringify(arsivler));
  localStorage.setItem("araclar", JSON.stringify(araclar));
  refreshTableData(table, araclar);
  return araclar;
};

function DownloadJSON() {
  var json = localStorage.getItem("arsiv");

  json = [json];
  var blob1 = new Blob(json, { type: "text/plain;charset=utf-8" });


  var isIE = false || !!document.documentMode;
  if (isIE) {
    window.navigator.msSaveBlob(blob1, "Arsiv.txt");
  } else {
    var url = window.URL || window.webkitURL;
    link = url.createObjectURL(blob1);
    var a = $("<a />");
    a.attr("download", "arsiv.txt");
    a.attr("href", link);
    $("body").append(a);
    a[0].click();
    $("body").remove(a);
  }
};

function arsiviSil() {
  localStorage.setItem("arsiv", null);
}

sil = function (id) {
  const _id = araclar.findIndex(function(obj){
    return obj.id == id
  });
  console.log("Aracın Index Karşılığı: "+_id);
  araclar.splice(_id, 1);
  var __giris = parseInt(
    JSON.parse(localStorage.getItem("araclar"))[_id].girisTarihi
  );
  const outt = dayjs();
  const zamanFarki = outt.diff(__giris, "minute");

  if (zamanFarki > 30) {
    alert("30 dakikayı geçtikten sonra kayıtları silemezsiniz!");
  } else {
  arsivler.push(JSON.parse(localStorage.getItem("araclar"))[_id]);
  localStorage.setItem("araclar", JSON.stringify(araclar));
  refreshTableData(table, araclar);
  }
  return araclar;
};


$("#duzenle").confirm({
  title: "Düzenle",
  content:
    "" +
    '<form action="" class="aracFormu">' +
    `<div class="form-group" placeholder="${araclar.id}">` +
    "<label>Numara</label>" +
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
          if (_arac.id === id) {
            _arac = arac;
            arac.plaka = this.$content.find("#plaka").val();
            arac.marka = this.$content.find("#marka").val();
            localStorage.setItem("araclar", JSON.stringify(araclar));
            refreshTableData(table, araclar);
          }
        });
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



$("#button").click(function () {
  table.row(".selected").remove().draw(false);
});
table = $("#table").DataTable({
  data: araclar,
  dom: "Bfrtip",
  order: [[3, "desc"]],
  columns: [
  {
      title: "",
      data: null,
      render: function (data, type, full) {
        $("#checkbox").click(function (event) {
          if ($(":checkbox").attr("checked", true)) {
          } else {
            $(":checkbox").attr("checked", false);
          }
        });
        return `<input type="checkbox" id="checkbox">`;
      },
    },
    { title: "Plaka", data: "plaka" },
    { title: "Marka", data: "marka" },
    { title: "Giriş", data: "giris" },
    { title: "Çıkış", data: "cikis" },
    { title: "Tutar", data: "ucret" },
    {
      data: null,
      render: function (data, type, full) {
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
          `<button class="btn btn-danger delete-button" id="sil" onclick="sil(${data.id})"` +
          full[0] +
          ">" +
          "Sil" +
          "</button>"
        );
      },
    },
  ],
  buttons: [
    "pdf",
    "print",
  ],
  render: function (data, type, full, meta) {
    Utils.formatString(buttonTemplate, data);
  },
});