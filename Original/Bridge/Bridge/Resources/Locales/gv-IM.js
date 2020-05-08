Bridge.merge(new System.Globalization.CultureInfo("gv-IM", true), {
    englishName: "Manx (Isle of Man)",
    nativeName: "Gaelg (Ellan Vannin)",

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
        currencySymbol: "£",
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
        abbreviatedDayNames: ["Jed","Jel","Jem","Jerc","Jerd","Jeh","Jes"],
        abbreviatedMonthGenitiveNames: ["J-guer","T-arree","Mayrnt","Avrril","Boaldyn","M-souree","J-souree","Luanistyn","M-fouyir","J-fouyir","M-Houney","M-Nollick",""],
        abbreviatedMonthNames: ["J-guer","T-arree","Mayrnt","Avrril","Boaldyn","M-souree","J-souree","Luanistyn","M-fouyir","J-fouyir","M-Houney","M-Nollick",""],
        amDesignator: "a.m.",
        dateSeparator: "/",
        dayNames: ["Jedoonee","Jelhein","Jemayrt","Jercean","Jerdein","Jeheiney","Jesarn"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dddd dd MMMM yyyy HH:mm:ss",
        longDatePattern: "dddd dd MMMM yyyy",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "MMMM d",
        monthGenitiveNames: ["Jerrey-geuree","Toshiaght-arree","Mayrnt","Averil","Boaldyn","Mean-souree","Jerrey-souree","Luanistyn","Mean-fouyir","Jerrey-fouyir","Mee Houney","Mee ny Nollick",""],
        monthNames: ["Jerrey-geuree","Toshiaght-arree","Mayrnt","Averil","Boaldyn","Mean-souree","Jerrey-souree","Luanistyn","Mean-fouyir","Jerrey-fouyir","Mee Houney","Mee ny Nollick",""],
        pmDesignator: "p.m.",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd/MM/yyyy",
        shortestDayNames: ["Jed","Jel","Jem","Jerc","Jerd","Jeh","Jes"],
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
        CultureName: "gv-IM",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 4096,
        listSeparator: ";",
        MacCodePage: 2,
        OEMCodePage: 1,
        IsReadOnly: true
    })
});
