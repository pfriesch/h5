﻿// Decompiled with JetBrains decompiler
// Type: Retyped.Primitive.Never
// Assembly: Retyped.Core, Version=1.6.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 9E855DC6-9E83-4420-9E6F-8D2B7A117BBD
// Assembly location: C:\work\curiosity\tesserae\Tesserae\bin\Debug\net461\Retyped.Core.dll

using Bridge;
using System;

namespace Retyped.Primitive
{
  [IgnoreCast]
  [Virtual]
  [ExportedAs("never")]
  public class Never
  {
    private extern Never();

    public static extern implicit operator byte(Never n);

    public static extern implicit operator sbyte(Never n);

    public static extern implicit operator short(Never n);

    public static extern implicit operator ushort(Never n);

    public static extern implicit operator int(Never n);

    public static extern implicit operator uint(Never n);

    public static extern implicit operator long(Never n);

    public static extern implicit operator ulong(Never n);

    public static extern implicit operator float(Never n);

    public static extern implicit operator double(Never n);

    public static extern implicit operator Decimal(Never n);

    public static extern implicit operator bool(Never n);

    public static extern implicit operator char(Never n);

    public static extern implicit operator string(Never n);

    public static extern implicit operator DateTime(Never n);
  }
}
