﻿// Copyright (c) 2010-2013 AlphaSierraPapa for the SharpDevelop Team
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
// to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or
// substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
// PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

using System;

namespace ICSharpCode.NRefactory.TypeSystem.Implementation
{
    /// <summary>
    /// Default implementation of <see cref="IVariable"/>.
    /// </summary>
    public sealed class DefaultVariable : IVariable
    {
        readonly string name;
        readonly DomRegion region;
        readonly IType type;
        readonly object constantValue;
        readonly bool isConst;

        public DefaultVariable(IType type, string name)
        {
            this.type = type ?? throw new ArgumentNullException("type");
            this.name = name ?? throw new ArgumentNullException("name");
        }

        public DefaultVariable(IType type, string name, DomRegion region = default(DomRegion),
                               bool isConst = false, object constantValue = null)
            : this(type, name)
        {
            this.region = region;
            this.isConst = isConst;
            this.constantValue = constantValue;
        }

        public string Name {
            get { return name; }
        }

        public DomRegion Region {
            get { return region; }
        }

        public IType Type {
            get { return type; }
        }

        public bool IsConst {
            get { return isConst; }
        }

        public object ConstantValue {
            get { return constantValue; }
        }

        public SymbolKind SymbolKind {
            get { return SymbolKind.Variable; }
        }

        public ISymbolReference ToReference()
        {
            return new VariableReference(type.ToTypeReference(), name, region, isConst, constantValue);
        }
    }

    public sealed class VariableReference : ISymbolReference
    {
        ITypeReference variableTypeReference;
        string name;
        DomRegion region;
        bool isConst;
        object constantValue;

        public VariableReference(ITypeReference variableTypeReference, string name, DomRegion region, bool isConst, object constantValue)
        {
            this.variableTypeReference = variableTypeReference ?? throw new ArgumentNullException("variableTypeReference");
            this.name = name ?? throw new ArgumentNullException("name");
            this.region = region;
            this.isConst = isConst;
            this.constantValue = constantValue;
        }

        public ISymbol Resolve(ITypeResolveContext context)
        {
            return new DefaultVariable(variableTypeReference.Resolve(context), name, region, isConst, constantValue);
        }
    }
}
