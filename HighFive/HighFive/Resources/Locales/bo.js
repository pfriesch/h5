H5.merge(new System.Globalization.CultureInfo("bo", true), {
    englishName: "Tibetan",
    nativeName: "བོད་ཡིག",

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
        currencySymbol: "¥",
        currencyGroupSizes: [3,0],
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: ".",
        currencyGroupSeparator: ",",
        currencyNegativePattern: 2,
        currencyPositivePattern: 0,
        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: ".",
        numberGroupSeparator: ",",
        numberNegativePattern: 1
    }),

    dateTimeFormat: H5.merge(new System.Globalization.DateTimeFormatInfo(), {
        abbreviatedDayNames: ["ཉི་མ།","ཟླ་བ།","མིག་དམར།","ལྷག་པ།","ཕུར་བུ།","པ་སངས།","སྤེན་པ།"],
        abbreviatedMonthGenitiveNames: ["ཟླ་ ༡","ཟླ་ ༢","ཟླ་ ༣","ཟླ་ ༤","ཟླ་ ༥","ཟླ་ ༦","ཟླ་ ༧","ཟླ་ ༨","ཟླ་ ༩","ཟླ་ ༡༠","ཟླ་ ༡༡","ཟླ་ ༡༢",""],
        abbreviatedMonthNames: ["ཟླ་ ༡","ཟླ་ ༢","ཟླ་ ༣","ཟླ་ ༤","ཟླ་ ༥","ཟླ་ ༦","ཟླ་ ༧","ཟླ་ ༨","ཟླ་ ༩","ཟླ་ ༡༠","ཟླ་ ༡༡","ཟླ་ ༡༢",""],
        amDesignator: "སྔ་དྲོ",
        dateSeparator: "/",
        dayNames: ["གཟའ་ཉི་མ།","གཟའ་ཟླ་བ།","གཟའ་མིག་དམར།","གཟའ་ལྷག་པ།","གཟའ་ཕུར་བུ།","གཟའ་པ་སངས།","གཟའ་སྤེན་པ།"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "yyyy'ལོའི་ཟླ' M'ཚེས' d HH:mm:ss",
        longDatePattern: "yyyy'ལོའི་ཟླ' M'ཚེས' d",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "ཟླ་Mཚེས་d",
        monthGenitiveNames: ["སྤྱི་ཟླ་དང་པོའི་","སྤྱི་ཟླ་གཉིས་པའི་","སྤྱི་ཟླ་གསུམ་པའི་","སྤྱི་ཟླ་བཞི་པའི་","སྤྱི་ཟླ་ལྔ་པའི་","སྤྱི་ཟླ་དྲུག་པའི་","སྤྱི་ཟླ་བདུན་པའི་","སྤྱི་ཟླ་བརྒྱད་པའི་","སྤྱི་ཟླ་དགུ་པའི་","སྤྱི་ཟླ་བཅུ་པའི་","སྤྱི་ཟླ་བཅུ་གཅིག་པའི་","སྤྱི་ཟླ་བཅུ་གཉིས་པའི་",""],
        monthNames: ["སྤྱི་ཟླ་དང་པོ།","སྤྱི་ཟླ་གཉིས་པ།","སྤྱི་ཟླ་གསུམ་པ།","སྤྱི་ཟླ་བཞི་པ།","སྤྱི་ཟླ་ལྔ་པ།","སྤྱི་ཟླ་དྲུག་པ།","སྤྱི་ཟླ་བདུན་པ།","སྤྱི་ཟླ་བརྒྱད་པ།","སྤྱི་ཟླ་དགུ་པ།","སྤྱི་ཟླ་བཅུ་པ།","སྤྱི་ཟླ་བཅུ་གཅིག་པ།","སྤྱི་ཟླ་བཅུ་གཉིས་པ།",""],
        pmDesignator: "ཕྱི་དྲོ",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "yyyy/M/d",
        shortestDayNames: ["ཉི།","ཟླ།","དམར།","ལྷག","ཕུར།","སངས།","སྤེན།"],
        shortTimePattern: "HH:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "yyyy'ལོའི་ཟླ་' M",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 0,
        CultureName: "bo-CN",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 1105,
        listSeparator: ",",
        MacCodePage: 2,
        OEMCodePage: 1,
        IsReadOnly: true
    })
});
