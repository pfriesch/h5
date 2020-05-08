Bridge.merge(new System.Globalization.CultureInfo("hr-BA", true), {
    englishName: "Croatian (Bosnia and Herzegovina)",
    nativeName: "hrvatski (Bosna i Hercegovina)",

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

    dateTimeFormat: Bridge.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["ned","pon","uto","sri","čet","pet","sub"],
        abbreviatedMonthGenitiveNames: ["sij","velj","ožu","tra","svi","lip","srp","kol","ruj","lis","stu","pro",""],
        abbreviatedMonthNames: ["sij","velj","ožu","tra","svi","lip","srp","kol","ruj","lis","stu","pro",""],
        amDesignator: "AM",
        dateSeparator: ". ",
        dayNames: ["nedjelja","ponedjeljak","utorak","srijeda","četvrtak","petak","subota"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dddd, d. MMMM yyyy. HH:mm:ss",
        longDatePattern: "dddd, d. MMMM yyyy.",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "d. MMMM",
        monthGenitiveNames: ["siječnja","veljače","ožujka","travnja","svibnja","lipnja","srpnja","kolovoza","rujna","listopada","studenoga","prosinca",""],
        monthNames: ["siječanj","veljača","ožujak","travanj","svibanj","lipanj","srpanj","kolovoz","rujan","listopad","studeni","prosinac",""],
        pmDesignator: "PM",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "d. M. yyyy.",
        shortestDayNames: ["ned","pon","uto","sri","čet","pet","sub"],
        shortTimePattern: "HH:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM yyyy.",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: Bridge.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 1250,
        CultureName: "hr-BA",
        EBCDICCodePage: 870,
        IsRightToLeft: false,
        LCID: 4122,
        listSeparator: ";",
        MacCodePage: 10082,
        OEMCodePage: 852,
        IsReadOnly: true
    })
});
