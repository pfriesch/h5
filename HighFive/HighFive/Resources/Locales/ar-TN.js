H5.merge(new System.Globalization.CultureInfo("ar-TN", true), {
    englishName: "Arabic (Tunisia)",
    nativeName: "العربية (تونس)",

    numberFormat: H5.merge(new System.Globalization.NumberFormatInfo(), {
        nanSymbol: "ليس رقمًا",
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
        currencySymbol: "د.ت.‏",
        currencyGroupSizes: [3],
        currencyDecimalDigits: 3,
        currencyDecimalSeparator: ".",
        currencyGroupSeparator: ",",
        currencyNegativePattern: 8,
        currencyPositivePattern: 3,
        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: ".",
        numberGroupSeparator: ",",
        numberNegativePattern: 1
    }),

    dateTimeFormat: H5.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
        abbreviatedMonthGenitiveNames: ["جانفييه","فيفرييه","مارس","أفريل","مي","جوان","جوييه","أوت","سبتمبر","أكتوبر","نوفمبر","ديسمبر",""],
        abbreviatedMonthNames: ["جانفييه","فيفرييه","مارس","أفريل","مي","جوان","جوييه","أوت","سبتمبر","أكتوبر","نوفمبر","ديسمبر",""],
        amDesignator: "ص",
        dateSeparator: "-",
        dayNames: ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dd MMMM, yyyy H:mm:ss",
        longDatePattern: "dd MMMM, yyyy",
        longTimePattern: "H:mm:ss",
        monthDayPattern: "dd MMMM",
        monthGenitiveNames: ["جانفييه","فيفرييه","مارس","أفريل","مي","جوان","جوييه","أوت","سبتمبر","أكتوبر","نوفمبر","ديسمبر",""],
        monthNames: ["جانفييه","فيفرييه","مارس","أفريل","مي","جوان","جوييه","أوت","سبتمبر","أكتوبر","نوفمبر","ديسمبر",""],
        pmDesignator: "م",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd-MM-yyyy",
        shortestDayNames: ["ح","ن","ث","ر","خ","ج","س"],
        shortTimePattern: "H:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM, yyyy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 1256,
        CultureName: "ar-TN",
        EBCDICCodePage: 20420,
        IsRightToLeft: true,
        LCID: 7169,
        listSeparator: ";",
        MacCodePage: 10004,
        OEMCodePage: 720,
        IsReadOnly: true
    })
});
