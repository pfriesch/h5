using H5.Contract;
using H5.Contract.Constants;
using ICSharpCode.NRefactory.CSharp;
using Object.Net.Utilities;
using System.Collections.Generic;
using System.Linq;
using ICSharpCode.NRefactory.TypeSystem;

namespace H5.Translator.TypeScript
{
    public partial class ConstructorBlock : TypeScriptBlock
    {
        public ConstructorBlock(IEmitter emitter, ITypeInfo typeInfo)
            : base(emitter, typeInfo.TypeDeclaration)
        {
            this.Emitter = emitter;
            this.TypeInfo = typeInfo;
        }

        public ITypeInfo TypeInfo
        {
            get;
            set;
        }

        protected override void DoEmit()
        {
            this.EmitCtorForInstantiableClass();
        }

        protected virtual void EmitCtorForInstantiableClass()
        {
            var typeDef = this.Emitter.GetTypeDefinition();
            string name = this.Emitter.Validator.GetCustomTypeName(typeDef, this.Emitter, true, false);

            if (name.IsEmpty())
            {
                name = H5Types.ToTypeScriptName(this.TypeInfo.Type, this.Emitter, false, true);
            }

            if (this.TypeInfo.Ctors.Count == 0)
            {
                this.Write("new ");
                this.WriteOpenCloseParentheses();
                this.WriteColon();
                this.Write(name);
                this.WriteSemiColon();
                this.WriteNewLine();
            }
            else if (this.TypeInfo.Ctors.Count == 1)
            {
                var ctor = this.TypeInfo.Ctors.First();
                if (!ctor.HasModifier(Modifiers.Public))
                {
                    return;
                }

                XmlToJsDoc.EmitComment(this, ctor);

                this.Write("new ");
                this.EmitMethodParameters(ctor.Parameters, ctor);
                this.WriteColon();
                this.Write(name);
                this.WriteSemiColon();
                this.WriteNewLine();
            }
            else
            {
                foreach (var ctor in this.TypeInfo.Ctors)
                {
                    if (!ctor.HasModifier(Modifiers.Public))
                    {
                        continue;
                    }

                    if (ctor.Parameters.Count == 0)
                    {
                        XmlToJsDoc.EmitComment(this, ctor);
                        this.Write("new ()");
                        this.WriteColon();
                        this.Write(name);
                        this.WriteSemiColon();
                        this.WriteNewLine();
                    }

                    XmlToJsDoc.EmitComment(this, ctor);
                    var ctorName = JS.Funcs.CONSTRUCTOR;

                    if (this.TypeInfo.Ctors.Count > 1 && ctor.Parameters.Count > 0)
                    {
                        var overloads = OverloadsCollection.Create(this.Emitter, ctor);
                        ctorName = overloads.GetOverloadName();
                    }

                    this.Write(ctorName);
                    this.WriteColon();
                    this.BeginBlock();

                    this.WriteNew();
                    this.EmitMethodParameters(ctor.Parameters, ctor);
                    this.WriteColon();

                    this.Write(name);
                    this.WriteNewLine();
                    this.EndBlock();

                    this.WriteSemiColon();
                    this.WriteNewLine();
                }
            }
        }

        protected virtual void EmitMethodParameters(IEnumerable<ParameterDeclaration> declarations, AstNode context)
        {
            this.WriteOpenParentheses();
            bool needComma = false;

            foreach (var p in declarations)
            {
                var name = this.Emitter.GetParameterName(p);

                if (needComma)
                {
                    this.WriteComma();
                }

                needComma = true;
                this.Write(name);
                this.WriteColon();
                name = H5Types.ToTypeScriptName(p.Type, this.Emitter);
                this.Write(name);

                var resolveResult = this.Emitter.Resolver.ResolveNode(p.Type, this.Emitter);
                if (resolveResult != null && (resolveResult.Type.IsReferenceType.HasValue && resolveResult.Type.IsReferenceType.Value || resolveResult.Type.IsKnownType(KnownTypeCode.NullableOfT)))
                {
                    this.Write(" | null");
                }
            }

            this.WriteCloseParentheses();
        }
    }
}