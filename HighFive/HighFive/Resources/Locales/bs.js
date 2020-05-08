H5.merge(new System.Globalization.CultureInfo("bs", true), {
    englishName: "Bosnian",
    nativeName: "bosanski",

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
        currencySymbol: "KM",
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
        abbreviatedDayNames: ["ned","pon","uto","sri","čet","pet","sub"],
        abbreviatedMonthGenitiveNames: ["jan","feb","mar","apr","maj","jun","jul","avg","sep","okt","nov","dec",""],
        abbreviatedMonthNames: ["jan","feb","mar","apr","maj","jun","jul","avg","sep","okt","nov","dec",""],
        amDesignator: "prijepodne",
        dateSeparator: ".",
        dayNames: ["nedjelja","ponedjeljak","utorak","srijeda","četvrtak","petak","subota"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dddd, d. MMMM yyyy. HH:mm:ss",
        longDatePattern: "dddd, d. MMMM yyyy.",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "d. MMMM",
        monthGenitiveNames: ["januar","februar","mart","april","maj","juni","juli","avgust","septembar","oktobar","novembar","decembar",""],
        monthNames: ["januar","februar","mart","april","maj","juni","juli","avgust","septembar","oktobar","novembar","decembar",""],
        pmDesignator: "popodne",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "d.M.yyyy.",
        shortestDayNames: ["ned","pon","uto","sri","čet","pet","sub"],
        shortTimePattern: "HH:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM yyyy.",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 1250,
        CultureName: "bs-Latn-BA",
        EBCDICCodePage: 870,
        IsRightToLeft: false,
        LCID: 5146,
        listSeparator: ";",
        MacCodePage: 10082,
        OEMCodePage: 852,
        IsReadOnly: true
    })
});
