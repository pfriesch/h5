H5.merge(new System.Globalization.CultureInfo("sr-Cyrl-BA", true), {
    englishName: "Serbian (Cyrillic, Bosnia and Herzegovina)",
    nativeName: "српски (Босна и Херцеговина)",

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
        currencySymbol: "КМ",
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
        abbreviatedDayNames: ["нед","пон","уто","сри","чет","пет","суб"],
        abbreviatedMonthGenitiveNames: ["јан","феб","мар","апр","мај","јун","јул","авг","сеп","окт","нов","дец",""],
        abbreviatedMonthNames: ["јан","феб","мар","апр","мај","јун","јул","авг","сеп","окт","нов","дец",""],
        amDesignator: "",
        dateSeparator: ".",
        dayNames: ["недјеља","понедјељак","уторак","сриједа","четвртак","петак","субота"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "d. MMMM yyyy H:mm:ss",
        longDatePattern: "d. MMMM yyyy",
        longTimePattern: "H:mm:ss",
        monthDayPattern: "d. MMMM",
        monthGenitiveNames: ["јануар","фебруар","март","април","мај","јуни","јули","август","септембар","октобар","новембар","децембар",""],
        monthNames: ["јануар","фебруар","март","април","мај","јуни","јули","август","септембар","октобар","новембар","децембар",""],
        pmDesignator: "",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "d.M.yyyy.",
        shortestDayNames: ["н","п","у","с","ч","п","с"],
        shortTimePattern: "H:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM, yyyy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 1251,
        CultureName: "sr-Cyrl-BA",
        EBCDICCodePage: 21025,
        IsRightToLeft: false,
        LCID: 7194,
        listSeparator: ";",
        MacCodePage: 10007,
        OEMCodePage: 855,
        IsReadOnly: true
    })
});
