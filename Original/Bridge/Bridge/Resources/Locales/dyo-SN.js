Bridge.merge(new System.Globalization.CultureInfo("dyo-SN", true), {
    englishName: "Jola-Fonyi (Senegal)",
    nativeName: "joola (Senegal)",

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
        percentGroupSeparator: " ",
        percentPositivePattern: 1,
        percentNegativePattern: 1,
        currencySymbol: "CFA",
        currencyGroupSizes: [3],
        currencyDecimalDigits: 0,
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

    dateTimeFormat: Bridge.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["Dim","Ten","Tal","Ala","Ara","Arj","Sib"],
        abbreviatedMonthGenitiveNames: ["Sa","Fe","Ma","Ab","Me","Su","Sú","Ut","Se","Ok","No","De",""],
        abbreviatedMonthNames: ["Sa","Fe","Ma","Ab","Me","Su","Sú","Ut","Se","Ok","No","De",""],
        amDesignator: "AM",
        dateSeparator: "/",
        dayNames: ["Dimas","Teneŋ","Talata","Alarbay","Aramisay","Arjuma","Sibiti"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dddd d MMMM yyyy HH:mm:ss",
        longDatePattern: "dddd d MMMM yyyy",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "MMMM d",
        monthGenitiveNames: ["Sanvie","Fébirie","Mars","Aburil","Mee","Sueŋ","Súuyee","Ut","Settembar","Oktobar","Novembar","Disambar",""],
        monthNames: ["Sanvie","Fébirie","Mars","Aburil","Mee","Sueŋ","Súuyee","Ut","Settembar","Oktobar","Novembar","Disambar",""],
        pmDesignator: "PM",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "d/M/yyyy",
        shortestDayNames: ["Dim","Ten","Tal","Ala","Ara","Arj","Sib"],
        shortTimePattern: "HH:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "yyyy MMMM",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: Bridge.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 0,
        CultureName: "dyo-SN",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 4096,
        listSeparator: ";",
        MacCodePage: 2,
        OEMCodePage: 1,
        IsReadOnly: true
    })
});
