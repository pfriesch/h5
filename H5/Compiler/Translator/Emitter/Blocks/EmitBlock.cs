using H5.Contract;
using H5.Contract.Constants;
using ICSharpCode.NRefactory.CSharp;
using ICSharpCode.NRefactory.TypeSystem;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Object.Net.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace H5.Translator
{
    public class EmitBlock : AbstractEmitterBlock
    {
        protected FileHelper FileHelper { get; set; }

        public EmitBlock(IEmitter emitter)
            : base(emitter, null)
        {
            Emitter = emitter;
            FileHelper = new FileHelper();
        }

        protected virtual StringBuilder GetOutputForType(ITypeInfo typeInfo, string name, bool isMeta = false)
        {
            Module module = null;

            if (typeInfo != null && typeInfo.Module != null)
            {
                module = typeInfo.Module;
            }
            else if (Emitter.AssemblyInfo.Module != null)
            {
                module = Emitter.AssemblyInfo.Module;
            }

            var fileName = typeInfo != null ? typeInfo.FileName : name;

            if (fileName.IsEmpty() && Emitter.AssemblyInfo.OutputBy != OutputBy.Project)
            {
                switch (Emitter.AssemblyInfo.OutputBy)
                {
                    case OutputBy.ClassPath:
                        fileName = typeInfo.Type.FullName;
                        break;

                    case OutputBy.Class:
                        fileName = GetIteractiveClassPath(typeInfo);
                        break;

                    case OutputBy.Module:
                        fileName = module?.Name;
                        break;

                    case OutputBy.NamespacePath:
                    case OutputBy.Namespace:
                        fileName = typeInfo.GetNamespace(Emitter);
                        break;

                    default:
                        break;
                }

                var isPathRelated = Emitter.AssemblyInfo.OutputBy == OutputBy.ClassPath ||
                                    Emitter.AssemblyInfo.OutputBy == OutputBy.NamespacePath;

                if (fileName.IsNotEmpty() && isPathRelated)
                {
                    fileName = fileName.Replace('.', System.IO.Path.DirectorySeparatorChar);

                    if (Emitter.AssemblyInfo.StartIndexInName > 0)
                    {
                        fileName = fileName.Substring(Emitter.AssemblyInfo.StartIndexInName);
                    }
                }
            }

            if (fileName.IsEmpty() && Emitter.AssemblyInfo.FileName != null)
            {
                fileName = Emitter.AssemblyInfo.FileName;
            }

            if (fileName.IsEmpty() && Emitter.Translator.ProjectProperties.AssemblyName != null)
            {
                fileName = Emitter.Translator.ProjectProperties.AssemblyName;
            }

            if (fileName.IsEmpty())
            {
                fileName = AssemblyInfo.DEFAULT_FILENAME;
            }

            // Apply lowerCamelCase to filename if set up in h5.json (or left default)
            if (Emitter.AssemblyInfo.FileNameCasing == FileNameCaseConvert.CamelCase)
            {
                var sepList = new string[] { ".", System.IO.Path.DirectorySeparatorChar.ToString(), "\\", "/" };

                // Populate list only with needed separators, as usually we will never have all four of them
                var neededSepList = new List<string>();

                foreach (var separator in sepList)
                {
                    if (fileName.Contains(separator.ToString()) && !neededSepList.Contains(separator))
                    {
                        neededSepList.Add(separator);
                    }
                }

                // now, separating the filename string only by the used separators, apply lowerCamelCase
                if (neededSepList.Count > 0)
                {
                    foreach (var separator in neededSepList)
                    {
                        var stringList = new List<string>();

                        foreach (var str in fileName.Split(separator[0]))
                        {
                            stringList.Add(str.ToLowerCamelCase());
                        }

                        fileName = stringList.Join(separator);
                    }
                }
                else
                {
                    fileName = fileName.ToLowerCamelCase();
                }
            }

            // Append '.js' extension to file name at translator.Outputs level: this aids in code grouping on files
            // when filesystem is not case sensitive.
            if (!FileHelper.IsJS(fileName))
            {
                fileName += Contract.Constants.Files.Extensions.JS;
            }

            switch (Emitter.AssemblyInfo.FileNameCasing)
            {
                case FileNameCaseConvert.Lowercase:
                    fileName = fileName.ToLower();
                    break;

                default:
                    var lcFileName = fileName.ToLower();

                    // Find a file name that matches (case-insensitive) and use it as file name (if found)
                    // The used file name will use the same casing of the existing one.
                    foreach (var existingFile in Emitter.Outputs.Keys)
                    {
                        if (lcFileName == existingFile.ToLower())
                        {
                            fileName = existingFile;
                        }
                    }

                    break;
            }

            IEmitterOutput output = null;

            if (Emitter.Outputs.ContainsKey(fileName))
            {
                output = Emitter.Outputs[fileName];
            }
            else
            {
                output = new EmitterOutput(fileName) { IsMetadata = isMeta };
                Emitter.Outputs.Add(fileName, output);
            }

            Emitter.EmitterOutput = output;

            if (module == null)
            {
                if (output.NonModuleDependencies == null)
                {
                    output.NonModuleDependencies = new List<IPluginDependency>();
                }
                Emitter.CurrentDependencies = output.NonModuleDependencies;
                return output.NonModuletOutput;
            }

            if (module.Name == "")
            {
                module.Name = H5.Translator.AssemblyInfo.DEFAULT_FILENAME;
            }

            if (output.ModuleOutput.ContainsKey(module))
            {
                Emitter.CurrentDependencies = output.ModuleDependencies[module.Name];
                return output.ModuleOutput[module];
            }

            StringBuilder moduleOutput = new StringBuilder();
            output.ModuleOutput.Add(module, moduleOutput);
            var dependencies = new List<IPluginDependency>();
            output.ModuleDependencies.Add(module.Name, dependencies);

            if (typeInfo != null && typeInfo.Dependencies.Count > 0)
            {
                dependencies.AddRange(typeInfo.Dependencies);
            }

            Emitter.CurrentDependencies = dependencies;

            return moduleOutput;
        }

        /// <summary>
        /// Gets class path iterating until its root class, writing something like this on a 3-level nested class:
        /// RootClass.Lv1ParentClass.Lv2ParentClass.Lv3NestedClass
        /// </summary>
        /// <param name="typeInfo"></param>
        /// <returns></returns>
        private string GetIteractiveClassPath(ITypeInfo typeInfo)
        {
            var fullClassName = typeInfo.Name;
            var maxIterations = 100;
            var curIterations = 0;
            var parent = typeInfo.ParentType;

            while (parent != null && curIterations++ < maxIterations)
            {
                fullClassName = parent.Name + "." + fullClassName;
                parent = parent.ParentType;
            }

            // This should never happen but, just to be sure...
            if (curIterations >= maxIterations)
            {
                throw new EmitterException(typeInfo.TypeDeclaration, "Iteration count for class '" + typeInfo.Type.FullName + "' exceeded " +
                    maxIterations + " depth iterations until root class!");
            }

            return fullClassName;
        }

        private string GetDefaultFileName()
        {
            var defaultFileName = Emitter.Translator.AssemblyInfo.FileName;

            if (string.IsNullOrEmpty(defaultFileName))
            {
                return AssemblyInfo.DEFAULT_FILENAME;
            }

            return Path.GetFileNameWithoutExtension(defaultFileName);
        }

        protected override void DoEmit()
        {
            Emitter.Tag = "JS";
            Emitter.Writers = new Stack<IWriter>();
            Emitter.Outputs = new EmitterOutputs();
            var metas = new Dictionary<IType, JObject>();
            var metasOutput = new Dictionary<string, Dictionary<IType, JObject>>();
            var nsCache = new Dictionary<string, Dictionary<string, int>>();

            Emitter.Translator.Plugins.BeforeTypesEmit(Emitter, Emitter.Types);
            Emitter.ReflectableTypes = GetReflectableTypes();
            var reflectedTypes = Emitter.ReflectableTypes;
            var tmpBuffer = new StringBuilder();
            StringBuilder currentOutput = null;
            Emitter.NamedBoxedFunctions = new Dictionary<IType, Dictionary<string, string>>();

            Emitter.HasModules = Emitter.Types.Any(t => t.Module != null);
            foreach (var type in Emitter.Types)
            {
                Emitter.Translator.Plugins.BeforeTypeEmit(Emitter, type);

                Emitter.Translator.EmitNode = type.TypeDeclaration;
                var typeDef = type.Type.GetDefinition();
                Emitter.Rules = Rules.Get(Emitter, typeDef);

                bool isNative;
                if (typeDef.Kind == TypeKind.Interface && Emitter.Validator.IsExternalInterface(typeDef, out isNative))
                {
                    Emitter.Translator.Plugins.AfterTypeEmit(Emitter, type);
                    continue;
                }

                if (type.IsObjectLiteral)
                {
                    var mode = Emitter.Validator.GetObjectCreateMode(Emitter.GetTypeDefinition(type.Type));
                    var ignore = mode == 0 && !type.Type.GetMethods(null, GetMemberOptions.IgnoreInheritedMembers).Any(m => !m.IsConstructor && !m.IsAccessor);

                    if (Emitter.Validator.IsExternalType(typeDef) || ignore)
                    {
                        Emitter.Translator.Plugins.AfterTypeEmit(Emitter, type);
                        continue;
                    }
                }

                Emitter.InitEmitter();

                ITypeInfo typeInfo;

                if (Emitter.TypeInfoDefinitions.ContainsKey(type.Key))
                {
                    typeInfo = Emitter.TypeInfoDefinitions[type.Key];

                    type.Module = typeInfo.Module;
                    type.FileName = typeInfo.FileName;
                    type.Dependencies = typeInfo.Dependencies;
                    typeInfo = type;
                }
                else
                {
                    typeInfo = type;
                }

                Emitter.SourceFileName = type.TypeDeclaration.GetParent<SyntaxTree>().FileName;
                Emitter.SourceFileNameIndex = Emitter.SourceFiles.IndexOf(Emitter.SourceFileName);

                Emitter.Output = GetOutputForType(typeInfo, null);
                Emitter.TypeInfo = type;
                type.JsName = H5Types.ToJsName(type.Type, Emitter, true, removeScope: false);

                if (Emitter.Output.Length > 0)
                {
                    WriteNewLine();
                }

                tmpBuffer.Length = 0;
                currentOutput = Emitter.Output;
                Emitter.Output = tmpBuffer;

                if (Emitter.TypeInfo.Module != null)
                {
                    Indent();
                }

                var name = H5Types.ToJsName(type.Type, Emitter, true, true, true);
                if (type.Type.DeclaringType != null && JS.Reserved.StaticNames.Any(n => String.Equals(name, n, StringComparison.InvariantCulture)))
                {
                    throw new EmitterException(type.TypeDeclaration, "Nested class cannot have such name: " + name + ". Please rename it.");
                }

                new ClassBlock(Emitter, Emitter.TypeInfo).Emit();
                Emitter.Translator.Plugins.AfterTypeEmit(Emitter, type);

                currentOutput.Append(tmpBuffer.ToString());
                Emitter.Output = currentOutput;
            }

            Emitter.DisableDependencyTracking = true;
            EmitNamedBoxedFunctions();

            var oldDependencies = Emitter.CurrentDependencies;
            var oldEmitterOutput = Emitter.EmitterOutput;
            Emitter.NamespacesCache = new Dictionary<string, int>();

            if (!Emitter.HasModules && Emitter.AssemblyInfo.Reflection.Target != MetadataTarget.Type)
            {
                foreach (var type in Emitter.Types)
                {
                    var typeDef = type.Type.GetDefinition();
                    bool isGlobal = false;
                    if (typeDef != null)
                    {
                        isGlobal = IsGlobalType(typeDef);
                    }

                    if (typeDef.FullName != "System.Object")
                    {
                        var name = H5Types.ToJsName(typeDef, Emitter);

                        if (name == "Object")
                        {
                            continue;
                        }
                    }

                    var isObjectLiteral = Emitter.Validator.IsObjectLiteral(typeDef);
                    var isPlainMode = isObjectLiteral && Emitter.Validator.GetObjectCreateMode(Emitter.H5Types.Get(type.Key).TypeDefinition) == 0;

                    if (isPlainMode)
                    {
                        continue;
                    }

                    if (isGlobal || Emitter.TypeInfo.Module != null || reflectedTypes.Any(t => t == type.Type))
                    {
                        continue;
                    }

                    GetOutputForType(type, null);

                    var fn = Path.GetFileNameWithoutExtension(Emitter.EmitterOutput.FileName);
                    if (!metasOutput.ContainsKey(fn))
                    {
                        metasOutput.Add(fn, new Dictionary<IType, JObject>());
                    }

                    if (Emitter.AssemblyInfo.Reflection.Target == MetadataTarget.File)
                    {
                        if (!nsCache.ContainsKey(fn))
                        {
                            nsCache.Add(fn, new Dictionary<string, int>());
                        }

                        Emitter.NamespacesCache = nsCache[fn];
                    }

                    var meta = MetadataUtils.ConstructTypeMetadata(typeDef, Emitter, true, type.TypeDeclaration.GetParent<SyntaxTree>());

                    if (meta != null)
                    {
                        metas.Add(type.Type, meta);
                        metasOutput[fn].Add(type.Type, meta);
                    }
                }
            }

            var defaultFileName = GetDefaultFileName();
            foreach (var reflectedType in reflectedTypes)
            {
                var typeDef = reflectedType.GetDefinition();
                JObject meta = null;

                var h5Type = Emitter.H5Types.Get(reflectedType, true);
                string fileName = defaultFileName;
                if (h5Type != null && h5Type.TypeInfo != null)
                {
                    GetOutputForType(h5Type.TypeInfo, null);
                    fileName = Emitter.EmitterOutput.FileName;
                }

                fileName = Path.GetFileNameWithoutExtension(fileName);

                if (!metasOutput.ContainsKey(fileName))
                {
                    metasOutput.Add(fileName, new Dictionary<IType, JObject>());
                }

                if (Emitter.AssemblyInfo.Reflection.Target == MetadataTarget.File)
                {
                    if (!nsCache.ContainsKey(fileName))
                    {
                        nsCache.Add(fileName, new Dictionary<string, int>());
                    }

                    Emitter.NamespacesCache = nsCache[fileName];
                }


                if (typeDef != null)
                {
                    var tInfo = Emitter.Types.FirstOrDefault(t => t.Type == reflectedType);
                    SyntaxTree tree = null;

                    if (tInfo != null && tInfo.TypeDeclaration != null)
                    {
                        tree = tInfo.TypeDeclaration.GetParent<SyntaxTree>();
                    }

                    if (tInfo != null && tInfo.Module != null || Emitter.HasModules || Emitter.AssemblyInfo.Reflection.Target == MetadataTarget.Type)
                    {
                        continue;
                    }

                    meta = MetadataUtils.ConstructTypeMetadata(reflectedType.GetDefinition(), Emitter, false, tree);
                }
                else
                {
                    meta = MetadataUtils.ConstructITypeMetadata(reflectedType, Emitter);
                }

                if (meta != null)
                {
                    metas.Add(reflectedType, meta);
                    metasOutput[fileName].Add(reflectedType, meta);
                }
            }

            Emitter.CurrentDependencies = oldDependencies;
            Emitter.EmitterOutput = oldEmitterOutput;

            var lastOutput = Emitter.Output;
            var output = Emitter.AssemblyInfo.Reflection.Output;

            if ((Emitter.AssemblyInfo.Reflection.Target == MetadataTarget.File || Emitter.AssemblyInfo.Reflection.Target == MetadataTarget.Assembly) && Emitter.AssemblyInfo.Module == null)
            {
                if (string.IsNullOrEmpty(output))
                {
                    if (!string.IsNullOrWhiteSpace(Emitter.AssemblyInfo.FileName) &&
                        Emitter.AssemblyInfo.FileName != AssemblyInfo.DEFAULT_FILENAME)
                    {
                        output = System.IO.Path.GetFileNameWithoutExtension(Emitter.AssemblyInfo.FileName) + ".meta.js";
                    }
                    else
                    {
                        output = Emitter.Translator.ProjectProperties.AssemblyName + ".meta.js";
                    }
                }

                Emitter.Output = GetOutputForType(null, output, true);
                Emitter.MetaDataOutputName = Emitter.EmitterOutput.FileName;
            }
            var scriptableAttributes = MetadataUtils.GetScriptableAttributes(Emitter.Resolver.Compilation.MainAssembly.AssemblyAttributes, Emitter, null).ToList();
            bool hasMeta = metas.Count > 0 || scriptableAttributes.Count > 0;

            if (hasMeta)
            {
                if (Emitter.AssemblyInfo.Reflection.Target == MetadataTarget.Assembly)
                {
                    metasOutput = new Dictionary<string, Dictionary<IType, JObject>>();
                    metasOutput.Add(defaultFileName, metas);
                }

                foreach (var metaInfo in metasOutput)
                {
                    if (Emitter.AssemblyInfo.Reflection.Target == MetadataTarget.File && Emitter.AssemblyInfo.Module == null)
                    {
                        var outputName = metaInfo.Key;//Path.GetFileNameWithoutExtension(metaInfo.Key);
                        if (outputName == defaultFileName)
                        {
                            outputName = Emitter.MetaDataOutputName;
                        }
                        else
                        {
                            outputName = outputName + ".meta.js";
                        }

                        Emitter.Output = GetOutputForType(null, outputName, true);

                        if (nsCache.ContainsKey(metaInfo.Key))
                        {
                            Emitter.NamespacesCache = nsCache[metaInfo.Key];
                        } else
                        {
                            Emitter.NamespacesCache = null;
                        }
                    }

                    WriteNewLine();
                    int pos = 0;
                    if (metaInfo.Value.Count > 0)
                    {
                        Write("var $m = " + JS.Types.H5.SET_METADATA + ",");
                        WriteNewLine();
                        Write(H5.Translator.Emitter.INDENT + "$n = ");
                        pos = Emitter.Output.Length;
                        Write(";");
                        WriteNewLine();
                    }

                    foreach (var meta in metaInfo.Value)
                    {
                        var metaData = meta.Value;
                        string typeArgs = "";

                        if (meta.Key.TypeArguments.Count > 0 && !Helpers.IsIgnoreGeneric(meta.Key, Emitter))
                        {
                            StringBuilder arr_sb = new StringBuilder();
                            var comma = false;
                            foreach (var typeArgument in meta.Key.TypeArguments)
                            {
                                if (comma)
                                {
                                    arr_sb.Append(", ");
                                }

                                arr_sb.Append(typeArgument.Name);
                                comma = true;
                            }

                            typeArgs = arr_sb.ToString();
                        }

                        Write(string.Format("$m(\"{0}\", function ({2}) {{ return {1}; }}, $n);", MetadataUtils.GetTypeName(meta.Key, Emitter, false, true, false), metaData.ToString(Formatting.None), typeArgs));
                        WriteNewLine();
                    }

                    if (pos > 0)
                    {
                        var cache = Emitter.NamespacesCache ?? new Dictionary<string, int>();
                        Emitter.Output.Insert(pos, Emitter.ToJavaScript(cache.OrderBy(key => key.Value).Select(item => item.Key).ToArray()));
                    }
                }
            }

            Emitter.Output = lastOutput;

            if (scriptableAttributes.Count > 0)
            {
                JArray attrArr = new JArray();
                foreach (var a in scriptableAttributes)
                {
                    attrArr.Add(MetadataUtils.ConstructAttribute(a, null, Emitter));
                }

                Write(string.Format("$asm.attr= {0};", attrArr.ToString(Formatting.None)));
                WriteNewLine();
            }

            //this.RemovePenultimateEmptyLines(true);

            Emitter.Translator.Plugins.AfterTypesEmit(Emitter, Emitter.Types);
        }

        private static bool IsGlobalType(ITypeDefinition typeDef)
        {
            var isGlobal = typeDef.Attributes.Any(a =>
                            a.AttributeType.FullName == "H5.GlobalMethodsAttribute" ||
                            a.AttributeType.FullName == "H5.MixinAttribute");

            if (!isGlobal && typeDef.DeclaringType is object)
            {
                var parent = typeDef.DeclaringType;
                while (parent is object)
                {
                    isGlobal = parent.GetDefinition().Attributes.Any(a =>
                        a.AttributeType.FullName == "H5.GlobalMethodsAttribute" ||
                        a.AttributeType.FullName == "H5.MixinAttribute");

                    if (isGlobal) { break; }

                    parent = parent.DeclaringType;
                }
            }

            return isGlobal;
        }

        protected virtual void EmitNamedBoxedFunctions()
        {
            if (Emitter.NamedBoxedFunctions.Count > 0)
            {
                Emitter.Comma = false;

                WriteNewLine();
                Write("var " + JS.Vars.DBOX_ + " = { };");
                WriteNewLine();

                foreach (var boxedFunction in Emitter.NamedBoxedFunctions)
                {
                    var name = H5Types.ToJsName(boxedFunction.Key, Emitter, true);

                    WriteNewLine();
                    Write(JS.Funcs.H5_NS);
                    WriteOpenParentheses();
                    WriteScript(name);
                    Write(", " + JS.Vars.DBOX_ + ")");
                    WriteSemiColon();

                    WriteNewLine();
                    WriteNewLine();
                    Write(JS.Types.H5.APPLY + "(" + JS.Vars.DBOX_ + ".");
                    Write(name);
                    Write(", ");
                    BeginBlock();

                    Emitter.Comma = false;
                    foreach (KeyValuePair<string, string> namedFunction in boxedFunction.Value)
                    {
                        EnsureComma();
                        Write(namedFunction.Key.ToLowerCamelCase() + ": " + namedFunction.Value);
                        Emitter.Comma = true;
                    }

                    WriteNewLine();
                    EndBlock();
                    WriteCloseParentheses();
                    WriteSemiColon();
                    WriteNewLine();
                }
            }
        }

        private bool SkipFromReflection(ITypeDefinition typeDef, H5Type h5Type)
        {
            var isObjectLiteral = Emitter.Validator.IsObjectLiteral(typeDef);
            var isPlainMode = isObjectLiteral && Emitter.Validator.GetObjectCreateMode(h5Type.TypeDefinition) == 0;

            if (isPlainMode)
            {
                return true;
            }

            var skip = typeDef.Attributes.Any(a =>
                    a.AttributeType.FullName == "H5.GlobalMethodsAttribute" ||
                    a.AttributeType.FullName == "H5.NonScriptableAttribute" ||
                    a.AttributeType.FullName == "H5.MixinAttribute");

            if(!skip && typeDef.DeclaringType is object)
            {
                var parent = typeDef.DeclaringType;
                while (parent is object)
                {
                    skip = parent.GetDefinition().Attributes.Any(a =>
                        a.AttributeType.FullName == "H5.GlobalMethodsAttribute" ||
                        a.AttributeType.FullName == "H5.NonScriptableAttribute" ||
                        a.AttributeType.FullName == "H5.MixinAttribute");

                    if (skip) { break; }

                    parent = parent.DeclaringType;
                }
            }

            if (!skip && typeDef.FullName != "System.Object")
            {
                var name = H5Types.ToJsName(typeDef, Emitter);

                if (name == "Object" || name == "System.Object" || name == "Function")
                {
                    return true;
                }
            }

            return skip;
        }

        public IType[] GetReflectableTypes()
        {
            var config = Emitter.AssemblyInfo.Reflection;
            var configInternal = ((AssemblyInfo)Emitter.AssemblyInfo).ReflectionInternal;
            //bool? enable = config.Disabled.HasValue ? !config.Disabled : (configInternal.Disabled.HasValue ? !configInternal.Disabled : true);
            bool? enable = null;
            if (config.Disabled.HasValue && !config.Disabled.Value)
            {
                enable = true;
            }
            else if (configInternal.Disabled.HasValue)
            {
                enable = !configInternal.Disabled.Value;
            }
            else if (!config.Disabled.HasValue)
            {
                enable = true;
            }

            TypeAccessibility? typeAccessibility = config.TypeAccessibility.HasValue ? config.TypeAccessibility : (configInternal.TypeAccessibility.HasValue ? configInternal.TypeAccessibility : null);
            string filter = !string.IsNullOrEmpty(config.Filter) ? config.Filter : (!string.IsNullOrEmpty(configInternal.Filter) ? configInternal.Filter : null);

            var hasSettings = !string.IsNullOrEmpty(config.Filter) ||
                              config.MemberAccessibility != null ||
                              config.TypeAccessibility.HasValue ||
                              !string.IsNullOrEmpty(configInternal.Filter) ||
                              configInternal.MemberAccessibility != null ||
                              configInternal.TypeAccessibility.HasValue;

            if (enable.HasValue && !enable.Value)
            {
                return new IType[0];
            }

            if (enable.HasValue && enable.Value && !hasSettings)
            {
                Emitter.IsAnonymousReflectable = true;
            }

            if (typeAccessibility.HasValue)
            {
                Emitter.IsAnonymousReflectable = typeAccessibility.Value.HasFlag(TypeAccessibility.Anonymous);
            }

            List<IType> reflectTypes = new List<IType>();
            var thisAssemblyDef = Emitter.Translator.AssemblyDefinition;
            foreach (var h5Type in Emitter.H5Types)
            {
                var result = false;
                var type = h5Type.Value.Type;
                var typeDef = type.GetDefinition();
                //var thisAssembly = h5Type.Value.TypeInfo != null;
                var thisAssembly = h5Type.Value.TypeDefinition?.Module.Assembly.Equals(thisAssemblyDef) ?? false;
                var external = typeDef != null && Emitter.Validator.IsExternalType(typeDef);

                if (enable.HasValue && enable.Value && !hasSettings && thisAssembly)
                {
                    result = true;
                }

                if (typeDef != null)
                {
                    var skip = SkipFromReflection(typeDef, h5Type.Value);

                    if (skip)
                    {
                        continue;
                    }

                    var attr = typeDef.Attributes.FirstOrDefault(a => a.AttributeType.FullName == "H5.ReflectableAttribute");

                    if (attr == null)
                    {
                        attr = Helpers.GetInheritedAttribute(typeDef, "H5.ReflectableAttribute");

                        if (attr != null)
                        {
                            if (attr.NamedArguments.Count > 0 && attr.NamedArguments.Any(arg => arg.Key.Name == "Inherits"))
                            {
                                var inherits = attr.NamedArguments.First(arg => arg.Key.Name == "Inherits");

                                if (!(bool) inherits.Value.ConstantValue)
                                {
                                    attr = null;
                                }
                            }
                            else
                            {
                                attr = null;
                            }
                        }
                    }

                    if (attr != null)
                    {
                        if (attr.PositionalArguments.Count == 0)
                        {
                            if (thisAssembly)
                            {
                                reflectTypes.Add(type);
                                continue;
                            }
                        }
                        else
                        {
                            var value = attr.PositionalArguments.First().ConstantValue;

                            if ((!(value is bool boolean) || boolean) && thisAssembly)
                            {
                                reflectTypes.Add(type);
                            }

                            continue;
                        }
                    }

                    if (external && attr == null)
                    {
                        if (!string.IsNullOrWhiteSpace(filter) && EmitBlock.MatchFilter(type, filter, thisAssembly, result))
                        {
                            reflectTypes.Add(type);
                        }

                        continue;
                    }
                }

                if (typeAccessibility.HasValue && thisAssembly)
                {
                    result = false;

                    if (typeAccessibility.Value.HasFlag(TypeAccessibility.All))
                    {
                        result = true;
                    }

                    if (typeAccessibility.Value.HasFlag(TypeAccessibility.Anonymous) && type.Kind == TypeKind.Anonymous)
                    {
                        result = true;
                    }

                    if (typeAccessibility.Value.HasFlag(TypeAccessibility.NonAnonymous) && type.Kind != TypeKind.Anonymous)
                    {
                        result = true;
                    }

                    if (typeAccessibility.Value.HasFlag(TypeAccessibility.NonPrivate) && (typeDef == null || !typeDef.IsPrivate))
                    {
                        result = true;
                    }

                    if (typeAccessibility.Value.HasFlag(TypeAccessibility.Public) && (typeDef == null || typeDef.IsPublic || typeDef.IsInternal))
                    {
                        result = true;
                    }

                    if (typeAccessibility.Value.HasFlag(TypeAccessibility.None))
                    {
                        continue;
                    }
                }

                if (!string.IsNullOrEmpty(filter))
                {
                    result = EmitBlock.MatchFilter(type, filter, thisAssembly, result);

                    if (!result)
                    {
                        continue;
                    }
                }

                if (result)
                {
                    reflectTypes.Add(type);
                }
            }

            return reflectTypes.ToArray();
        }

        private static bool MatchFilter(IType type, string filters, bool thisAssembly, bool def)
        {
            var fullName = type.FullName;
            var parts = filters.Split(new char[] {';'}, StringSplitOptions.RemoveEmptyEntries);
            var result = def;

            foreach (var part in parts)
            {
                string pattern;
                string filter = part;
                bool exclude = filter.StartsWith("!");

                if (exclude)
                {
                    filter = filter.Substring(1);
                }

                if (filter == "this")
                {
                    result = !exclude && thisAssembly;
                }
                else
                {
                    if (filter.StartsWith("regex:"))
                    {
                        pattern = filter.Substring(6);
                    }
                    else
                    {
                        pattern = "^" + Regex.Escape(filter).Replace("\\*", ".*").Replace("\\?", ".") + "$";
                    }

                    if (Regex.IsMatch(fullName, pattern))
                    {
                        result = !exclude;
                    }
                }
            }
            return result;
        }
    }
}