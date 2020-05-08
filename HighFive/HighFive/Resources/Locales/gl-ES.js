H5.merge(new System.Globalization.CultureInfo("gl-ES", true), {
    englishName: "Galician (Galician)",
    nativeName: "galego (galego)",

    numberFormat: H5.merge(new System.Globalization.NumberFormatInfo(), {
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
        percentPositivePattern: 0,
        percentNegativePattern: 0,
        currencySymbol: "€",
        currencyGroupSizes: [3],
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ",",
        currencyGroupSeparator: ".",
        currencyNegativePattern: 8,
        currencyPositivePattern: 3,
        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: ",",
        numberGroupSeparator: ".",
        numberNegativePattern: 1
    }),

    dateTimeFormat: H5.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["dom.","luns","mar.","mér.","xov.","ven.","sáb."],
        abbreviatedMonthGenitiveNames: ["xan.","feb.","mar.","abr.","maio","xuño","xul.","ago.","set.","out.","nov.","dec.",""],
        abbreviatedMonthNames: ["Xan.","Feb.","Mar.","Abr.","Maio","Xuño","Xul.","Ago.","Set.","Out.","Nov.","Dec.",""],
        amDesignator: "a.m.",
        dateSeparator: "/",
        dayNames: ["domingo","luns","martes","mércores","xoves","venres","sábado"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dddd, d 'de' MMMM 'de' yyyy HH:mm:ss",
        longDatePattern: "dddd, d 'de' MMMM 'de' yyyy",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "d 'de' MMMM",
        monthGenitiveNames: ["xaneiro","febreiro","marzo","abril","maio","xuño","xullo","agosto","setembro","outubro","novembro","decembro",""],
        monthNames: ["Xaneiro","Febreiro","Marzo","Abril","Maio","Xuño","Xullo","Agosto","Setembro","Outubro","Novembro","Decembro",""],
        pmDesignator: "p.m.",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd/MM/yyyy",
        shortestDayNames: ["dom.","luns","mar.","mér.","xov.","ven.","sáb."],
        shortTimePattern: "HH:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM 'de' yyyy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 1252,
        CultureName: "gl-ES",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 1110,
        listSeparator: ";",
        MacCodePage: 10000,
        OEMCodePage: 850,
        IsReadOnly: true
    })
});
