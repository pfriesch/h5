﻿// Decompiled with JetBrains decompiler
// Type: Retyped.Primitive.BooleanConstructor
// Assembly: Retyped.es5, Version=2.8.2.0, Culture=neutral, PublicKeyToken=null
// MVID: EC57AC2B-0E02-4A1C-B567-F790F377783B
// Assembly location: C:\work\curiosity\tesserae\Tesserae\bin\Debug\net461\Retyped.es5.dll

using Bridge;

namespace Retyped.Primitive
{
  [IgnoreCast]
  [Namespace(false)]
  public interface BooleanConstructor : IObject
  {
    [Template("new {this}()")]
    Boolean New();

    [Template("new {this}({0})")]
    Boolean New(object value);

    [Template("{this}()")]
    bool Self();

    [Template("{this}({0})")]
    bool Self(object value);

    Boolean prototype { get; }
  }
}
