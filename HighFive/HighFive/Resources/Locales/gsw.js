H5.merge(new System.Globalization.CultureInfo("gsw", true), {
    englishName: "Swiss German",
    nativeName: "Schwiizertüütsch",

    numberFormat: H5.merge(new System.Globalization.NumberFormatInfo(), {
        nanSymbol: "NaN",
        negativeSign: "-",
        positiveSign: "+",
        negativeInfinitySymbol: "-∞",
        positiveInfinitySymbol: "∞",
        percentSymbol: "%",
        percentGroupSizes: [3],
        percentDecimalDigits: 2,
        percentDecimalSeparator: ".",
        percentGroupSeparator: "’",
        percentPositivePattern: 0,
        percentNegativePattern: 0,
        currencySymbol: "CHF",
        currencyGroupSizes: [3],
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ".",
        currencyGroupSeparator: "’",
        currencyNegativePattern: 8,
        currencyPositivePattern: 3,
        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: ".",
        numberGroupSeparator: "’",
        numberNegativePattern: 1
    }),

    dateTimeFormat: H5.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["Su.","Mä.","Zi.","Mi.","Du.","Fr.","Sa."],
        abbreviatedMonthGenitiveNames: ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez",""],
        abbreviatedMonthNames: ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez",""],
        amDesignator: "v.m.",
        dateSeparator: ".",
        dayNames: ["Sunntig","Määntig","Ziischtig","Mittwuch","Dunschtig","Friitig","Samschtig"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dddd, d. MMMM yyyy HH:mm:ss",
        longDatePattern: "dddd, d. MMMM yyyy",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "d. MMMM",
        monthGenitiveNames: ["Januar","Februar","März","April","Mai","Juni","Juli","Auguscht","Septämber","Oktoober","Novämber","Dezämber",""],
        monthNames: ["Januar","Februar","März","April","Mai","Juni","Juli","Auguscht","Septämber","Oktoober","Novämber","Dezämber",""],
        pmDesignator: "n.m.",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd.MM.yyyy",
        shortestDayNames: ["Su.","Mä.","Zi.","Mi.","Du.","Fr.","Sa."],
        shortTimePattern: "HH:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM yyyy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 1252,
        CultureName: "gsw-CH",
        EBCDICCodePage: 20297,
        IsRightToLeft: false,
        LCID: 4096,
        listSeparator: ";",
        MacCodePage: 10000,
        OEMCodePage: 850,
        IsReadOnly: true
    })
});
