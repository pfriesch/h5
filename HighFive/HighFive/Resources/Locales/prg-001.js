H5.merge(new System.Globalization.CultureInfo("prg-001", true), {
    englishName: "Prussian (World)",
    nativeName: "prūsiskan (swītai)",

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
        currencySymbol: "XDR",
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
        abbreviatedDayNames: ["nad","pan","wis","pus","ket","pēn","sab"],
        abbreviatedMonthGenitiveNames: ["rag","was","pūl","sak","zal","sīm","līp","dag","sil","spa","lap","sal",""],
        abbreviatedMonthNames: ["rag","was","pūl","sak","zal","sīm","līp","dag","sil","spa","lap","sal",""],
        amDesignator: "AM",
        dateSeparator: ".",
        dayNames: ["nadīli","panadīli","wisasīdis","pussisawaiti","ketwirtiks","pēntniks","sabattika"],
        firstDayOfWeek: 1,
        fullDateTimePattern: "dddd, yyyy 'mettas' d. MMMM HH:mm:ss",
        longDatePattern: "dddd, yyyy 'mettas' d. MMMM",
        longTimePattern: "HH:mm:ss",
        monthDayPattern: "MMMM d",
        monthGenitiveNames: ["rags","wassarins","pūlis","sakkis","zallaws","sīmenis","līpa","daggis","sillins","spallins","lapkrūtis","sallaws",""],
        monthNames: ["rags","wassarins","pūlis","sakkis","zallaws","sīmenis","līpa","daggis","sillins","spallins","lapkrūtis","sallaws",""],
        pmDesignator: "PM",
        rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
        shortDatePattern: "dd.MM.yyyy",
        shortestDayNames: ["nad","pan","wis","pus","ket","pēn","sab"],
        shortTimePattern: "HH:mm",
        sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
        sortableDateTimePattern1: "yyyy'-'MM'-'dd",
        timeSeparator: ":",
        universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
        yearMonthPattern: "yyyy MMMM",
        roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.fffffffzzz"
    }),

    TextInfo: H5.merge(new System.Globalization.TextInfo(), {
        ANSICodePage: 0,
        CultureName: "prg-001",
        EBCDICCodePage: 500,
        IsRightToLeft: false,
        LCID: 4096,
        listSeparator: ";",
        MacCodePage: 2,
        OEMCodePage: 1,
        IsReadOnly: true
    })
});
