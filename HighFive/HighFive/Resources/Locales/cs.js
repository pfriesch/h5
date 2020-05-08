H5.merge(new System.Globalization.CultureInfo("cs", true), {
    englishName: "Czech",
    nativeName: "čeština",

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
        percentGroupSeparator: " ",
        percentPositivePattern: 0,
        percentNegativePattern: 0,
        currencySymbol: "Kč",
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
        abbreviatedDayNames: ["ne","po","út","st","čt","pá","so"],
        abbreviatedMonthGenitiveNames: ["led","úno","bře","dub","kvě","čvn","čvc","srp","zář","říj","lis","pro",""],
        abbreviatedMonthNames: ["led","úno","bře","dub","kvě","čvn","čvc","srp","zář","říj","lis","pro",""],
        amDesignator: "dop.",
        dateSeparator: ".",
        dayNames: ["neděle","pondělí","úterý","středa","čtvrtek","pátek","sobota"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dddd d. MMMM yyyy H:mm:ss",
        longDatePattern: "dddd d. MMMM yyyy",
        longTimePattern: "H:mm:ss",
        monthDayPattern: "d. MMMM",
        monthGenitiveNames: ["ledna","února","března","dubna","května","června","července","srpna","září","října","listopadu","prosince",""],
        monthNames: ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec",""],
        pmDesignator: "odp.",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd.MM.yyyy",
        shortestDayNames: ["ne","po","út","st","čt","pá","so"],
        shortTimePattern: "H:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM yyyy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 1250,
        CultureName: "cs-CZ",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 1029,
        listSeparator: ";",
        MacCodePage: 10029,
        OEMCodePage: 852,
        IsReadOnly: true
    })
});
