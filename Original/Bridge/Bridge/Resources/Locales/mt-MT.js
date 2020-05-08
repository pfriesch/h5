Bridge.merge(new System.Globalization.CultureInfo("mt-MT", true), {
    englishName: "Maltese (Malta)",
    nativeName: "Malti (Malta)",

    numberFormat: Bridge.merge(new System.Globalization.NumberFormatInfo(), {
        nanSymbol: "NaN",
        negativeSign: "-",
        positiveSign: "+",
        negativeInfinitySymbol: "-∞",
        positiveInfinitySymbol: "∞",
        percentSymbol: "%",
        percentGroupSizes: [3],
        percentDecimalDigits: 2,
        percentDecimalSeparator: ".",
        percentGroupSeparator: ",",
        percentPositivePattern: 1,
        percentNegativePattern: 1,
        currencySymbol: "€",
        currencyGroupSizes: [3],
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ".",
        currencyGroupSeparator: ",",
        currencyNegativePattern: 1,
        currencyPositivePattern: 0,
        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: ".",
        numberGroupSeparator: ",",
        numberNegativePattern: 1
    }),

    dateTimeFormat: Bridge.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["Ħad","Tne","Tli","Erb","Ħam","Ġim","Sib"],
        abbreviatedMonthGenitiveNames: ["Jan","Fra","Mar","Apr","Mej","Ġun","Lul","Aww","Set","Ott","Nov","Diċ",""],
        abbreviatedMonthNames: ["Jan","Fra","Mar","Apr","Mej","Ġun","Lul","Aww","Set","Ott","Nov","Diċ",""],
        amDesignator: "AM",
        dateSeparator: "/",
        dayNames: ["Il-Ħadd","It-Tnejn","It-Tlieta","L-Erbgħa","Il-Ħamis","Il-Ġimgħa","Is-Sibt"],
        firstDayOfWeek: 0,
        fullDateTimePattern: "dddd, d 'ta'’ MMMM yyyy HH:mm:ss",
        longDatePattern: "dddd, d 'ta'’ MMMM yyyy",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "d 'ta'’ MMMM",
        monthGenitiveNames: ["Jannar","Frar","Marzu","April","Mejju","Ġunju","Lulju","Awwissu","Settembru","Ottubru","Novembru","Diċembru",""],
        monthNames: ["Jannar","Frar","Marzu","April","Mejju","Ġunju","Lulju","Awwissu","Settembru","Ottubru","Novembru","Diċembru",""],
        pmDesignator: "PM",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd/MM/yyyy",
        shortestDayNames: ["Ħad","Tne","Tli","Erb","Ħam","Ġim","Sib"],
        shortTimePattern: "HH:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM yyyy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: Bridge.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 0,
        CultureName: "mt-MT",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 1082,
        listSeparator: ";",
        MacCodePage: 2,
        OEMCodePage: 1,
        IsReadOnly: true
    })
});
