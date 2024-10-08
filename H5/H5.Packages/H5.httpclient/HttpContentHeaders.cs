﻿// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;

namespace System.Net.Http.Headers
{
    public sealed class HttpContentHeaders : HttpHeaders
    {
        private readonly HttpContent _parent;

        internal HttpContentHeaders(HttpContent parent) : base(parent._request)
        {
            _parent = parent;
        }
    }
}