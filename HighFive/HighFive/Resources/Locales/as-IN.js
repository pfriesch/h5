H5.merge(new System.Globalization.CultureInfo("as-IN", true), {
    englishName: "Assamese (India)",
    nativeName: "অসমীয়া (ভাৰত)",

    numberFormat: H5.merge(new System.Globalization.NumberFormatInfo(), {
        nanSymbol: "NaN",
        negativeSign: "-",
        positiveSign: "+",
        negativeInfinitySymbol: "-∞",
        positiveInfinitySymbol: "∞",
        percentSymbol: "%",
        percentGroupSizes: [3,2],
        percentDecimalDigits: 2,
        percentDecimalSeparator: ".",
        percentGroupSeparator: ",",
        percentPositivePattern: 1,
        percentNegativePattern: 1,
        currencySymbol: "₹",
        currencyGroupSizes: [3,2],
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ".",
        currencyGroupSeparator: ",",
        currencyNegativePattern: 12,
        currencyPositivePattern: 2,
        numberGroupSizes: [3,2],
        numberDecimalDigits: 2,
        numberDecimalSeparator: ".",
        numberGroupSeparator: ",",
        numberNegativePattern: 1
    }),

    dateTimeFormat: H5.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["ৰবি.","সোম.","মঙ্গল.","বুধ.","বৃহ.","শুক্র.","শনি."],
        abbreviatedMonthGenitiveNames: ["জানু","ফেব্রু","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগষ্ট","চেপ্টে","অক্টো","নবে","ডিচে",""],
        abbreviatedMonthNames: ["জানু","ফেব্রু","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগষ্ট","চেপ্টে","অক্টো","নবে","ডিচে",""],
        amDesignator: "ৰাতিপু",
        dateSeparator: "-",
        dayNames: ["ৰবিবাৰ","সোমবাৰ","মঙ্গলবাৰ","বুধবাৰ","বৃহস্পতিবাৰ","শুক্রবাৰ","শনিবাৰ"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "yyyy,MMMM dd, dddd tt h:mm:ss",
        longDatePattern: "yyyy,MMMM dd, dddd",
        longTimePattern: "tt h:mm:ss",
        monthDayPattern: "d MMMM",
        monthGenitiveNames: ["জানুৱাৰী","ফেব্রুৱাৰী","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগষ্ট","চেপ্টেম্বৰ","অক্টোবৰ","নবেম্বৰ","ডিচেম্বৰ",""],
        monthNames: ["জানুৱাৰী","ফেব্রুৱাৰী","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগষ্ট","চেপ্টেম্বৰ","অক্টোবৰ","নবেম্বৰ","ডিচেম্বৰ",""],
        pmDesignator: "আবেলি",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd-MM-yyyy",
        shortestDayNames: ["ৰ","সো","ম","বু","বৃ","শু","শ"],
        shortTimePattern: "tt h:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "MMMM,yy",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 0,
        CultureName: "as-IN",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 1101,
        listSeparator: ",",
        MacCodePage: 2,
        OEMCodePage: 1,
        IsReadOnly: true
    })
});
