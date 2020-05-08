H5.merge(new System.Globalization.CultureInfo("nl-SR", true), {
    englishName: "Dutch (Suriname)",
    nativeName: "Nederlands (Suriname)",

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
        percentPositivePattern: 1,
        percentNegativePattern: 1,
        currencySymbol: "$",
        currencyGroupSizes: [3],
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ",",
        currencyGroupSeparator: ".",
        currencyNegativePattern: 12,
        currencyPositivePattern: 2,
        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: ",",
        numberGroupSeparator: ".",
        numberNegativePattern: 1
    }),

    dateTimeFormat: H5.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["zo","ma","di","wo","do","vr","za"],
        abbreviatedMonthGenitiveNames: ["jan.","feb.","mrt.","apr.","mei","jun.","jul.","aug.","sep.","okt.","nov.","dec.",""],
        abbreviatedMonthNames: ["jan.","feb.","mrt.","apr.","mei","jun.","jul.","aug.","sep.","okt.","nov.","dec.",""],
        amDesignator: "a.m.",
        dateSeparator: "-",
        dayNames: ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dddd d MMMM yyyy HH:mm:ss",
        longDatePattern: "dddd d MMMM yyyy",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "d MMMM",
        monthGenitiveNames: ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december",""],
        monthNames: ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december",""],
        pmDesignator: "p.m.",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd-MM-yyyy",
        shortestDayNames: ["zo","ma","di","wo","do","vr","za"],
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
        CultureName: "nl-SR",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 4096,
        listSeparator: ";",
        MacCodePage: 10000,
        OEMCodePage: 850,
        IsReadOnly: true
    })
});
