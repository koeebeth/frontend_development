const UserSearch = {
  data: {},

  async searchWithName(name) {
    if (!name || typeof name !== "string") {
      throw new Error("Name is missing or empty !");
    }

    if (!new RegExp(/^([a-zA-Z0-9_ÇçĞğıİıÖöŞşÜü-]+)$/).test(name)) {
      throw new Error("Regex doesnt match with given name");
    }

    this.data.name = name;

    // code ...

    // Kullanıcı dashboard kısmında search butonu olacak orada name e göre arama yapacak.
    // istenilen format "Veli" yani bir isim olacak bu formatta backende istek atılacak. Atılacak yer /search
    // HTTP isteği POST ile olacak;
  },

  async searchWithDate(date) {
    const date = new Date(date);

    if (!date instanceof Date && isNaN(date)) {
      throw new Error("Date is empty or missing !");
    }

    this.data.date = date;

    // code ...

    // Kullanıcı dashboard kısmında search butonu olacak orada date e göre arama yapacak.
    // istenilen format "2017-06-29 17:54:04" olacak bu formatta backende istek atılacak. Atılacak yer /search
    // HTTP isteği POST ile olacak;
  },
  async searchWithDescOrAsc(sort) {
    const SORT = {
      asc: "asc",
      desc: "desc",
    };

    sort = sort.trim().toLowerCase();

    if (!sort || typeof sort !== "string") {
      throw new Error("Sort is empty or missing");
    }

    if (sort !== SORT.asc || sort !== SORT.desc) {
      throw new Error("Sort value must be asc or desc");
    }

    this.data.sort = sort;

    // code ...
  },

  // Kullanıcı dashboard kısmında search butonu olacak orada artan azalana  göre arama yapacak.
  // Yani artan dediğimiz zaman ASC bu gelen datayı A dan başlayıp Z ye göre sıralayacak.
  // DESC diyince ise tam tersi olacak.!
  // HTTP isteği POST ile olacak;


  // Kullanıcı search butonuna bastığı zaman Eğer sort date veya isim var ise bunlar tek bir objede birleştirilecek ve
  // backende istek atılacak daha sonra gelen data parse edilip dashboardda yansıtılacak.
};
