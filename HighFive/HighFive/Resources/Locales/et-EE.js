H5.merge(new System.Globalization.CultureInfo("et-EE", true), {
    englishName: "Estonian (Estonia)",
    nativeName: "eesti (Eesti)",

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
        percentPositivePattern: 1,
        percentNegativePattern: 1,
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
        abbreviatedDayNames: ["P","E","T","K","N","R","L"],
        abbreviatedMonthGenitiveNames: ["jaan","veebr","märts","apr","mai","juuni","juuli","aug","sept","okt","nov","dets",""],
        abbreviatedMonthNames: ["jaan","veebr","märts","apr","mai","juuni","juuli","aug","sept","okt","nov","dets",""],
        amDesignator: "AM",
        dateSeparator: ".",
        dayNames: ["pühapäev","esmaspäev","teisipäev","kolmapäev","neljapäev","reede","laupäev"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dddd, d. MMMM yyyy HH:mm:ss",
        longDatePattern: "dddd, d. MMMM yyyy",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "d. MMMM",
        monthGenitiveNames: ["jaanuar","veebruar","märts","aprill","mai","juuni","juuli","august","september","oktoober","november","detsember",""],
        monthNames: ["jaanuar","veebruar","märts","aprill","mai","juuni","juuli","august","september","oktoober","november","detsember",""],
        pmDesignator: "PM",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd.MM.yyyy",
        shortestDayNames: ["P","E","T","K","N","R","L"],
        shortTimePattern: "HH:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM yyyy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 1257,
        CultureName: "et-EE",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 1061,
        listSeparator: ";",
        MacCodePage: 10029,
        OEMCodePage: 775,
        IsReadOnly: true
    })
});
