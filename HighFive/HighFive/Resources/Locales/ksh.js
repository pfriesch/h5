H5.merge(new System.Globalization.CultureInfo("ksh", true), {
    englishName: "Colognian",
    nativeName: "Kölsch",

    numberFormat: H5.merge(new System.Globalization.NumberFormatInfo(), {
        nanSymbol: "¤¤¤",
        negativeSign: "-",
        positiveSign: "+",
        negativeInfinitySymbol: "-∞",
        positiveInfinitySymbol: "∞",
        percentSymbol: "%",
        percentGroupSizes: [3],
        percentDecimalDigits: 2,
        percentDecimalSeparator: ",",
        percentGroupSeparator: " ",
        percentPositivePattern: 0,
        percentNegativePattern: 0,
        currencySymbol: "€",
        currencyGroupSizes: [3],
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ",",
        currencyGroupSeparator: " ",
        currencyNegativePattern: 8,
        currencyPositivePattern: 3,
        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: ",",
        numberGroupSeparator: " ",
        numberNegativePattern: 1
    }),

    dateTimeFormat: H5.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["Su.","Mo.","Di.","Me.","Du.","Fr.","Sa."],
        abbreviatedMonthGenitiveNames: ["Jan","Fäb","Mäz","Apr","Mai","Jun","Jul","Ouj","Säp","Okt","Nov","Dez",""],
        abbreviatedMonthNames: ["Jan.","Fäb.","Mäz.","Apr.","Mai","Jun.","Jul.","Ouj.","Säp.","Okt.","Nov.","Dez.",""],
        amDesignator: "v.M.",
        dateSeparator: ". ",
        dayNames: ["Sunndaach","Mohndaach","Dinnsdaach","Metwoch","Dunnersdaach","Friidaach","Samsdaach"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dddd, 'dä' d. MMMM yyyy HH:mm:ss",
        longDatePattern: "dddd, 'dä' d. MMMM yyyy",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "d. MMMM",
        monthGenitiveNames: ["Jannewa","Fäbrowa","Määz","Aprell","Mai","Juuni","Juuli","Oujoß","Septämber","Oktohber","Novämber","Dezämber",""],
        monthNames: ["Jannewa","Fäbrowa","Määz","Aprell","Mai","Juuni","Juuli","Oujoß","Septämber","Oktohber","Novämber","Dezämber",""],
        pmDesignator: "n.M.",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "d. M. yyyy",
        shortestDayNames: ["Su","Mo","Di","Me","Du","Fr","Sa"],
        shortTimePattern: "HH:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM yyyy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 0,
        CultureName: "ksh-DE",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 4096,
        listSeparator: ";",
        MacCodePage: 2,
        OEMCodePage: 1,
        IsReadOnly: true
    })
});
