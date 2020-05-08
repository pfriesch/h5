Bridge.merge(new System.Globalization.CultureInfo("id-ID", true), {
    englishName: "Indonesian (Indonesia)",
    nativeName: "Indonesia (Indonesia)",

    numberFormat: Bridge.merge(new System.Globalization.NumberFormatInfo(), {
        nanSymbol: "NaN",
        negativeSign: "-",
        positiveSign: "+",
        negativeInfinitySymbol: "-∞",
        positiveInfinitySymbol: "∞",
        percentSymbol: "%",
        percentGroupSizes: [3],
        percentDecimalDigits: 2,
        percentDecimalSeparator: ",",
        percentGroupSeparator: ".",
        percentPositivePattern: 1,
        percentNegativePattern: 1,
        currencySymbol: "Rp",
        currencyGroupSizes: [3],
        currencyDecimalDigits: 0,
        currencyDecimalSeparator: ",",
        currencyGroupSeparator: ".",
        currencyNegativePattern: 1,
        currencyPositivePattern: 0,
        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: ",",
        numberGroupSeparator: ".",
        numberNegativePattern: 1
    }),

    dateTimeFormat: Bridge.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["Min","Sen","Sel","Rab","Kam","Jum","Sab"],
        abbreviatedMonthGenitiveNames: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des",""],
        abbreviatedMonthNames: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des",""],
        amDesignator: "AM",
        dateSeparator: "/",
        dayNames: ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],
        firstDayOfWeek: 0,
        fullDateTimePattern: "dddd, dd MMMM yyyy HH.mm.ss",
        longDatePattern: "dddd, dd MMMM yyyy",
        longTimePattern: "HH.mm.ss",
        monthDayPattern: "d MMMM",
        monthGenitiveNames: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember",""],
        monthNames: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember",""],
        pmDesignator: "PM",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd/MM/yyyy",
        shortestDayNames: ["Min","Sen","Sel","Rab","Kam","Jum","Sab"],
        shortTimePattern: "HH.mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ".",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM yyyy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: Bridge.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 1252,
        CultureName: "id-ID",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 1057,
        listSeparator: ";",
        MacCodePage: 10000,
        OEMCodePage: 850,
        IsReadOnly: true
    })
});
