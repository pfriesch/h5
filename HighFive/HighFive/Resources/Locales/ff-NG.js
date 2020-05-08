H5.merge(new System.Globalization.CultureInfo("ff-NG", true), {
    englishName: "Fulah (Nigeria)",
    nativeName: "Pulaar (Nigeria)",

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
        percentGroupSeparator: ",",
        percentPositivePattern: 1,
        percentNegativePattern: 1,
        currencySymbol: "₦",
        currencyGroupSizes: [3],
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ".",
        currencyGroupSeparator: ",",
        currencyNegativePattern: 1,
        currencyPositivePattern: 2,
        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: ".",
        numberGroupSeparator: ",",
        numberNegativePattern: 1
    }),

    dateTimeFormat: H5.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["alet","alt.","tal.","alar.","alk.","alj.","aset"],
        abbreviatedMonthGenitiveNames: ["samw","feeb","mar","awr","me","suy","sul","ut","sat","okt","now","dees",""],
        abbreviatedMonthNames: ["samw","feeb","mar","awr","me","suy","sul","ut","sat","okt","now","dees",""],
        amDesignator: "",
        dateSeparator: "/",
        dayNames: ["alete","altine","talaata","alarba","alkamiisa","aljumaa","asete"],
        firstDayOfWeek: 0,
        fullDateTimePattern: "dddd, MMMM dd, yyyy HH:mm:ss",
        longDatePattern: "dddd, MMMM dd, yyyy",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "d MMMM",
        monthGenitiveNames: ["samwiee","feeburyee","marsa","awril","me","suyeŋ","sulyee","ut","satambara","oktoobar","nowamburu","deesamburu",""],
        monthNames: ["samwiee","feeburyee","marsa","awril","me","suyeŋ","sulyee","ut","satambara","oktoobar","nowamburu","deesamburu",""],
        pmDesignator: "",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "d/M/yyyy",
        shortestDayNames: ["Al","Te","Ta","Al","Al","Ju","As"],
        shortTimePattern: "H:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM yyyy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 1252,
        CultureName: "ff-NG",
        EBCDICCodePage: 20297,
        IsRightToLeft: false,
        LCID: 1127,
        listSeparator: ";",
        MacCodePage: 10000,
        OEMCodePage: 850,
        IsReadOnly: true
    })
});
