﻿// Decompiled with JetBrains decompiler
// Type: H5.es5
// Assembly: H5.es5, Version=2.8.2.0, Culture=neutral, PublicKeyToken=null
// MVID: EC57AC2B-0E02-4A1C-B567-F790F377783B
// Assembly location: C:\work\curiosity\tesserae\Tesserae\bin\Debug\net461\H5.es5.dll

namespace H5.Core
{
    public  static partial class es5
    {
        [IgnoreCast]
        public interface ErrorConstructor : IObject
        {
            [Template("new {this}()")]
            es5.Error New();

            [Template("new {this}({0})")]
            es5.Error New(string message);

            [Template("{this}()")]
            es5.Error Self();

            [Template("{this}({0})")]
            es5.Error Self(string message);

            es5.Error prototype { get; }
        }
    }
}
