H5.merge(new System.Globalization.CultureInfo("en-JM", true), {
    englishName: "English (Jamaica)",
    nativeName: "English (Jamaica)",

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
        currencySymbol: "$",
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

    dateTimeFormat: H5.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
        abbreviatedMonthGenitiveNames: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],
        abbreviatedMonthNames: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],
        amDesignator: "AM",
        dateSeparator: "/",
        dayNames: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        firstDayOfWeek: 0,
        fullDateTimePattern: "dddd, d MMMM yyyy h:mm:ss tt",
        longDatePattern: "dddd, d MMMM yyyy",
        longTimePattern: "h:mm:ss tt",
        monthDayPattern: "d MMMM",
        monthGenitiveNames: ["January","February","March","April","May","June","July","August","September","October","November","December",""],
        monthNames: ["January","February","March","April","May","June","July","August","September","October","November","December",""],
        pmDesignator: "PM",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "d/M/yyyy",
        shortestDayNames: ["Su","Mo","Tu","We","Th","Fr","Sa"],
        shortTimePattern: "h:mm tt",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM yyyy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 1252,
        CultureName: "en-JM",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 8201,
        listSeparator: ",",
        MacCodePage: 10000,
        OEMCodePage: 850,
        IsReadOnly: true
    })
});
